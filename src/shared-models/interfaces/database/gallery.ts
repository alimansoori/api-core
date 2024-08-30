import { IFileResponseModel } from '../app/index.js'
import { HEADER_TYPE } from '../backend.js'

export type IGetAllHeaderQueryResult = IFileResponseModel & { category: string[]; thumbnail?: IFileResponseModel }

export type IGetHeaderQueryResult = {
  header_id: number
  category: string[]
  type: HEADER_TYPE
  emoji: string
  meta: any
  file: IFileResponseModel
}

export type IGetHeaderItemsQueryResult = {
  header_id: number
  file: { file_id: number; name: string; path: string } | null
}
