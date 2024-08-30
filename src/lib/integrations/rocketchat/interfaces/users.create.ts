import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IUsersCreateReq {
  email: string
  name: string
  password: string
  username: string
  active?: boolean

  nickname: string | null
  roles?: string[]
  joinDefaultChannels?: boolean
  requirePasswordChange?: boolean
  sendWelcomeEmail?: boolean
  verified?: boolean
  customFields?: any
}

interface Settings {}

interface Email {
  address: string
  verified: boolean
}

interface Password {
  bcrypt: string
}

interface Services {
  password: Password
}

interface User {
  _id: string
  createdAt: string
  services: Services
  username: string
  emails: Email[]
  type: string
  status: string
  active: boolean
  roles: string[]
  _updatedAt: string
  name: string
  settings: Settings
}

export interface IUsersCreateRes extends IRocketchatBaseResponse {
  user: User
}
