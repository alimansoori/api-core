import { IHeaderResponse } from '@app/shared-models/index.js'

export interface IMembersInvitationNotify {
  invitee: {
    email: string
    user_id: number
    share_id: number
  }
  invitedBy: {
    user_id: number
    avatar: {
      name: string
      path: string
    } | null
    first_name: string
    last_name: string
    nickname?: string | null
  }
  workspace: {
    workspace_id: number
    subdomain: string
    name: string
    header: IHeaderResponse
    appearance: {
      domain: string | null
    } | null
    logo?: {
      name: string
      path: string
    }
  }
}
