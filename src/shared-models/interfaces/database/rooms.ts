import { IHeaderResponse, LOCATION_KEY, PERMISSION } from '../index.js'
import { IFileResponseModel, IMeetingStatesType, IMeetingStatus } from '../app/index.js'
import {
  MEETING_TYPE,
  URL_PRIVACY,
  MEETING_USER_STATUS,
  ATTENDEE_REQUEST_STATUS,
  ATTENDEE_REQUEST_TYPE,
  timezone,
  USER_ROLE,
  MEETING_PERMIT,
} from '../backend.js'

export interface IResetRoomOptions {
  remove_agenda?: boolean
  remove_attendees?: boolean
  remove_admins?: boolean
  remove_projects?: boolean
  remove_breakoutRoom?: boolean
  remove_description?: boolean
  remove_chat?: boolean
  remove_note?: boolean
}

export interface IBaseAttendeeModel {
  /**
   * @example 19
   */
  user_id: number
  /**
   * @example asdasdasdasda
   */
  user_hash?: string
  /**
   * @example John
   */
  first_name: string
  /**
   * @example Doe
   */
  last_name: string

  /**
   * @example {name: 'noExample'}
   */
  timezone?: timezone | null
  /**
   * @example 255
   */
  role: USER_ROLE
  /**
   * @example true
   */
  is_guest?: boolean
  /**
   * @example {full_path: '/api/upload/...', alt: 'something.png', file_id: 1484}
   */
  avatar: IFileResponseModel
  /**
   * @example test@example.com
   */
  email?: string | null
  /**
   * @example developer
   */
  position?: string | null
  /**
   * @example alimansoori71
   */
  company?: string | null
  /**
   * @example alimansoori71
   */
  nickname?: string | null
}
export interface IAttendeeItem {
  /**
   * @example 18
   */
  meeting_user_id: number
  /**
   * @example false
   */
  is_voted: boolean
  /**
   * @example false
   */
  is_starred: boolean
  /**
   * @example guest
   */
  role: USER_ROLE
  /**
   * @example true
   */
  is_guest?: boolean
  /**
   * @example true
   */
  is_verified: boolean
  /**
   * @example true
   */
  access_main_room: boolean

  /**
   * @example joined
   */
  status: MEETING_USER_STATUS
  /**
   * @example approved
   */
  request_status: ATTENDEE_REQUEST_STATUS
  /**
   * @example invited
   */
  request_type: ATTENDEE_REQUEST_TYPE
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  viewed_at: Date | null
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  knocking_time: Date | null
  talking_time_percentage: number | null
  /**
   * @example 64
   */
  calc_permission: PERMISSION
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  joined_at: Date | null
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  left_at: Date | null
  /**
   * @example 3
   */
  duration?: number
  /**
   * @example 1
   */
  order?: number | null
  is_unavailable?: boolean
  label: string | null
  user: IBaseAttendeeModel

  is_booker?: boolean // where this user is booker or not for meeting of booking type
}

export interface IWaitingUserModel {
  /**
   * @example 19
   */
  meeting_user_id: number
  /**
   * @example pending
   */
  request_status: ATTENDEE_REQUEST_STATUS
  /**
   * @example invited
   */
  request_type: ATTENDEE_REQUEST_TYPE
  user: IBaseAttendeeModel
}

export type IUniRoomAttendees = {
  waiting_users: IWaitingUserModel[] // just sends to admin and owner
  attendees: IAttendeeItem[]
}

