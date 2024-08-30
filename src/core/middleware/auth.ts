import { HTTP_METHOD } from '@prisma/client'
import { createAuthTokens, validateJwtToken } from '@app/lib/security.js'
import { GENERAL_CONFIG_KEY, IUserTokenGet, IErrors } from '@app/shared-models/interfaces/index.js'
import { clearTokenCookies, respUnsuccess, setRefreshTokenInCookie } from '@app/utility/helpers/index.js'
import { container } from 'tsyringe'
import { logger } from '@app/lib/logger.js'
import Database from '@app/database/index.js'
import { FastifyReply, FastifyRequest, preHandlerAsyncHookHandler } from 'fastify'
import {
  HEADER_ACCESS_TOKEN_KEY,
  HEADER_CUSTOM_DOMAIN,
  HEADER_USER_HASH,
  REFRESH_TOKEN_KEY,
} from '@app/utility/constants/index.js'
import { generateError } from '../error/errorGenerator.js'
import { IRefreshToken } from '@app/shared-models/interfaces/tokens/IRefreshToken.js'
import { getConfigs } from '@app/lib/config.validator.js'
import dayjs from 'dayjs'
import { Transaction } from '@app/database/transaction.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import UserRepository from '@app/database/entities/user/user.repo.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'

export const handleAuthorization = async (
  req: FastifyRequest,
  reply: FastifyReply,
  accessToken: string,
  isPublic = false,
  checkTokens = false,
) => {
  accessToken = accessToken?.split(' ')[1]
  const repo = getRepo()
  const helper = getHelper()

  const OtherUsers: { user_id: number; user_hash: string }[] = []
  const oldJtis: {
    [key: string]: {
      user_id: number
      user_hash: string
    }
  } = {}

  if (req.headers.cookie) {
    const splittedCookies = req.headers.cookie.split(';')
    let refreshTokenCounter = 0

    for (const cookie of splittedCookies) {
      if (cookie.search('uni_refresh_token') >= 0) {
        refreshTokenCounter++
      }
    }

    if (refreshTokenCounter > 1) {
      clearTokenCookies(reply, req.hostname, true)

      throw generateError(
        [{ key: IErrors.REFRESH_TOKEN_INVALID, message: 'Invalid refresh token. Please login again.' }],
        'UNAUTHORIZED',
      )
    }
  }

  if (!accessToken) {
    throw generateError([{ key: IErrors.ACCESS_TOKEN_EXPIRED, message: 'access token invalid' }], 'UNAUTHORIZED')
  }

  const access = validateJwtToken<IUserTokenGet>(accessToken)

  const refresh = validateJwtToken<IRefreshToken>(req.cookies[REFRESH_TOKEN_KEY] as string)

  const user_hash = req.headers[HEADER_USER_HASH] as string | undefined

  if (access?.err || !access?.decoded) {
    if (isPublic) return
    throw generateError(
      [{ key: IErrors.ACCESS_TOKEN_EXPIRED, message: 'access token expired! Please login' }],
      'UNAUTHORIZED',
    )
  }

  if (user_hash) {
    const isUserAuthenticated = access.decoded.users.find((decodedUser) => decodedUser.user_hash === user_hash)

    if (!isUserAuthenticated) {
      throw generateError([{ key: IErrors.ACCESS_TOKEN_INVALID, message: 'header user_hash is invalid' }], 'FORBIDDEN')
    }

    access.decoded.user_hash = user_hash
    access.decoded.user_id = isUserAuthenticated.user_id
  }

  // amir this logic need to be review
  /*   if (access.decoded.client_id) {
    const { client_id } = access.decoded;
    req.client = { client_id }t
    const isGranted = await checkServiceScope(req, reply, isPublic);
    if (!isGranted) throw generateError([ { message: 'scope is invalid' } ], 'FORBIDDEN');
  } */

  if (!access.decoded.user_hash) {
    access.decoded.user_hash = access.decoded.users[0].user_hash
    access.decoded.user_id = access.decoded.users[0].user_id
  }

  const jtis: {
    [jti: string]: {
      user_id: number
      user_hash: string
    }
  } = access.decoded.jti

  let userJti: string | undefined

  let invalidRefresh = false

  for (const jti in jtis) {
    if (!Reflect.ownKeys(jtis[jti]).length) {
      invalidRefresh = true
      continue
    }

    if (jtis[jti].user_hash === access.decoded.user_hash) {
      userJti = jti
    } else {
      oldJtis[jti] = jtis[jti]
      OtherUsers.push(jtis[jti])
    }
  }

  if (!userJti) {
    if (access.decoded.users.length === 1) {
      clearTokenCookies(reply, req.hostname)
    }

    throw generateError(
      [{ key: IErrors.REFRESH_TOKEN_INVALID, message: 'session is expired! please login' }],
      'UNAUTHORIZED',
    )
  }

  const isSessionExists = await repo.user.getActiveSessionByJti(userJti)

  if (!isSessionExists || isSessionExists.session_user?.[0].user.role === 'deleted' || invalidRefresh) {
    clearTokenCookies(reply, req.hostname)

    if (OtherUsers.length) {
      const { REFRESH_TOKEN_AGE_DAY } = getConfigs()

      const newTokens = createAuthTokens(
        OtherUsers[0].user_id,
        OtherUsers[0].user_hash,
        access.decoded.client_id,
        OtherUsers,
        oldJtis,
        true,
      )
      setRefreshTokenInCookie(reply, newTokens.refresh_token as string, req.hostname, {
        refresh_token_expiry_day: REFRESH_TOKEN_AGE_DAY,
        header_custom_domain: req.headers[HEADER_CUSTOM_DOMAIN] as string,
      })
    }

    if (isSessionExists) {
      await repo.user.deleteAllUserSessions(access.decoded.user_id)
    }

    throw generateError([{ key: IErrors.REFRESH_TOKEN_EXPIRED, message: 'session expired! Please login' }], 'UNAUTHORIZED')
  }

  if (isSessionExists.session_user?.[0].user.role === 'anonymous') {
    const oneDayTimeWindow = dayjs.utc(isSessionExists.session_user?.[0].user.created_at).add(1, 'day').toDate()

    if (oneDayTimeWindow < new Date()) {
      const transaction = container.resolve(Transaction)
      await transaction.start(async (ctx) => {
        await helper.user.deleteUser(
          access.decoded?.user_id as number,
          req.headers[HEADER_ACCESS_TOKEN_KEY] as string,
          ctx,
        )
      })
      clearTokenCookies(reply, req.hostname)

      if (OtherUsers.length) {
        const { REFRESH_TOKEN_AGE_DAY } = getConfigs()

        const newTokens = createAuthTokens(
          OtherUsers[0].user_id,
          OtherUsers[0].user_hash,
          access.decoded.client_id,
          OtherUsers,
          oldJtis,
          true,
        )
        setRefreshTokenInCookie(reply, newTokens.refresh_token as string, req.hostname, {
          refresh_token_expiry_day: REFRESH_TOKEN_AGE_DAY,
          header_custom_domain: req.headers[HEADER_CUSTOM_DOMAIN] as string,
        })
      }

      throw generateError(
        [{ key: IErrors.REFRESH_TOKEN_EXPIRED, message: 'session expired! Please login' }],
        'UNAUTHORIZED',
      )
    }
  }

  if (typeof access.decoded.user_id === 'number') {
    if (jtis[userJti].user_id !== access.decoded.user_id) {
      throw generateError([{ key: IErrors.REFRESH_TOKEN_EXPIRED, message: 'Incompatible tokens!' }], 'UNAUTHORIZED')
    }
  } else if (Array.isArray(access.decoded.user_id)) {
    if (!(access.decoded.user_id as number[]).includes(jtis[userJti].user_id)) {
      throw generateError([{ key: IErrors.REFRESH_TOKEN_EXPIRED, message: 'Incompatible tokens!' }], 'UNAUTHORIZED')
    }
  }

  req.user = access.decoded

  if (checkTokens && refresh.decoded) {
    let isAccessHasMoreData = false
    const refresh_jtis: {
      [jti: string]: {
        user_id: number
        user_hash: string
      }
    } = JSON.parse(refresh.decoded.jti)

    for (const key in jtis) {
      const isSessionExists = await repo.user.getActiveSessionByJti(key)

      if (isSessionExists) {
        let isSessionExistsInRefresh = false

        for (const refresh_key in refresh_jtis) {
          if (key === refresh_key) {
            isSessionExistsInRefresh = true
            break
          }
        }

        if (!isSessionExistsInRefresh) {
          isAccessHasMoreData = true
          refresh_jtis[key] = jtis[key]
        }
      }
    }

    if (isAccessHasMoreData) {
      const { REFRESH_TOKEN_AGE_DAY } = getConfigs()

      const newTokens = createAuthTokens(
        access.decoded.user_id,
        access.decoded.user_hash,
        access.decoded.client_id,
        OtherUsers,
        refresh_jtis,
        true,
      )
      setRefreshTokenInCookie(reply, newTokens.refresh_token as string, req.hostname, {
        refresh_token_expiry_day: REFRESH_TOKEN_AGE_DAY,
        header_custom_domain: req.headers[HEADER_CUSTOM_DOMAIN] as string,
      })
    }
  }

  if (!refresh.decoded) {
    const domainArray = req.hostname.split('.')
    const custom_domain =
      req.headers[HEADER_CUSTOM_DOMAIN] ?? domainArray.slice(Math.max(domainArray.length - 2, 0)).join('.')

    if (custom_domain && typeof custom_domain === 'string') {
      const workspaceWithCustomDomain = await repo.workspace.checkDomainExistence(custom_domain)

      if (workspaceWithCustomDomain) {
        // const isMember = await repo.workspace.getWorkspaceUser(
        //   workspaceWithCustomDomain.workspace.workspace_id,
        //   access.decoded.user_id,
        // );

        // if (isMember) {
        const { REFRESH_TOKEN_AGE_DAY } = getConfigs()

        const newTokens = createAuthTokens(
          access.decoded.user_id,
          access.decoded.user_hash,
          access.decoded.client_id,
          OtherUsers,
          jtis,
          true,
        )
        setRefreshTokenInCookie(reply, newTokens.refresh_token as string, custom_domain, {
          refresh_token_expiry_day: REFRESH_TOKEN_AGE_DAY,
          header_custom_domain: custom_domain as string,
        })
        // }
      }
    }
  }

  req.user.refresh_token = {
    jtis,
    expiry: refresh.decoded?.exp,
  }

  await rateLimiter(req, reply)
}

