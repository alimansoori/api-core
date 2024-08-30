export interface IFacebookGetAccessTokenReq {
  client_id: string
  client_secret: string
  redirect_uri: string
  code: string
}

export interface IFacebookGetAccessTokenRes {
  access_token: string
  error?: {
    code: number
    error_subcode: number
    fbtrace_id: string
    message: string
    type: string
  }
}
