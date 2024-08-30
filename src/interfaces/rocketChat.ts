import { RocketchatRoomType } from '../shared-models/api/uniclient/index.js'

export enum ROCKETCHAT_COLLECTIONS {
  rocketchat_message = 'rocketchat_message',
  rocketchat_subscription = 'rocketchat_subscription',
  rocketchat_uploads = 'rocketchat_uploads',
  rocketchat_avatars = 'rocketchat_avatars',
  users = 'users',
  rocketchat_room = 'rocketchat_room',
}

export interface RocketChatRoom {
  _id: string
  fname: string
  customFields: {
    show_name: string
  }
  description: string
  broadcast: boolean
  encrypted: boolean
  name: string
  t: RocketchatRoomType
  msgs: 1
  usersCount: 1
  u: {
    _id: string
    username: string
  }
  usernames?: string[]
  ts: Date
  ro: boolean
  default: boolean
  sysMes: boolean
  _updatedAt: Date
  lastMessage: {
    _id: string
    rid: string
    msg: string
    ts: Date
    u: {
      _id: string
      username: string
      name: string
    }
    _updatedAt: Date
    urls: string[]
    mentions: string[]
    channels: string[]
    md: [
      {
        type: string
        value: [
          {
            type: string
            value: string
          },
        ]
      },
    ]
    editedAt: Date
    editedBy: {
      _id: string
      username: string
    }
  }
  lm: Date
  unread: number
  avatarETag: string
}

export interface RocketChatSubscription {
  _id: string
  open: boolean
  alert: boolean
  unread: 0
  userMentions: 0
  groupMentions: 0
  ts: Date
  rid: string
  name: string
  fname: string
  customFields: {
    show_name: string
  }
  t: RocketchatRoomType
  u: {
    _id: string
    username: string
  }
  ls: Date
  _updatedAt: Date
  roles: 'owner'[]
  f: boolean
}
export interface RocketChatUser {
  _id: string
  createdAt: Date
  services: {
    password: {
      bcrypt: string
    }
    email2fa: {
      enabled: boolean
      changedAt: Date
    }
    email: {
      verificationTokens: [
        {
          token: string
          address: string
          when: Date
        },
      ]
    }
    resume: {
      loginTokens: [
        {
          hashedToken: string
          type?: string
          createdAt?: Date
          when?: Date
          lastTokenPart?: string
          name?: string
          bypassTwoFactor?: boolean
        },
      ]
    }
  }
  emails: [
    {
      address: string
      verified: boolean
    },
  ]
  type: string
  status: string
  active: boolean
  _updatedAt: Date
  roles: 'user' | 'admin'[]
  name: string
  lastLogin: Date
  statusConnection: string
  username: string
  __rooms: []
  utcOffset: 3.5
  statusText: string
  statusDefault: string
  settings: {
    profile: {}
  }
  customFields: {
    workspace_id: 1
  }
}

export interface ChatSearchQueryParams {
  room_id?: string[]
  type?: RocketchatRoomType
  room_name?: string
  start_date?: string
  end_date?: string
  user_id?: string
  who?: string[]
  take?: number
  skip?: number
}
