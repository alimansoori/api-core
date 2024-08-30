import { HEADER_SHAPE, HEADER_TYPE } from '../backend.js'
import { IFileResponseModel } from './IFileResponseModel.js'

export type ILogoModel = {
  is_emoji: boolean
  type: HEADER_TYPE
  shape: HEADER_SHAPE
  header_id: number | null
  file: IFileResponseModel | null
  user?: {
    first_name?: string
    last_name?: string
  }
}
