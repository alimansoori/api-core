import { IFormResponse, IErrors, PERMISSION, IErrorForm, IPaginationRes } from '@app/shared-models/index.js'
import { logger } from '@app/lib/logger.js'
import bcrypt from 'bcrypt'
import { getConfigs } from '@app/lib/config.validator.js'
import { ATTENDEE_REQUEST_STATUS, URL_PRIVACY } from '@prisma/client'
import { generateError, HTTP_STATUS } from '@app/core/error/errorGenerator.js'
import { FastifyReply } from 'fastify'
import { REFRESH_TOKEN_KEY } from '../constants/index.js'
import { isDevelopment, isTest } from '@app/utility/helpers/core.helpers.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'

export const clearTokenCookies = (reply: FastifyReply, domain: string, clearAllCookies?: boolean) => {
  const mainDomain =
    domain.startsWith('192.168.1.') || domain === 'localhost' || !domain
      ? undefined
      : '.' +
        domain
          .split('.')
          .slice(Math.max(domain.split('.').length - 2, 0))
          .join('.')

  if (!clearAllCookies) {
    reply.clearCookie(REFRESH_TOKEN_KEY, { domain: mainDomain })
  } else {
    reply.clearCookie(REFRESH_TOKEN_KEY)
  }
}

/**
 * response a request with success and Data
 */
export const respSuccess = <T>(reply: FastifyReply, data: T, code: keyof typeof HTTP_STATUS = 'SUCCESS') => {
  const resp: IFormResponse['App'] = { success: true, data: data || {} }
  legalerConnectLog(reply, code)

  if (reply._bulk?.isInProgress) {
    reply._bulk.result.push({ status: HTTP_STATUS[code], body: resp })
    return
  }

  return reply.code(HTTP_STATUS[code]).send(resp)
}

// response a request with Unsuccess and err message
export const respUnsuccess = (
  reply: FastifyReply,
  errors: IErrorForm[] = [],
  status: keyof typeof HTTP_STATUS = 'BAD_REQUEST',
  options?: {
    clearCookie?: {
      domain: string
    }
    remoteLog?: boolean
    data?: any
  },
) => {
  legalerConnectLog(reply, status)

  if (options?.remoteLog) logger.error(JSON.stringify(errors))
  if (options?.clearCookie) clearTokenCookies(reply, options.clearCookie.domain)

  const model: { success: boolean; errors: IErrorForm[]; data?: any } = {
    success: false,
    errors,
  }
  if (options?.data) model['data'] = options.data

  if (reply._bulk?.isInProgress) {
    reply._bulk.result.push({ status: HTTP_STATUS[status], body: model })
    return
  }

  return reply.status(HTTP_STATUS[status]).send(model)
}

interface ISetUniclientJwtOpts {
  refresh_token_expiry_day: number
  header_custom_domain?: string
}

export const setRefreshTokenInCookie = async (
  reply: FastifyReply,
  refresh_token: string,
  domain: string,
  options: ISetUniclientJwtOpts,
  sameDomainCookie?: boolean,
) => {
  const domainArr = domain.split('.')

  reply.cookie(REFRESH_TOKEN_KEY, refresh_token, {
    httpOnly: true,
    path: '/',
    maxAge: options.refresh_token_expiry_day * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    secure: !(isDevelopment() || isTest()),
    domain: options.header_custom_domain
      ? options.header_custom_domain
      : sameDomainCookie || domain.startsWith('localhost') || domain.startsWith('192.168.1.')
        ? undefined
        : '.' + domainArr.slice(Math.max(domainArr.length - 2, 0)).join('.'), // pick the main domain with a "." at the beginning.
  })
}

export const setUniclientJwt = async (
  reply: FastifyReply,
  refresh_token: string,
  domain: string,
  options: ISetUniclientJwtOpts,
  sameDomainCookie?: boolean,
) => {
  await setRefreshTokenInCookie(reply, refresh_token, domain, options, sameDomainCookie)
}

export function makePaginationList(
  total: number | undefined,
  page: number = getConfigs().pagination.page,
  limit: number = getConfigs().pagination.limit,
): IPaginationRes {
  if (total) {
    const totalPages = Math.ceil(total / limit)

    const model: IPaginationRes = {
      totalPages,
      hasNextPage: totalPages > page,
      hasPrevPage: page > 1,
      limit,
      page,
      total,
      offset: limit * (page - 1),
    }
    return model
  } else {
    const model: IPaginationRes = {
      limit,
      page,
      total,
      offset: limit * (page - 1),
    }
    return model
  }
}

