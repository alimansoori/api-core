import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IGroupsCreateReq {
  name: string
  members?: string[]
  readOnly?: boolean
  customFields: {
    entity: {
      types: 'meeting' | 'breakoutroom' | 'workspace'
      id: string | number
    }
  }
}

interface CustomFields {}

interface U {
  _id: string
  username: string
}

interface Group {
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
export interface IGroupsCreateRes extends IRocketchatBaseResponse {
  group: Group
}
