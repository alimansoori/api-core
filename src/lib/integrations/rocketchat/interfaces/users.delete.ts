import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IUsersDeleteReq {
  userId?: string
  username?: string
  confirmRelinquish?: boolean
}

export type IUsersDeleteRes = IRocketchatBaseResponse