async function legalerConnectLog(reply: FastifyReply, code: keyof typeof HTTP_STATUS, module_id?: number) {
  if (reply.client?.client_id) {
    const { client_id, ...rest } = reply.client
    const repo = getRepo()

    const legalerConnect = await repo.legalerConnect.getByClientId(client_id)

    if (legalerConnect && module_id) {
      await repo.legalerConnectLog.create({
        status: HTTP_STATUS[code],
        api_connect_id: legalerConnect.api_connect_id,
        module_id,
        ...rest,
      })
    }
  }
}

export const urlPrivacyChecker = (data: {
  url_privacy: URL_PRIVACY
  passwordData: { url_password: string | null; plainPassword: string | undefined }
  url_expire_at: Date | null
  isAuthenticated: boolean
  isAttendee: boolean
  requestStatus?: ATTENDEE_REQUEST_STATUS | PERMISSION
  extraResponse?: Record<string, any>
}) => {
  const { isAttendee, isAuthenticated, url_privacy, requestStatus, passwordData, url_expire_at, extraResponse } = data

  const extra =
    extraResponse || url_expire_at
      ? {
          ...extraResponse,
          url_expire_at: url_expire_at ?? undefined,
          url_password: !!passwordData.url_password || undefined,
        }
      : undefined

  if (url_privacy === 'can_join' || url_privacy === 'can_view_only' || url_privacy === 'public') {
    // handle if password needed
    if (!isAttendee) {
      if (passwordData.url_password) {
        if (!passwordData.plainPassword || !bcrypt.compareSync(passwordData.plainPassword, passwordData.url_password)) {
          throw generateError(
            [{ message: 'Password needed/incorrect.', key: IErrors.NEED_PASSWORD_TO_ACCESS, extra }],
            'FORBIDDEN',
          )
        }
      }

      if (url_expire_at) {
        if (url_expire_at.getTime() < new Date().getTime()) {
          throw generateError(
            [{ message: 'Time to access has passed.', key: IErrors.DEADLINE_PASSED_FOR_ACCESS, extra }],
            'FORBIDDEN',
          )
        }
      }
    }

    return undefined
  }

  if (!isAuthenticated) {
    throw generateError([{ message: 'Signin required.', key: IErrors.SIGNIN_REQUIRED, extra }], 'FORBIDDEN')
  }

  if (!isAttendee) {
    if (url_privacy === 'disabled') {
      throw generateError(
        [{ message: 'You don’t have access to this page.', key: IErrors.DISABLED_PRIVACY, extra }],
        'FORBIDDEN',
      )
    }

    if (url_privacy === 'can_ask_for_access' || url_privacy === 'private') {
      if (passwordData.url_password) {
        if (!passwordData.plainPassword || !bcrypt.compareSync(passwordData.plainPassword, passwordData.url_password)) {
          throw generateError(
            [{ message: 'Password needed/incorrect.', key: IErrors.NEED_PASSWORD_TO_ACCESS, extra }],
            'FORBIDDEN',
          )
        }
      }

      throw generateError(
        [{ message: 'Need to ask permission.', key: IErrors.NEED_ASK_PERMISSION_PRIVACY, extra }],
        'FORBIDDEN',
      )
    }
  } else {
    if (requestStatus === 'pending' || requestStatus === PERMISSION.PendingRequest) {
      throw generateError(
        [{ message: 'You don’t have access to this page.', key: IErrors.HAS_PENDING_REQUEST_PRIVACY, extra }],
        'FORBIDDEN',
      )
    }
  }

  return undefined
}

/**
 * Universal transformer that converts each `:param` in a path to it's corresponding value.
 *
 * @param rawPath the path that may includes `:param`.
 * @param params a key-value pair list of path params.
 * @example transformPath("/foo/:first/bar/:second", { first: 2, second: 6 }); // returns "/foo/2/bar/6"
 */
export const transformPath = (rawPath: string, params: Record<string, string | number>): string => {
  const pathItems = rawPath.split('/').map((item) => {
    if (item.startsWith(':')) {
      const value = params[item.slice(1)]
      if (!value) throw new Error(`transformPath:: Cannot find corresponding "${item}" param value.`)

      item = String(value)
    }

    return item
  })

  return pathItems.join('/')
}
