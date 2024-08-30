export interface IJwtDecoded {
  iat: number
  jti: {
    [key: string]: {
      user_id: number
      user_hash: string
    }
  }
  exp: number
}
