import { IHeaderResponse } from '../index.js'
import { IFileResponseModel, ILogoFileResponseModel, WORKSPACE_ACCESS, WORKSPACE_USER_STATUS } from '../app/index.js'
import { USER_ROLE, user, user_identity, timezone, currency, country, WEEK_DAY } from '../backend.js'

export type IGetMeQueryResult = {
  user_id: number
  user_hash: string
  first_name: string
  last_name: string
  hasPassword: boolean
  nickname?: string | null
  username: string
  timezone?: timezone | null // timezone
  role: USER_ROLE
  avatar: IFileResponseModel | null
  email: string | null
  country?: country | null // country
  language?: {
    // language
    language: {
      language_id: number
      name: string | null
    } | null
  } | null
  usertype?: {
    // usertype
    usertype_id: number
    name: string
  } | null
  workspace_user?: {
    // workspace_user
    workspace_user_id: number
    chat_user_id: string | null
    chat_username: string | null
    status: WORKSPACE_USER_STATUS
    is_guest: boolean
    availability_template_id: number | null
    first_week_day: WEEK_DAY
    workspace_subdomain: string
    role?: {
      role_id: number
      accesses: {
        key: `${WORKSPACE_ACCESS}`
        value: boolean
      }[]
    }
    currency?: currency // workspace_user.currency
    user_profile?: {
      // workspace_user.user_profile
      user_profile_id: number
      job_position: {
        name: string
      } | null
      company: {
        name: string
      } | null
      header: IHeaderResponse
    }
  } | null
}

export type IMyAccountResult = {
  user_id: number
  user_hash: string
  first_name: string
  last_name: string
  nickname?: string | null
  username: string
  email: string | null
  role: USER_ROLE
  avatar: IFileResponseModel | null
  usertype: {
    usertype_id: number
    name: string
  } | null
  workspace_user: {
    workspace_user_id: number
    order: number | null
    is_owner: boolean
    workspace: {
      workspace_id: number
      domain: string
      name: string
      subdomain: string
      custom_domain: string | null
      logomark: ILogoFileResponseModel | null
      logomark_dark: ILogoFileResponseModel | null
      logotype: ILogoFileResponseModel | null
      logotype_dark: ILogoFileResponseModel | null
      logotype_text: string | null
      // primary_color?: string | null;
      // primary_dark_color?: string | null;
      // secondary_color?: string | null;
      // secondary_dark_color?: string | null;
      server: {
        url: string
      }
    }
    unread_notification_count: number
  }[]
}

export type IGetByIDQueryResult = user & {
  timezone: {
    name: string
  } | null
  user_identity: user_identity[]
  avatar: {
    name: string
    path: string
    file_id: number
  } | null
}

export interface IUserMeta {
  google_id?: string
  microsoft_id?: string
}
