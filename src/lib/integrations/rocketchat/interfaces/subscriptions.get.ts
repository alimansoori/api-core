import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IRocketChatGetSubscriptionsReq {
  updatedSince?: Date
}

interface Remove {
  _id: string
  _deletedAt: Date
}

interface CustomFields {
  entity: {
    types: 'user' | 'meeting' | 'breakout_room'
    id: number
  }
}

type T = 'c' | 'd' | 'p'

interface U {
  _id: string
  username: string
  name?: string
}

interface Update {
  _id: string
  rid: string
  u: U
  _updatedAt: Date
  alert: boolean
  fname?: string
  groupMentions: number
  name: string
  open: boolean
  t: T
  unread: number
  userMentions: number
  ls: Date
  customFields?: CustomFields
  ts?: Date
  E2EKey?: string
  disableNotifications?: boolean
  muteGroupMentions?: boolean
  hideUnreadStatus?: boolean
  audioNotificationValue?: string
  autoTranslateLanguage?: string
  lr?: Date
  tunread?: any[]
  roles?: string[]
  tunreadUser?: any[]
}

export interface IRocketChatGetSubscriptionsRes extends IRocketchatBaseResponse {
  update: Update[]
  remove: Remove[]
}
