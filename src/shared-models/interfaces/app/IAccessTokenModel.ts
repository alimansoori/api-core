export interface IAccessTokenModel {
  access_token: string
  refresh_token?: string
  token_type: 'bearer'
  expires_in: number
}
