import { IAttendeeItem, IUniRoomAttendees } from './index.js'
import { IFileResponseModel, IHeaderResponse, IMeetingStatesType, IMeetingStatus, PERMISSION } from '../app/index.js'
import {
  MEETING_TYPE,
  URL_PRIVACY,
  meeting_user,
  MEETING_USER_STATUS,
  ATTENDEE_REQUEST_STATUS,
  meeting,
  breakoutroom_setting,
  usergroup,
  user,
  meeting_project,
  meeting_timeslot,
  meeting_location,
  location,
  file,
  meeting_timeslot_vote,
  meeting_share,
  share,
  timezone,
  header,
  meeting_google,
  DATE_INTERVAL,
  RECURRENCE_RECUR_TYPE,
  server,
  company,
  job_position,
  country,
  booking,
  cancelled_meeting,
  MEETING_PERMIT,
  currency,
  USER_ROLE,
  workspace,
  usergroup_user,
  workspace_user,
  meeting_recurrence,
  user_identity,
  MEETING_TIMER_STATUS,
  private_file,
  MONTHLY_RECURRENCE_TYPE,
} from '../backend.js'
import { IAvatarProps } from '../emailService/index.js'

export enum DASHBOARD_TIME_PERIOD {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

export enum EXTERNAL_MEETING_ACTION {
  play = 'play',
  pause = 'pause',
}
export type MEETING_USER_TOKEN_TYPE =
  | 'booking-decline'
  | 'booking-accept'
  | 'meeting-manage-invite-pending'
  | 'meeting-manage-invite-approved'
  | 'meeting-manage-invite-declined'
  | 'meeting-manage-request-accept'
  | 'meeting-manage-request-reject'
  | 'meeting-manage-request-block'
export type IAddMeetingAttendees = {
  /**
   * @example user
   */
  type: 'usergroup' | 'user' | 'contact'
  /**
   * @example 19
   */
  id: number
  /**
   * @example 255
   */
  role: PERMISSION.Owner | PERMISSION.Admin | PERMISSION.Collaborator | PERMISSION.Viewer

  is_voted?: boolean
}
export type IUpdateAttendees = {
  /**
   * @description Pass for updating/deleting the share. Must NOT pass for creating.
   * @example 21
   */
  share_id?: number
  /**
   * @description Pass for creating a sharing
   * @example user
   */
  type?: 'usergroup' | 'user' | 'contact'
  /**
   * @description Pass for creating a sharing
   * @example 19
   */
  id?: number | string
  /**
   * @description Pass for creating/updating the sharing
   * @example 255
   */
  permission?: PERMISSION
  /**
   * Pass `true` for deleting the sharing
   * @example true
   */
  _delete?: boolean
}

export interface ICheckMeetingTimeSlot {
  meeting_id: number
  started_at: Date | null
  ended_at: Date | null
  type: MEETING_TYPE
  status: IMeetingStatus | null
  meeting_timeslot?: Pick<meeting_timeslot, 'start' | 'end' | 'meeting_timeslot_id'>[]
}

export interface IUpsertMeetingReminders {
  meeting_id: number
  console_project_id: number
  user_id: number
  workspace_id: number
  meetingStartDate: string | Date
  change_type: 'create' | 'update'
  meeting_timeslot?: Pick<meeting_timeslot, 'start' | 'end'>[]
}

export interface IRawRecordingInput {
  started_at: Date | null
  workspace: {
    subdomain: string
    custom_domain?: string
  }
  name: string
  type: MEETING_TYPE
  meeting_recording: {
    meeting_recording_id: number
    is_completed: boolean
    meeting_recording_hash: string
    recording_start_time: Date
    recording_end_time: Date | null
    preview_gif_file:
      | (private_file & {
          user: { first_name: string; last_name: string; user_hash: string; nickname?: string | null }
        })
      | null
    thumbnail_file:
      | (private_file & {
          user: { first_name: string; last_name: string; user_hash: string; nickname?: string | null }
        })
      | null
    name: string
    meeting_recording_user: {
      meeting_recording_user_id: number
      calc_permission: number
      user: {
        user_hash: string
        first_name: string
        last_name: string
        nickname: string | null
        avatar: {
          name: string
          file_hash: string
          path: string
        } | null
      }
    }[]
    url_privacy: URL_PRIVACY
    meeting_recording_file: {
      start_time: Date
      end_time: Date
      recorded_file: private_file & {
        user: { first_name: string; last_name: string; user_hash: string; nickname?: string | null }
      }
      user: { user_hash: string } | null
      peer_id: string
      kind: 'mic' | 'cam' | 'screen'
    }[]
  }[]
}

export interface IHeaderTransformModel {
  header: (header & { file: file | null }) | null
}
export interface IMeetingTimeBlocks {
  meeting_timeslot_id: number
  start: string
  end: string
  initial_order?: number
  attendees: IAttendeeItem[]
}

export interface IAddGoogleMeeting {
  /**
   * @example 19
   */
  user_id: number
  /**
   * @example 7fsu87s99krk
   */
  google_event_id: string
  /**
   * @example test@example.com
   */
  gmail: string
  /**
   * @example 20
   */
  meeting_id: number
}

export type IMeetingRecurrenceRes = {
  meeting_recurrence_id: number
  type: DATE_INTERVAL
  recur_type: RECURRENCE_RECUR_TYPE | null
  repeat_every: number | null
  repeat_interval: number | null
  monthly_at_same_week_and_day: boolean | null
  monthly_type: MONTHLY_RECURRENCE_TYPE | null
  weekly_days: any
  end_date: Date | null
  has_meeting_before?: boolean
  has_meeting_after?: boolean
}
export interface IMeetingDetailTimeSlotParticipant {
  user_id: number
  first_name: string
  last_name: string
  calc_permission: PERMISSION
  timezone: timezone
  order: number | null
  avatar?: {
    path: string
    name: string
    file_hash: string
  }
}

export interface IMeetingLocationMeta {
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

export type IRaiseHandTypes = 'comment' | 'question' | 'idea'

export interface IMeetingDetailDetailParticipant extends IMeetingDetailTimeSlotParticipant {
  status: MEETING_USER_STATUS
  request_status: ATTENDEE_REQUEST_STATUS
  is_seen: boolean
  voted: boolean
  email?: string
  position?: string
  company?: string
}
export type IMeetingDetailShare = {
  share_id: number
  permission: PERMISSION
  dst_user: {
    user_id: number
    first_name: string
    last_name: string
    nickname?: string | null
    email: string | null
    timezone: timezone | null
    avatar: IFileResponseModel
  } | null
  dst_usergroup: {
    usergroup_id: number
    name: string
    module_key: string
    _count: {
      users: number
    }
    avatar: IFileResponseModel
  } | null
}
export interface IMeetingDetailApiResult extends IUniRoomAttendees {
  status: IMeetingStatesType
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
  name: string
  meeting_hash: string
  url: string
  is_poll: boolean
  meeting_location?: {
    location_id?: number
    value?: string
    meta?: {
      /**
       * @example -32.0397560
       * @type number
       * @format float
       */
      lat?: number
      /**
       * @example -32.0397560
       * @type number
       * @format float
       */
      long?: number
    }
    location: {
      key: string
      name: string
      icon: string
    }
  }
  type: MEETING_TYPE
  is_instant: boolean
  url_privacy: URL_PRIVACY
  meeting_times: IMeetingTimeBlocks[]
  meeting_project: {
    project: {
      project_hash: string
      name: string
    }
    readonly: boolean
  }[]
  recording_in_progress_from: Date | null
  started_at?: string
  ended_at?: string | null
  description?: string
  booking?: {
    user: {
      user_id: number
      first_name: string
      last_name: string
      avatar?: IFileResponseModel
    }
    booking_id: number
    service_id: number | null
    service_url: string | null
    service_is_active?: boolean
    /**
     * @example 1
     * @type number
     * @format float
     */
    price: number | null
    currency: string | null
    currency_id: number | null
    variation_title: string | null
    duration: number
    show_free: boolean
    comment?: string
    service_price_id?: number | null
    meta?: {
      /**
       * @type number
       * @format float
       *
       */
      lat?: number
      /**
       * @type number
       * @format float
       *
       */
      long?: number
    }
    show_company_name?: boolean
    show_host_name?: boolean
    workspace_name: string
  }
  max_attendee?: number | null
  max_session_length?: number | null
  meeting_recurrence?: IMeetingRecurrenceRes
  chat_id?: string
  chat_name?: string
  is_chat_enable: boolean
  is_enabled?: boolean
  is_uni_meeting: boolean
  is_e2ee: boolean
  sharedwith?: IMeetingDetailShare[]
  cancelled_meeting?:
    | (cancelled_meeting & { user: { first_name: string; last_name: string; username: string; nickname?: string | null } })
    | null
  ics_link?: string
  enable_presentation_permit: MEETING_PERMIT
  enable_chat_permit: MEETING_PERMIT
  enable_recording_permit: MEETING_PERMIT
  enable_raise_hand_permit: MEETING_PERMIT
  view_transcription_permit: MEETING_PERMIT
  add_agenda_permit: MEETING_PERMIT
  is_local_recording_enable: boolean
  is_cloud_recording_enable: boolean
  is_cloud_recording_autostart: boolean
  is_transcription_autostart: boolean
  meeting_timer_status: MEETING_TIMER_STATUS
  elapsed_time: number
}

export interface IMeetingUserMeta {
  is_replied_invite?: boolean
}

export interface IGetMeetingDetailForNotifyQueryResult {
  meeting_timeslot: { start: Date; end: Date; is_confirmed: boolean }[]
  meeting_location?: {
    location?: { name: string; key: string; icon?: string | null } | null
    value?: string | null
    location_id?: number | null
  } | null
  workspace: {
    workspace_id: number
    subdomain: string
    name: string
    appearance: {
      domain: string | null
    } | null
  }
  meeting_agenda: {
    document: {
      document_hash: string
      blocks: {
        file: { name: string; path: string; file_id: number; mime: string | null; file_hash: string } | null
        document_block_type: { document_block_type_id: number; key: string } | null
        document_block_hash: string
        content: any
      }[]
    } | null
    meeting_user_agenda: {
      meeting_user: {
        user: {
          user_id: number
          avatar: { name: string; path: string; file_hash: string } | null
          first_name: string
          last_name: string
        }
      }
    }[]
    name: string | null
    timebox: number | null
  }[]
  user_id: number
  header?: IHeaderResponse
  header_meeting?: IHeaderTransformModel[]
  emailMainImage?: IAvatarProps
  meeting_hash: string
  url: string
  name: string
  type: MEETING_TYPE
  meeting_id: number
  status: IMeetingStatus
  description?: string | null
  attendees: {
    viewed_at: Date | null
    request_status: ATTENDEE_REQUEST_STATUS
    user: {
      role: USER_ROLE
      last_signin: Date | null
      timezone: { name: string } | null
      user_identity: { value: string }[]
      workspace_user: {
        user_profile: {
          profile_experience: {
            company: company | null
            job_position: job_position | null
          }[]
        } | null
        user_id: number
        is_guest: boolean
        workspace_id: number
      }[]
      user_id: number
      user_hash: string
      username: string
      avatar: { name: string; path: string; file_hash: string } | null
      first_name: string
      last_name: string
      user_notification_setting: {
        user_id: number
        workspace_id: number
        email_mode: number
      }[]
    }
    calc_permission: number
  }[]
  owner: {
    user_id: number
    user_identity: { value: string }[]
  }
  _count: { attendees: number }
}

export type IGetAllAttendeeByIdQueryResult = {
  user_id: number
  user: {
    first_name: string
    last_name: string
  }
  status: MEETING_USER_STATUS
  request_status: ATTENDEE_REQUEST_STATUS
  calc_permission: PERMISSION
  meeting: {
    status: number
    chat_id: string
    chat_name: string
    attendees: meeting_user[]
  }
  meeting_user_id: number
}

export type IGetAttendeeRequestsByStatusQueryResult = {
  request_status: ATTENDEE_REQUEST_STATUS
  user: {
    user_id: number
    avatar: {
      file_id: number
      path: string
      name: string
      file_hash: string
    }
    first_name: string
    last_name: string
  }
}

export type IGetBORListQueryResult = {
  breakoutroom_setting: breakoutroom_setting | null
  status: number
  type: MEETING_TYPE
  attendees: (meeting_user & {
    user: user & { avatar: file | null }
    access_main_room: boolean
  })[]
  child_rooms: (meeting & {
    attendees: (meeting_user & {
      user: user & { avatar: file | null }
      access_main_room: boolean
    })[]
    breakoutroom_setting: breakoutroom_setting | null
  })[]
  meeting_hash: string
  url: string
  chat_id: string | null
  chat_name: string | null
  main_room: meeting | null
  main_room_id: number | null
  name: string
}

export type IGetMeetingQueryExpand =
  | 'workspace'
  | 'breakoutroom_setting'
  | 'meeting_share'
  | 'header_meeting'
  | 'meeting_project'
  | 'meeting_timeslot'
  | 'cancelled_meeting'
  | 'meeting_recurrence'
  | 'meeting_location'
  | 'meeting_location.location'
  | 'child_rooms'
  | 'child_rooms.attendees'
  | 'main_room'
  | 'main_room.child_rooms'
  | 'main_room.child_rooms.attendees'
  | 'main_room.breakoutroom_setting'
  | 'main_room.attendees'
  | 'attendees'
  | 'server'
  | 'attendees.votes'
  | 'meeting_google'
  | 'booking'
  | 'ai_session'
  | 'meeting_recording'
  | 'meeting_transcription'
  | 'reset_room_option'

/**
 * Curated for mediaserver-repo-proxy API, since we couldn't share backend's function return types.
 */
export type IGetMeetingQuery = meeting & {
  workspace: workspace & {
    server: server
  }
  breakoutroom_setting: breakoutroom_setting | null
  meeting_share: (meeting_share & {
    share: share & {
      dst_user:
        | (user & {
            avatar: {
              name: string
              file_hash: string
              path: string
            } | null
            timezone: {
              name: string
            } | null
            user_identity: {
              value: string
            }[]
          })
        | null
      dst_usergroup:
        | (usergroup & {
            users: (usergroup_user & {
              user:
                | (user & {
                    timezone: {
                      name: string
                    } | null
                    user_identity: {
                      value: string
                    }[]
                    avatar: {
                      name: string
                      file_hash: string
                      path: string
                    } | null
                  })
                | null
            })[]
          })
        | null
    }
  })[]
  meeting_project: (meeting_project & {
    project: { project_hash: string }
  })[]
  server: (server & { country: country }) | null
  meeting_timeslot: meeting_timeslot[]
  meeting_recurrence: meeting_recurrence | null
  header_meeting: {
    header: header & { file: file | null }
  }[]
  meeting_location: (meeting_location & { location: location | null }) | null
  child_rooms: (meeting & {
    attendees: (meeting_user & {
      user: {
        role: USER_ROLE
        avatar: {
          name: string
          file_hash: string
          path: string
        } | null
        user_id: number
        first_name: string
        last_name: string
      }
    })[]
    breakoutroom_setting: breakoutroom_setting | null
  })[]
  main_room:
    | (meeting & {
        child_rooms: meeting[]
        breakoutroom_setting: breakoutroom_setting | null
        attendees: (meeting_user & {
          user: {
            timezone: timezone | null
            avatar: { name: string; file_hash: string; path: string } | null
            user_id: number
            first_name: string
            last_name: string
            username: string
          }
        })[]
      })
    | null
  attendees: (meeting_user & {
    votes: meeting_timeslot_vote[]
    user: {
      avatar: { name: string; file_hash: string; path: string } | null
      timezone: timezone | null
      role: USER_ROLE
      user_identity: user_identity[]
      workspace_user: workspace_user[]
      user_id: number
      user_hash: string
      first_name: string
      last_name: string
      nickname: string | null
      username: string
    }
  })[]
  meeting_recording: {
    meeting_recording_id: number
    meeting_recording_hash: string
    recording_start_time: Date
    recording_end_time: Date | null
    name: string
    meeting_recording_file: {
      start_time: Date
      end_time: Date
      peer_id: string
      kind: 'mic' | 'cam' | 'screen'
    }[]
  }[]
  meeting_google: meeting_google | null
  booking: booking | null
  cancelled_meeting: cancelled_meeting | null
}

export interface IGetMeetingListItemWithId {
  /**
   * @example 3
   */
  attendee_count: number
  attendees: {
    /**
     * @example joined
     */
    status: MEETING_USER_STATUS
    /**
     * @example pending
     */
    request_status: ATTENDEE_REQUEST_STATUS
    /**
     * @example 255
     */
    calc_permission: PERMISSION
    /**
     * @example true
     */
    is_voted: boolean
    user: {
      /**
       * @example 19
       */
      user_hash: string
      avatar?: IFileResponseModel
      /**
       * @example John
       */
      first_name: string
      /**
       * @example Doe
       */
      last_name: string
    } | null
  }[]
  end?: Date
  ended_at: Date | null
  /**
   * @example 7fsu87s99krk
   */
  meeting_hash: string
  url: string
  is_recurring: boolean
  meeting_project?: {
    project_hash: string
    /**
     * @example ProjectName
     */
    name: string
  }[]
  header: IHeaderResponse
  meeting_type: MEETING_TYPE
  url_privacy: URL_PRIVACY
  meeting_state: 'past' | 'live' | 'scheduled'
  /**
   * @example dailySession
   */
  name: string
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  start?: Date
  /**
   * @example 2022-04-06T15:00:00.931Z
   */
  started_at: Date | null
  status: IMeetingStatesType
  /**
   * @example 18
   */
  voted_count?: number
  /**
   * @example 3
   */
  timeslot_count: number
  /**
   * @example 5
   */
  agenda_count: number
  meeting_timeslot: meeting_timeslot[]
  /**
   * @example true
   */
  is_enabled: boolean
  /**
   * @example 18
   */
  meeting_id: number
  has_transcription: boolean
  has_recording: boolean
  booking?: {
    booking_id: number
    user: {
      /**
       * @example 19
       */
      user_hash: string
      first_name: string
      last_name: string
      avatar?: IFileResponseModel
    }
    /**
     * @example 1
     * @type number
     * @format float
     */
    price: number | null
    duration: number
    service_id: number | null
    currency: currency
    show_free: boolean
    variation_title?: string | null
  }
}

export type IRepoMethods =
  | 'meeting.getUniqueMeetingByQuery'
  | 'meeting.getByQuery'
  | 'meeting.messaging'
  | 'meeting.updateMeeting'
  | 'meeting.createMeetingLog'
  | 'meeting.handleMigrateMeeting'
export type IRepoInput<T extends IRepoMethods> = T extends 'meeting.getUniqueMeetingByQuery'
  ? {
      method: 'meeting.getUniqueMeetingByQuery'
      input: {
        condition: {
          meeting_hash?: string
          meeting_id?: number
        }
        expand: IGetMeetingQueryExpand[]
      }
    }
  : T extends 'meeting.getByQuery'
    ? {
        method: 'meeting.getByQuery'
        input: {
          condition: {
            meeting_hash?: string
            type?: MEETING_TYPE
            main_room_id?: number
          }
          expand: ('attendees' | 'main_room.attendees')[]
        }
      }
    : T extends 'meeting.handleMigrateMeeting'
      ? {
          method: 'meeting.handleMigrateMeeting'
          input: {
            meeting_hash: string
            sid: number
            url: string
          }
        }
      : T extends 'meeting.updateMeeting'
        ? {
            method: 'meeting.updateMeeting'
            input: {
              condition: {
                meeting_hash: string
              }
              data: {
                is_e2ee?: boolean
              }
            }
          }
        : T extends 'meeting.createMeetingLog'
          ? {
              method: 'meeting.createMeetingLog'
              input: {
                data: {
                  meeting: { connect: { meeting_id: number } }
                  type: { connectOrCreate: { where: { name: string }; create: { name: string } } }
                  user?: { connect: { user_id: number } } | undefined
                  fired_by?: string
                  fired_target?: string
                  extra?: Record<string, any>
                  reason?: string | null
                  happened_at: Date
                }
              }
            }
          : T extends 'meeting.messaging'
            ? {
                method: 'meeting.messaging'
                input: {
                  type: string
                  data: any
                }
              }
            : never

export type IMediaServerRepoProxyResData<T extends IRepoMethods> = T extends 'meeting.getUniqueMeetingByQuery'
  ? {
      result: IGetMeetingQuery | null
    }
  : T extends 'meeting.getByQuery'
    ? {
        result:
          | (meeting & {
              main_room:
                | (meeting & {
                    attendees: meeting_user[]
                  })
                | null
              attendees: meeting_user[]
            })
          | null
      }
    : T extends 'meeting.handleMigrateMeeting'
      ? {
          result: boolean
        }
      : T extends 'meeting.messaging'
        ? {
            result: boolean
          }
        : never

export type IMeetingLogItem = {
  meeting_log_id: number
  type: {
    meeting_log_type_id: number
    name: string
  }
  fired_by: string | null
  user_id: number | null
  fired_target: string | null
  reason: string | null
  /**
   * @additionalProperties true
   */
  extra: Record<string, any>
  happened_at: Date
  created_at: Date
}
