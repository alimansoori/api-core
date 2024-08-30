import { IFileResponseModel, IHeaderResponse, PERMISSION } from '../app/index.js'
import { OPPORTUNITY_SERVICE_REQUIREMENTS, OPPORTUNITY_STATUS, USER_ROLE } from '../backend.js'

export enum IOpportunitySharingTypes {
  'can_view_only' = 'can_view_only',
  'can_join' = 'can_join',
  'can_ask_for_access' = 'can_ask_for_access',
  'disabled' = 'disabled',
}

export enum OpportunityScopes {
  'all' = 'all',
  'workspace_opportunities' = 'workspace_opportunities',
  'public' = 'public',
  'my' = 'my',
  'shared_with_me' = 'shared_with_me',
  'shared_with_others' = 'shared_with_others',
  'assigned_to_me' = 'assigned_to_me',
  'starred' = 'starred',
  'open' = 'open',
  'closed' = 'closed',
  'pending' = 'pending',
  'assigned' = 'assigned',
  'archived' = 'archived',
}

export interface IOpportunityLocationMeta {
  /**
   * @minimum -90
   * @maximum 90
   * @example -32.0397560
   * @type number
   * @format float
   */
  lat?: number
  /**
   * @minimum -180
   * @maximum 180
   * @example 58.4316520
   * @type number
   * @format float
   */
  long?: number
}

export interface IGetAllOpportunitiesQueryResult {
  title: string
  description: string | null
  opportunity_hash: string
  target_workspace: {
    name: string
    subdomain: string
    logomark: IFileResponseModel
    logomark_dark: IFileResponseModel
  }
  updated_at: Date
  practice_areas_labels: {
    /**
     * @example 2
     */
    label_id: number
    /**
     * @example noExample
     */
    name: string
    items: { name: string; label_item_id: number }[]
  }[]
  opportunity_type_labels: {
    /**
     * @example 2
     */
    label_id: number
    /**
     * @example noExample
     */
    name: string
    items: { name: string; label_item_id: number }[]
  }[]
  focus_area_labels: {
    /**
     * @example 2
     */
    label_id: number
    /**
     * @example noExample
     */
    name: string
    items: { name: string; label_item_id: number }[]
  }[]
  eligible_providers_labels: {
    /**
     * @example 2
     */
    label_id: number
    /**
     * @example noExample
     */
    name: string
    items: { name: string; label_item_id: number }[]
  }[]
  service_requirements: OPPORTUNITY_SERVICE_REQUIREMENTS
  status: OPPORTUNITY_STATUS
  header_opportunity: IHeaderResponse
  opportunity_users: {
    opportunity_user_id: number
    user_id: number
    calc_permission: PERMISSION
    is_assignee: boolean
    is_express_interest: boolean
    user: {
      role: USER_ROLE
      first_name: string
      last_name: string
      nickname?: string | null
      avatar: IFileResponseModel
    }
  }[]
  opportunity_users_count: number
  opportunity_location?: {
    /**
     * @example Perth
     */
    value: string
    meta: IOpportunityLocationMeta
  }
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
    opportunity_user_id?: number
    /**
     * @example true
     */
    is_assignee: boolean
    /**
     * @example true
     */
    is_express_interest: boolean
    /**
     * @example true
     */
    is_starred: boolean
  }
}
