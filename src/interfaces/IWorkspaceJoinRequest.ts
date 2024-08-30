import { IAvatarProps, IHeaderResponse } from '@app/shared-models/index.js'

export interface IWorkspaceJoinRequest {
  admins:
    | {
        user_id: number
        user_hash: string
        email: string
        is_guest: boolean
        email_mode?: number
      }[]
    | []
  user: {
    first_name: string
    last_name: string
    nickname?: string | null
    username: string
    user_id: number
    email: string
    share_id: number
    emailMainImage?: IAvatarProps
  }
  workspace: {
    workspace_id: number
    name: string
    subdomain: string
    header?: IHeaderResponse
    logo?: {
      alt: string
      full_path: string
    }
    appearance: {
      domain: string | null
    } | null
  }
}
