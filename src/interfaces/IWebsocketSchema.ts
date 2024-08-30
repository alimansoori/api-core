import MediasoupPeer from '@app/mediaserver/mediasoup/peer/mediasoup-peer.js'
import MediasoupRoom from '@app/mediaserver/mediasoup/room/mediasoup-room.js'
import { MediasoupBranch } from '@app/shared-models/index.js'
import { WebSocket } from 'uWebSockets.js'

export type UserData = {}

export interface IWebsocketCustom {
  user_id?: number
  id: string
  url: string
  domain: string
  subdomain: string | undefined
}
export interface IWebsocketSchema extends WebSocket<UserData>, IWebsocketCustom {}

export interface IMediaWebsocketCustom {
  peer_id?: string
  url: string
  domain: string
  subdomain: string | undefined
  joinedMediaRoom: boolean
  mediaRoom?: MediasoupRoom
  peer?: MediasoupPeer
  branch?: MediasoupBranch
  server_id?: number
  enableProducersHash?: boolean
  enableTalkingTimes?: boolean
  lastTalkingTimeNotifyTimestamp?: number
}
export interface IMediaWebsocketSchema extends WebSocket<UserData>, IMediaWebsocketCustom {}

export interface IWSocketArgs {
  user_id: number
  ws_id: string
}
