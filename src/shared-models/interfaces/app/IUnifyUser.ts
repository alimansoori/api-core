import { IFileResponse } from '../index.js'

export interface IUnifyUser {
  user_id: number
  first_name: string
  last_name: string
  avatar?: IFileResponse
}
