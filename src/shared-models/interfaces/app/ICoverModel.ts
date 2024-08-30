import { HEADER_SHAPE, HEADER_TYPE } from '../backend.js'
import { IFileResponseModel } from './IFileResponseModel.js'

export type ICoverModel = {
  type: HEADER_TYPE
  shape: HEADER_SHAPE
  header_id: number
  file: IFileResponseModel | null
  position?: string
}
