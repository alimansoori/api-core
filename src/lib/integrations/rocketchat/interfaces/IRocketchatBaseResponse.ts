export interface IRocketchatBaseResponse {
  success: boolean
}
export interface updateUserInfoReq {
  userId: string
  data?: {
    username?: string
    name?: string
  }
}
