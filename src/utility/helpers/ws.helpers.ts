import { logger } from '@app/lib/logger.js'
import { validateJwtToken } from '@app/lib/security.js'
import { IErrors, IUserTokenGet } from '@app/shared-models/index.js'

export const parseWsMessage = <T = any>(msg: ArrayBuffer): T => {
  let str

  try {
    str = Buffer.from(msg).toString('utf8')
    return JSON.parse(str) as T
  } catch (error) {
    logger.error(error)
    return str as T
  }
}

export const handleWsHeaderAuthorization = async (access_token: string) => {
  try {
    // decode jwt token
    access_token = access_token?.split(' ')[1]
    if (!access_token) return new Error(IErrors.ACCESS_TOKEN_INVALID)

    const token = validateJwtToken<IUserTokenGet>(access_token)
    if (token?.err || !token?.decoded) return new Error(IErrors.ACCESS_TOKEN_EXPIRED)
    if (token.decoded.sub) token.decoded.user_id = parseInt(token.decoded.sub)

    return token.decoded
  } catch (error) {
    return new Error(IErrors.ACCESS_TOKEN_INVALID)
  }
}
