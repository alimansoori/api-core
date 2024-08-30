import { IBaseAttendeeModel } from '../index.js'
import { IHeaderResponse, IMeetingStatesEnum, ISearchableModule, IFileResponseModel, LOCATION_KEY } from '../app/index.js'
import { MEETING_TYPE, IDENTITY_TYPE, URL_PRIVACY, currency } from '../backend.js'

export enum ISearchMeetingScope {
  'upcoming' = 'upcoming',
  'past' = 'past',
  'poll' = 'poll',
}

export enum IIntegrationEventType {
  'google' = 'google',
  'microsoft' = 'microsoft',
  'uni' = 'uni',
}

export type IGetWorkspacesQueryResult = {
  chat_user_id: string | null
  workspace: {
    user_id: number
    workspace_id: number
    header: IHeaderResponse
    name: string
    _count: {
      workspace_user: number
    }
  }
  user_profile: {
    job_position: {
      name?: string
    } | null
  } | null
}

export type IGetCalendarDBQueryResult = {
  meeting_hash?: string
  name: string
  started_at?: Date
  ended_at?: Date
  meeting_type?: MEETING_TYPE
  booking?: {
    booking_id: number
    user: {
      user_id: number
      first_name: string
      last_name: string
      nickname?: string | null
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
  integration_type: IIntegrationEventType
  is_busy?: boolean
  status?: keyof typeof IMeetingStatesEnum
  calendar_id?: string
  is_recurring: boolean
  /**
   * @example 18
   */
  voted_count?: number
  /**
   * @example 3
   */
  timeslot_count?: number
  times: {
    start: Date | string
    end: Date | string
    order?: number | null
    timezone?: string
  }[]
  meeting_project?: {
    project_hash: string
    name: string
  }[]
  meeting_location: {
    location_id: number | null
    value: string | null
    location: {
      name: string
      icon: string
      key: string
    } | null
  } | null
  attendees?: {
    user_id: number
    avatar: IFileResponseModel | null
    first_name: string
    username: string
    last_name: string
    nickname?: string | null
  }[]
}

export type IGetWorkspaceQueryResult = {
  workspace_id: number
  name: string
  subdomain: string
  url_privacy: URL_PRIVACY
  is_search_indexable: boolean | null
  created_at: Date | null
  appearance?: {
    // appearance
    primary_color: string | null
    primary_dark_color: string | null
    secondary_color: string | null
    secondary_dark_color: string | null
  }
  console_project?: {
    // project
    console_project_id: number
    name: string
  }
  workspace_profile?: {
    // workspace_profile.header
    header: IHeaderResponse
  }
  _count?: {
    // _count.workspace_users
    workspace_users: number
  }
  me?: {
    // me
    workspace_user_id: number
    status: number
    is_guest: boolean
    chat_user_id: string | null
    chat_username: string | null
    role?: {
      // me.role
      role_id: number
      name: string
      accesses: {
        value: boolean
        access: {
          key: string
          name: string
        }
      }[]
    }
    user?: {
      // me.user
      user_id: number
      first_name: string
      last_name: string
      nickname?: string | null
      username: string | null
      avatar?: IFileResponseModel // me.user.avatar
      user_identity?: {
        // me.user.user_identity
        user_identity_id: number
        type: IDENTITY_TYPE
        value: string
      }[]
    }
  } | null
}

export type IWorkspaceWithProject = {
  workspace_id: number
  user_id: number
  name: string
  subdomain: string
  appearance: {
    domain: string | null
  } | null
  server_id: number
  server: { url: string }
  console_project: {
    console_project_id: number
    domain: string
    name: string | null
  } | null
}

export type ISearchInModulesResItem<T extends ISearchableModule> = (T extends 'meeting_upcoming'
  ? { meeting_hash: string; name: string }
  : T extends 'meeting_past'
    ? { meeting_hash: string; name: string }
    : T extends 'meeting_poll'
      ? { meeting_hash: string; name: string }
      : T extends 'room'
        ? { url: string; name: string }
        : T extends 'note'
          ? { note_hash: string; name: string }
          : T extends 'project'
            ? { project_hash: string; name: string }
            : T extends 'opportunity'
              ? { opportunity_hash: string; name: string }
              : T extends 'service'
                ? { service_url: string; name: string }
                : T extends 'contact'
                  ? { contact_hash: string; name: string }
                  : T extends 'usergroup'
                    ? { usergroup_id: number; name: string }
                    : T extends 'folder'
                      ? { folder_hash: string; name: string }
                      : T extends 'private_file'
                        ? { private_file_hash: string; name: string }
                        : undefined) & { last_modified: Date; header?: IHeaderResponse }

export type ISearchInModulesResult = {
  items: {
    type: ISearchableModule
    item: ISearchInModulesResItem<ISearchableModule>
  }[]
}

export type ICalendarEventDetails = {
  event_id: string
  integration_type: IIntegrationEventType
  name: string
  start: Date
  end: Date
  user_id: number
  meeting_hash?: string
  description?: string
  attendees?: {
    name: string
    email: string
    is_owner: boolean
    owner_system_email?: string
    registered_user?: IBaseAttendeeModel
  }[]
  location?: {
    location_key: LOCATION_KEY
    name: string
    value?: string
    // google_meet?: {
    //   link?: string,
    // },
    // skype_meet?: {
    //   link?: string,
    // },
    in_person?: {
      // physical_address?: string,
      coordinates?: {
        /**
         * @minimum -90
         * @example 90
         * @type number
         * @format float
         */
        lat: number
        /**
         * @minimum -180
         * @example 180
         * @type number
         * @format float
         */
        long: number
      }
    }
  }
}
