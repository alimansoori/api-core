import { IAvatarProps, IHeaderResponse } from '@app/shared-models/index.js'

export interface IWorkspaceActionOnMember {
  status: 'accepted' | 'rejected' | 'deleted'
  user: {
    first_name: string
    last_name: string
    nickname?: string | null
    username: string
    avatar: {
      path: string
      name: string
      file_id: number
    } | null
  }
  workspace_user_email: string
  workspace: {
    name: string
    subdomain: string
    header?: IHeaderResponse
    emailMainImage?: IAvatarProps
    logo?: {
      name: string
      path: string
    }
  }
}
