import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IChannelsDeleteReq {
  roomId?: string
  roomName?: string
}

export type IChannelsDeleteRes = IRocketchatBaseResponse
