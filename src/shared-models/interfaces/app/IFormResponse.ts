import { IErrors } from './IErrors.js'

export interface IErrorForm {
  key?: IErrors | string
  message: string
  extra?: any
}

export type SuccessResponse<T> = { success: true; data: T }

export type ErrorResponse = {
  success: false
  errors: IErrorForm[] | null
}

interface Response<T> {
  '200': T
  '201': T
  '400': ErrorResponse
  '401': ErrorResponse
  '403': ErrorResponse
  '404': ErrorResponse
  '429': ErrorResponse
}

export type IFormResponse<T = any> = {
  App: SuccessResponse<T> | ErrorResponse
  Schema: Response<T>
}
