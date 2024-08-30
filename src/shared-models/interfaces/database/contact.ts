import { IHeaderResponse } from '../index.js'
import { IFileResponseModel } from '../app/index.js'
import { IDENTITY_CATEGORY, IDENTITY_TYPE, timezone, USER_ROLE } from '../backend.js'
import { IContactItem } from '@app/api/v1/workspace/contact/contact.types.js'

export type IEditGroupMembers = {
  /**
   * @example 17
   */
  contact_hash: string
  /**
   * @example false
   * @description true for removing, false for adding and editing
   */
  _delete: boolean
}

export type IGetByIdAndOwnerIdResult = {
  contact_hash: string
  chat_user_id: string | null
  chat_username: string | null
  first_name: string | null
  last_name: string | null
  middle_name?: string
  prefix?: string
  suffix?: string
  phonetic_first?: string
  phonetic_middle?: string
  phonetic_last?: string
  nickname?: string
  file_as?: string
  company?: string
  job_title?: string
  department?: string
  country?: string
  province?: string
  city?: string
  street_address?: string
  postal_code?: string
  po_box?: string
  label?: string
  birthday?: Date
  event?: string
  notes?: string
  website?: string
  relationship?: string
  chat?: string
  internet_call?: string
  custom_fields?: {
    contact_customfield_id: number
    field_name: string
    value: string
  }[]

  is_starred: boolean
  emails: {
    contact_identity_id?: number
    is_editable: boolean
    value: string
    type: IDENTITY_TYPE
    is_primary: boolean
    category?: IDENTITY_CATEGORY | null
  }[]
  phones: {
    contact_identity_id?: number
    is_editable: boolean
    value: string
    type: IDENTITY_TYPE
    is_primary: boolean
    category?: IDENTITY_CATEGORY | null
  }[]
  header?: IHeaderResponse
  user?: {
    user_id: number
    user_hash: string
    groups_owned: {
      usergroup_id: number
      name: string
    }[]
    avatar?: IFileResponseModel
    profile?: {
      user_profile_id?: number
      position?: {
        name: string
      } | null
      company?: {
        name: string
      } | null
    } | null
    username: string | null
    role: USER_ROLE | null
    bio?: string | null
    usertype: string | null
    is_available_now: boolean | null
    timezone: timezone | null
  }
}

export interface IUsergroupItem {
  /**
   * @example 8
   */
  usergroup_id: number
  /**
   * @example 46
   */
  owner_id: number | null
  /**
   * @example 46
   */
  is_starred: boolean
  /**
   * @example 21
   */
  workspace_id: number | null
  /**
   * @example boysOfAbuGhorayb
   */
  name: string
  /**
   * @example ma boys in call of duty {joy-emoji}
   */
  description: string | null
  /**
   * @minLength 8
   * @maxLength 255
   * @example 2022-04-06T15:00:00.931Z
   */
  created_at: Date | null
  /**
   * @example usergroup
   */
  type: 'workspace' | 'usergroup'
  avatar?: IFileResponseModel
  users?: {
    usergroup_user_id: number
    user_id: number | null
    created_at: Date
    contact: IContactItem
  }[]
  _count?: {
    /**
     * @example 4
     */
    users: number
  }
}

export interface IUsergroupAddedItem {
  usergroup_id: number
  name?: string
  description: string | null
  avatar: IFileResponseModel | null
}
