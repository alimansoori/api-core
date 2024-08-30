import { IFileResponseModel } from '../app/index.js'

export interface IGetOAuthClient {
  avatar?: IFileResponseModel
  name: string
  file_id?: number
  client_id: string
  client_secret: string
  scope?: string[]
  redirect_uris: string[]
  website: string
}
