import { IFileResponseModel, IHeaderResponse, PERMISSION } from '../app/index.js'
import { PROJECT_STATUS, USER_ROLE } from '../backend.js'

export interface IGetAllUclProjectsQueryResult {
  id: string | null
  name: string
  description: string | null
  project_hash: string
  created_at: Date
  project_labels: {
    label_id: number
    name: string
    items: { name: string; label_item_id: number }[]
  }[]
  updated_at: Date
  status: PROJECT_STATUS
  header_project: IHeaderResponse
  is_starred: boolean
  project_users: {
    user_id: number
    calc_permission: PERMISSION
    user: {
      role: USER_ROLE
      first_name: string
      last_name: string
      nickname?: string | null
      avatar: IFileResponseModel
    }
  }[]
  project_users_count: number
  me?: {
    /**
     * @example true
     */
    is_participant: boolean
    /**
     * @example 64
     */
    calc_permission?: PERMISSION
    /**
     * @example 51
     */
    project_user_id?: number
    /**
     * @example false
     */
    is_visible_on_profile?: boolean
  }
}
