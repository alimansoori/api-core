import { IFileResponseModel } from '../app/index.js'

export type IFileResponse = IFileResponseModel

export type IGetFilesByIdAndUserIdQueryResult = {
  file_id: number
  path: string
  name: string
  size: number | null
  mime: string | null
}

export enum FOLDER_MODULE {
  Documents = 'Documents',
  Recordings = 'Recordings',
}
