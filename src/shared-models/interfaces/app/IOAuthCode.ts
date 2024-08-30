export interface IOAuthCode {
  authorization_code: string
  client_id: string
  redirect_uri: string
  client_secret: string
  code_challenge: string
}
