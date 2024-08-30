import { PERMISSION, SHARE_STATUS } from '../index.js'
import { IFileResponseModel, MODULE_KEY_TYPE } from '../app/index.js'
import { timezone, USER_ROLE } from '../backend.js'

export type SHARABLE_MODULE =
  | 'service'
  | 'user_profile'
  | 'workspace_profile'
  | 'project'
  | 'opportunity'
  | 'room'
  | 'meeting'
  | 'workspace'
  | 'note'
  | 'document'
  | 'agenda'
  | 'private_file'
  | 'folder'
  | 'meeting_recording'

export type IGetAllSharesExpandParam =
  | 'privacy_setting'
  | 'shares'
  | 'individual_users'
  | 'my_permissions'
  | 'urlAccess'
  | 'shareOptions'

export type IRequestToJoinRespond = 'accept' | 'reject' | 'block'

export enum SHARING_ACCESS {
  full_access = 'full_access',
  write = 'write',
  read = 'read',
}

type IUser = {
  user_id: number
  first_name: string
  last_name: string
  nickname?: string | null
  user_hash: string
  username: string
  email: string | null
  contact_hash: string | null
  role: USER_ROLE
  avatar?: IFileResponseModel
  timezone: timezone | null
}

type IUserGroup = {
  usergroup_id: number
  name: string
  module: {
    key: MODULE_KEY_TYPE
  }
  avatar?: IFileResponseModel
  user_ids: number[]
  contact_hashes: string[]
  _count: {
    users: number
  }
}

export type IShareUserItem = {
  share_id: number
  status?: SHARE_STATUS
  created_at: Date | null
  permission?: PERMISSION | number
  label?: string | null
  job_position?: string | null
  company?: string | null
  is_guest: boolean | null
  dst_user: IUser
  access_main_room?: boolean
}

export type IShareUserGroupItem = {
  share_id: number
  created_at: Date | null
  permission?: PERMISSION | number
  label?: string | null
  dst_usergroup: IUserGroup
}

export type IShareItem<T extends 'user' | 'usergroup'> = T extends 'user'
  ? IShareUserItem
  : T extends 'usergroup'
    ? IShareUserGroupItem
    : never

export type IShares = {
  /**
   * @type array
   * @items.type object
   * @items.additionalProperties true
   */
  shares: IShareItem<'user' | 'usergroup'>[]
  waiting_list: IShareUserItem[]
}

export type IIndividualUser = {
  share_id?: number
  permission?: PERMISSION | number
  user: IUser
  label?: string | null
  job_position?: string | null
  company?: string | null
  is_guest: boolean | null
}