export type IGetRoomResult = IUniRoomAttendees & {
  status: IMeetingStatesType
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  started_at: Date
  /**
   * @example 7fsu87s99krk
   */
  meeting_hash: string
  /**
   * @example daily
   */
  url: string
  /**
   * @example meeting
   */
  type: MEETING_TYPE
  /**
   * @example 11
   */
  max_attendee?: number | null
  /**
   * @example 20
   */
  max_session_length?: number | null
  /**
   * @example 1
   */
  workspace_id: number | null
  /**
   * @example myRoom
   */
  name: string
  /**
   * @example some detail here
   */
  description: string | null
  enable_presentation_permit: MEETING_PERMIT
  enable_chat_permit: MEETING_PERMIT
  enable_recording_permit: MEETING_PERMIT
  enable_raise_hand_permit: MEETING_PERMIT
  view_transcription_permit: MEETING_PERMIT
  add_agenda_permit: MEETING_PERMIT
  // child_rooms: meeting & {
  //   attendees: meeting_user[];
  // }[];
  meeting_location: {
    location: {
      /**
       * @example noExample
       */
      name: string
      /**
       * @example 1
       */
      location_id: number
      /**
       * @example uni_meet_video
       */
      key: LOCATION_KEY.uni_meet_audio | LOCATION_KEY.uni_meet_video | LOCATION_KEY.uni_meet_webinar
      /**
       * @example noExample
       */
      icon: string
    }
  }
  recording_in_progress_from: Date | null
  /**
   * @example 11
   */
  chat_id: string | null
  /**
   * @example talk1
   */
  chat_name: string | null
  is_chat_enable: boolean
  /**
   * @example false
   */
  is_enabled: boolean | null
  breakoutroom: {
    /**
     * @example true
     */
    is_enabled: boolean
    /**
     * @example true
     */
    show: boolean
    /**
     * @example 2
     */
    count: number | null
    /**
     * @example 2
     */
    online_count: number | null
    url_array: string[]
  }
  is_local_recording_enable: boolean
  is_cloud_recording_enable: boolean
  is_cloud_recording_autostart: boolean
  is_transcription_autostart: boolean
  /**
   * @example false
   */
  reset_after_close: boolean
  is_e2ee: boolean
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  created_at: Date | null
  url_privacy: URL_PRIVACY
  reset_room_option?: IResetRoomOptions | null
  meeting_project: {
    project: {
      project_hash: string
      /**
       * @example noExample
       */
      name: string
      header: IHeaderResponse
    }
    /**
     * @example false
     */
    readonly: boolean
  }[]
  main_room?: {
    /**
     * @example asdasdasdasda
     */
    url?: string
    /**
     * @example asdasdasdasda
     */
    meeting_hash?: string
    /**
     * @example LIVE
     */
    status?: IMeetingStatus
    /**
     * @example room
     */
    type?: MEETING_TYPE
  } | null
  me?: {
    /**
     * @example false
     */
    is_attendee: boolean
    /**
     * @example false
     */
    is_visible_on_profile?: boolean
    /**
     * @example asdasdasdasda
     */
    user_hash?: string
    /**
     * @example 20
     */
    meeting_user_id?: number
    /**
     * @example false
     */
    is_starred?: boolean
    /**
     * @example 64
     */
    role?: PERMISSION
    /**
     * @example 64
     */
    calc_permission?: PERMISSION // should change some "role"s and "permission" to calc_permission
    /**
     * @example joined
     */
    meeting_user_status?: MEETING_USER_STATUS
    meeting_user_request_status?: ATTENDEE_REQUEST_STATUS
    meeting_user_request_type?: ATTENDEE_REQUEST_TYPE
    knocking_time: Date | null
    has_note: boolean
  }
}

export type IGetAllRoomsItem = {
  /**
   * @example 7fsu87s99krk
   */
  meeting_hash: string
  /**
   * @example daily
   */
  url: string
  /**
   * @example myRoom
   */
  name: string
  /**
   * @example some detail here
   */
  description: string | null
  /**
   * @example meeting
   */
  type: MEETING_TYPE
  /**
   * @example 2
   */
  status: IMeetingStatesType
  /**
   * @example false
   */
  is_enabled: boolean
  /**
   * @example true
   */
  is_knocked: boolean
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  started_at: Date | null
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  ended_at: Date | null
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  created_at: Date | null
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  updated_at: Date | null
  /**
   * @example 5
   */
  agenda_count: number
  header: IHeaderResponse
  /**
   * @example 19
   */
  owner_id: number
  has_transcription: boolean
  has_recording: boolean
  attendees: {
    /**
     * @example invited
     */
    status: MEETING_USER_STATUS
    /**
     * @example approved
     */
    request_status: ATTENDEE_REQUEST_STATUS
    user: {
      /**
       * @example 13
       */
      user_id: number
      avatar: IFileResponseModel
      /**
       * @example John
       */
      first_name: string
      /**
       * @example Doe
       */
      last_name: string
      nickname?: string | null
    }
  }[]
  meeting_timeslot: {
    /**
     * @example 2022-04-06T15:00:00.931Z
     */
    start: Date
    /**
     * @example 2022-04-06T15:00:00.931Z
     */
    end: Date
  }
  meeting_project: {
    project: {
      project_hash: string
      /**
       * @example noExample
       */
      name: string
    }
  }[]
}
