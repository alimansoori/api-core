import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IGroupsDeleteReq {
  roomId?: string
  roomName?: string
}

export type IGroupsDeleteRes = IRocketchatBaseResponse