// dont use RequestHandler for this function
/**
 * Middleware function for authorization.
 * @param options - Optional configuration options.
 * @param options.isPublic - Flag indicating if the API endpoint is public (default: false).
 * @param options.checkTokens - Flag indicating if tokens should be checked (default: undefined).
 * @returns The preHandlerAsyncHookHandler function.
 */
export const authorization = (options?: { isPublic?: boolean; checkTokens?: boolean }): preHandlerAsyncHookHandler => {
  return async (req, reply) => {
    const isPublic = options?.isPublic ?? false
    // handle header authorization
    const access_token = req.headers?.[HEADER_ACCESS_TOKEN_KEY] as string

    // if api is public and there is no auth we return next for continue flow
    if (!access_token && isPublic) return

    console.log('access_token: ', access_token)
    // handle cookie authorization
    return handleAuthorization(req, reply, access_token, isPublic, options?.checkTokens)
  }
}

// dont use RequestHandler for this function
export const monitoringAuth = (): preHandlerAsyncHookHandler => {
  return async (req, reply) => {
    const access_token = req.headers?.[HEADER_ACCESS_TOKEN_KEY] as string
    const { MONITORING_ACCESS_TOKEN, GRAFANA_SERVER_IP } = getConfigs()

    if (
      access_token !== MONITORING_ACCESS_TOKEN
      // || req.ip !== GRAFANA_SERVER_IP
    ) {
      throw generateError([{ key: IErrors.ACCESS_TOKEN_EXPIRED, message: 'access token invalid' }], 'UNAUTHORIZED')
    }
  }
}

