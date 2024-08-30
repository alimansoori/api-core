export interface IUserToken {
  client_id: string
  users: { user_id: number; user_hash: string }[]
  jti: {
    [jti: string]: {
      user_id: number
      user_hash: string
    }
  }
}

export interface IUserTokenGet extends IUserToken {
  user_id: number
  user_hash: string
  refresh_token: {
    jtis: {
      [jti: string]: {
        user_id: number
        user_hash: string
      }
    }
    expiry?: number
  }
}
