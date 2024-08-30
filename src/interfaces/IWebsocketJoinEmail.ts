export interface IWebsocketJoinEmail {
  admins_email: string[]
  user: {
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
    name: string
    logo?: {
      name: string
      path: string
    }
  }
}
