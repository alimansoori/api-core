import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IUsersCreateTokenReq {
  userId?: string
  username?: string
}
interface Data {
  userId: string
  authToken: string
}

export interface IUsersCreateTokenRes extends IRocketchatBaseResponse {
  data: Data
}
