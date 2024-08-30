import { module_config } from '../backend.js'

interface IGetUserIntegrationClioQueryResult {
  user_integrated_module_id: number
  module_config: module_config
  value: string
}
interface IGetUserIntegrationGCalQueryResult {
  user_integrated_module_id: number
  meta: {
    access_token: string
  }
}

export type IGetUserIntegrationQueryResult<T> = T extends 'clio'
  ? IGetUserIntegrationClioQueryResult
  : T extends 'google_calendar'
    ? IGetUserIntegrationGCalQueryResult
    : {
        user_integrated_module_id: number
        meta: any
      }
