import jsonwebtoken from 'jsonwebtoken'
import { IAccessTokenModel, IUserToken } from '@app/shared-models/index.js'
import { nanoid } from 'nanoid'
import { generateES256KeyPair, getDeviceData } from '@app/utility/helpers/index.js'
import { logger } from './logger.js'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
import { getConfigs } from './config.validator.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'

// sign and encode token
export const generateTempToken = <T extends string | Object | Buffer>(
  data: T,
  expiresInMin: number,
  options?: jsonwebtoken.SignOptions,
) => {
  try {
    const { JWT_PRIVATE_KEY } = getConfigs()
    const token = jsonwebtoken.sign(data, JWT_PRIVATE_KEY, {
      ...options,
      algorithm: 'ES256',
      expiresIn: `${expiresInMin}m`,
    })
    return token
  } catch (e: any) {
    logger.error(e)
    throw new Error(e)
  }
}

// sign and encode token
export const generateAccessToken = <T extends string | Object | Buffer>(id: number, data: T) => {
  try {
    const { JWT_PRIVATE_KEY, ACCESS_TOKEN_EXPIRY } = getConfigs()
    const token = jsonwebtoken.sign(data, JWT_PRIVATE_KEY, {
      subject: id.toString(),
      algorithm: 'ES256',
      expiresIn: `${ACCESS_TOKEN_EXPIRY}m`,
    })
    return token
  } catch (e: any) {
    logger.error(e)
    throw new Error(e)
  }
}

// sign and encode token
const generateRefreshToken = (
  jwtid: {
    [jti: string]: {
      user_id: number
      user_hash: string
    }
  },
  expiresIn = 365,
) => {
  try {
    const { JWT_PRIVATE_KEY } = getConfigs()
    const token = jsonwebtoken.sign({}, JWT_PRIVATE_KEY, {
      expiresIn: `${expiresIn} days`,
      jwtid: JSON.stringify(jwtid),
      algorithm: 'ES256',
    })
    return token
  } catch (e: any) {
    logger.error(e)
    throw new Error(e)
  }
}

// verify and decode token
interface ITokenSignResult<T> {
  err: jsonwebtoken.VerifyErrors | null
  decoded: (T & jsonwebtoken.JwtPayload) | undefined
}

export const validateJwtToken = <T>(token: string, options?: jsonwebtoken.VerifyOptions): ITokenSignResult<T> => {
  try {
    const { JWT_PUBLIC_KEY } = getConfigs()
    const decodedToken = jsonwebtoken.verify(token, JWT_PUBLIC_KEY, { ...options, complete: false }) as T &
      jsonwebtoken.JwtPayload
    return { err: null, decoded: decodedToken }
  } catch (e: any) {
    // token is invalid (expired or ...)
    return { err: e, decoded: undefined }
  }
}

export const createAuthTokens = (
  user_id: number,
  user_hash: string,
  client_id: string,
  users: { user_id: number; user_hash: string }[] = [],
  inputJtis?: {
    [jti: string]: {
      user_id: number
      user_hash: string
    }
  },
  createRefreshToken?: boolean,
) => {
  const { REFRESH_TOKEN_AGE_DAY, ACCESS_TOKEN_EXPIRY } = getConfigs()

  // create refresh_token
  const allUsers = users

  const isUserExists = allUsers.find((user) => user.user_id === user_id)

  if (!isUserExists) {
    allUsers.push({
      user_hash,
      user_id,
    })
  }

  const jwtIds: {
    [jti: string]: {
      user_id: number
      user_hash: string
    }
  } = {}
  let refresh_token: string | undefined

  allUsers.forEach((user) => {
    let inputJTI: string | undefined

    if (inputJtis) {
      for (const oldJti in inputJtis) {
        if (inputJtis[oldJti]?.user_id === user.user_id) {
          inputJTI = oldJti
        }
      }
    }

    const jti = inputJTI ?? nanoid(31)
    jwtIds[jti] = {
      user_hash: user.user_hash,
      user_id: user.user_id,
    }
  })

  if (createRefreshToken) {
    refresh_token = generateRefreshToken(jwtIds, REFRESH_TOKEN_AGE_DAY)
  }

  // create access_token
  const access_token = generateAccessToken<IUserToken>(user_id, {
    client_id,
    users: [...allUsers],
    jti: jwtIds,
  })

  const accessTokenExpiry = ACCESS_TOKEN_EXPIRY * 60
  const tokenData: IAccessTokenModel = { access_token, expires_in: accessTokenExpiry, token_type: 'bearer' }
  return { accessToken: tokenData, refresh_token, jwtIds }
}

// change refresh token to jti
export const createNewUserSession = async (
  user_id: number,
  session_hash: string,
  userAgent: string,
  jti: string,
  ip: string,
  authorized_app_id?: number,
) => {
  const repo = getRepo()

  const device = getDeviceData(userAgent)
  const ipv4 = ip.includes(',') ? ip.split(',').pop()?.trim() : ip
  await repo.user.upsertActiveSession(
    jti,
    {
      session_hash,
      jti,
      ip: ipv4,
      authorized_app_id,
      session_user: { create: { user_id, session_device: { create: device } } },
    },
    {
      session_user: { create: { user_id, session_device: { create: device } } },
    },
  )
}

// WARNING: This method only do decode token and not validating that
export const decodeJwtAccessToken = <T>(token: string): ITokenSignResult<T> => {
  try {
    const decodedToken = jsonwebtoken.decode(token) as T & jsonwebtoken.JwtPayload
    return { err: null, decoded: decodedToken }
  } catch (e: any) {
    // token is invalid (expired or ...)
    return { err: e, decoded: undefined }
  }
}

export const getJwtKeyDirPath = () => join(getConfigs().BASE_DIR, 'core/keys/jwt')

export const generateJwtKeyPair = () => {
  const jwtFullPath = getJwtKeyDirPath() + '/jwt.private.key'
  if (existsSync(jwtFullPath)) return

  generateES256KeyPair({
    path: getJwtKeyDirPath(),
    name: 'jwt',
  })
}

export const getJwtPrivateKey = () => readFileSync(join(getJwtKeyDirPath(), 'jwt.private.key'), { encoding: 'utf-8' })
export const getJwtPublicKey = () => readFileSync(join(getJwtKeyDirPath(), 'jwt.public.pem'), { encoding: 'utf-8' })
