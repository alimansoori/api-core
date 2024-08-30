import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IChannelsCreateReq {
  name: string
  members?: string[]
  readOnly?: boolean
}
interface CustomFields {}

interface U {
  _id: string
  username: string
}

interface Channel {
  _id: string
  name: string
  fname: string
  t: string
  msgs: number
  usersCount: number
  u: U
  customFields: CustomFields
  ts: string
  ro: boolean
  default: boolean
  sysMes: boolean
  _updatedAt: string
}

export interface IChannelsCreateRes extends IRocketchatBaseResponse {
  channel: Channel
}
