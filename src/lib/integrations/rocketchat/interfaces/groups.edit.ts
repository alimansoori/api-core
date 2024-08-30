import { IRocketchatBaseResponse } from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'

export interface IGroupsEditRes extends IRocketchatBaseResponse {
  group: {
    _id: string
    name: string
    t: string
    usernames: string[]
    msgs: number
    u: {
      _id: string
      username: string
    }
    ts: string
    ro: false
    sysMes: true
    _updatedAt: string
  }
}