export async function removeRocketchatToken(jti: string) {
  const repo = getRepo()

  const rocketchat_tokens = await repo.rocketchatToken.getRocketchatTokenByJti(jti)
  rocketchat_tokens.forEach((token) => {
    if (token.workspace_user.chat_user_id) {
      repo.rocketChat.deleteUserToken(token.workspace_user.chat_user_id, token.token)
    }
  })
  repo.rocketchatToken.removeTokenByJti(jti)
}

async function rateLimiter(req: FastifyRequest, reply: FastifyReply) {
  const db = container.resolve(Database)
  const repo = getRepo()

  if (req.user?.user_id) {
    const user_id = req.user.user_id
    const user = await repo.user.getByIDForRateLimit(user_id)

    if (user) {
      const userPermanentBanCount = await repo.generalConfig.getConfigWithKey(GENERAL_CONFIG_KEY.user_permanent_ban_count)

      if (user.ban_count >= parseInt(userPermanentBanCount.value)) {
        respUnsuccess(
          reply,
          [{ message: 'Your account is banned permanently. If you thinks it`s a mistake, please reach our contacts' }],
          'TOO_MANY_REQUESTS',
        )
        return true
      }

      const isUserBan = await db.getRedis().get(`ban:user-${user_id}`)

      if (isUserBan === 'true') {
        respUnsuccess(reply, [{ message: 'Rate limit exceeded. Please try again later.' }], 'TOO_MANY_REQUESTS')
        return true
      }

      increaseUserRateLimit(user)
    }
  }
}

