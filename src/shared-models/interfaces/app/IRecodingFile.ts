import { PERMISSION } from './Permission.enum.js'
import { IFileResponseModel } from './IFileResponseModel.js'
import { MEETING_TYPE, URL_PRIVACY } from '../../interfaces/backend.js'

export type IRecodingFile = {
  meeting_recording_id: number
  is_completed: boolean
  meeting_recording_hash: string
  relative_recording_start_time: string
  absolute_recording_start_time: Date
  name: string
  meeting_name: string
  meeting_type: MEETING_TYPE
  preview_gif: IFileResponseModel | null
  preview_thumbnail: IFileResponseModel | null
  url_privacy: URL_PRIVACY
  created_by?: {
    first_name: string
    last_name: string
    nickname?: string | null
    user_hash: string
  }
  size: number
  absolute_recording_end_time: Date
  recording_duration: string
  files: (IFileResponseModel & {
    relative_start_time: string
    absolute_start_time: Date
    relative_end_time: string
    user_hash?: string
    peer_id: string
    kind: 'mic' | 'cam' | 'screen'
  })[]
  meeting_recording_user: {
    meeting_recording_user_id: number
    user: {
      user_hash: string
      first_name: string
      last_name: string
      nickname: string | null
      avatar: IFileResponseModel | null
    }
  }[]
  me: {
    /**
     * @example 255
     */
    PERMISSION: PERMISSION | null
    /**
     * @example 255
     */
    calc_permission: PERMISSION | null
    /**
     * @example 7fsu87s99krk
     */
    user_hash: string | null
    /**
     * @example false
     */
    is_visible_on_profile?: boolean
  }
}
