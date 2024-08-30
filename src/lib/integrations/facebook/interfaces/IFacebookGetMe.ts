export interface IFacebookGetMeReq {
  fields: string
  access_token: string
}

export interface IFacebookGetMeRes {
  email: string
  first_name: string
  last_name: string
  picture: string
  error?: any
}