async function increaseUserRateLimit(user: NonNullable<AwaitedReturn<UserRepository['getByIDForRateLimit']>>) {
  const db = container.resolve(Database)
  const repo = getRepo()

  const requestCount = await db.getRedis().get(`limit:user-${user.user_id}`)

  if (!requestCount) {
    const ttl_time = await repo.generalConfig.getConfigWithKey(GENERAL_CONFIG_KEY.req_counter_ttl_time)

    await db.getRedis().set(`limit:user-${user.user_id}`, '1', 'EX', parseInt(ttl_time.value))
  } else {
    const max_req_count = await repo.generalConfig.getConfigWithKey(GENERAL_CONFIG_KEY.max_req_in_specific_time)

    if (parseInt(requestCount) >= parseInt(max_req_count.value)) {
      logger.warning(`user with id: ${user.user_id} has reached his/her request limit`)

      const updatedUser = await repo.user.updateByID(user.user_id, { ban_count: user.ban_count + 1 })
      const userBanTime = await repo.generalConfig.getConfigWithKey(GENERAL_CONFIG_KEY.user_ban_time)

      await db
        .getRedis()
        .set(`ban:user-${user.user_id}`, 'true', 'EX', parseInt(userBanTime.value) * updatedUser.ban_count)
      await db.getRedis().incrby(`limit:user-${user.user_id}`, 1)
    } else {
      await db.getRedis().incrby(`limit:user-${user.user_id}`, 1)
    }
  }
}

async function checkServiceScope(req: FastifyRequest, reply: FastifyReply, isPublic?: boolean) {
  const repo = getRepo()
  let related: string | undefined
  const clientScopes = await repo.legalerConnectApikey.getClientScopes(req.client.client_id)
  let isAuthorize = false

  if (clientScopes?.api_connect_client_action?.length) {
    // const path = req.baseUrl;
    const path = ''
    const method = req.method.toUpperCase() as HTTP_METHOD

    clientScopes.api_connect_client_action.find((api_connect_client_action) => {
      if (!api_connect_client_action?.action?.parent_id) {
        for (let i = 0; i < api_connect_client_action.action.action?.length; i++) {
          const path = api_connect_client_action.action.action[i].path

          if (path) {
            const routeRegex = new RegExp(path)

            if (routeRegex.test(path) && api_connect_client_action.action.action[i].method === method) {
              isAuthorize = true
              related = api_connect_client_action?.action.action[i].scope.split('.')[1]

              return true
            }
          }
        }
      }

      if (api_connect_client_action.action.path) {
        const routeRegex = new RegExp(api_connect_client_action.action.path)

        if (routeRegex.test(path) && api_connect_client_action.action.method === method) {
          isAuthorize = true
          related = api_connect_client_action?.action.scope.split('.')[1]
          return true
        }
      }
    })

    reply.client = {
      client_id: req.client.client_id,
      method,
      description: path,
      origin: `${req.protocol}://${req.hostname}`,
      related,
      ip_address: (req.headers['x-forwarded-for'] as string) ?? req.socket.remoteAddress,
    }
    return isAuthorize || isPublic
  }

  return respUnsuccess(reply, [], 'FORBIDDEN')
}
