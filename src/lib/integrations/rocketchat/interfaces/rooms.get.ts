import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IRocketChatGetRoomsReq {
  updatedSince?: Date
}

export interface Remove {
  _id: string
  _deletedAt: Date
}

interface ImageDimensions {
  width: number
  height: number
}
interface Attachment {
  text?: string
  author_name?: string
  author_icon?: string
  message_link?: string
  attachments?: any[]
  ts: Date
  title?: string
  title_link?: string
  title_link_download?: boolean
  audio_url?: string
  audio_type?: string
  audio_size?: number
  type?: string
  image_dimensions?: ImageDimensions
  image_preview?: string
  image_url?: string
  image_type?: string
  image_size?: number
  color?: string
  author_link?: string
}

interface Bot {
  i: string
}

interface EditedByClass {
  _id: string
  username: string
}

interface File {
  _id: string
  name: string
  type: string
}

interface Reaction {
  usernames: string[]
}

interface PurpleU {
  _id: string
  username: string
  name: string
}

interface URL {
  url: string
  ignoreParse?: boolean
}

enum T {
  C = 'c',
  D = 'd',
  P = 'p',
}

export interface CustomFields {
  entity: {
    types: 'user' | 'meeting' | 'breakout_room'
    id: number
  }
}

interface LastMessage {
  _id: string
  rid: string
  msg: string
  ts: Date
  u: PurpleU
  _updatedAt: Date
  urls?: URL[]
  mentions: EditedByClass[]
  channels: any[]
  reactions?: { [key: string]: Reaction }
  attachments?: Attachment[]
  file?: File
  groupable?: boolean
  alias?: string
  parseUrls?: boolean
  bot?: Bot
  editedAt?: Date
  editedBy?: EditedByClass
  emoji?: string
}

interface Update {
  _id: string
  name?: string
  fname?: string
  t: T
  usersCount: number
  u?: EditedByClass
  customFields?: CustomFields
  description?: string
  broadcast?: boolean
  encrypted?: boolean
  ro?: boolean
  default: boolean
  sysMes?: boolean
  _updatedAt: Date
  lastMessage: LastMessage
  lm: Date
  usernames?: string[]
  uids?: string[]
  jitsiTimeout?: Date
  e2eKeyId?: string
  avatarETag?: string
  workspaceMain?: boolean
  workspaceId?: string
  topic?: string
  announcement?: string
}
export interface IRocketChatGetRoomsRes extends IRocketchatBaseResponse {
  update: Update[]
  remove: Remove[]
}
