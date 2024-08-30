import { IFileResponseModel, NOTIFICATION_EMAIL_MODE, NOTIFICATION_MODE, NOTIFICATION_SMS_MODE } from '../app/index.js'
import { availability, AVAILABILITY_TEMPLATE_TYPE, notification, timezone } from '../backend.js'

export interface INotificationInitiator {
  user_id: number
  first_name: string
  last_name: string
  nickname?: string | null
  timezone: timezone | null
  avatar: IFileResponseModel
  email: string | null
  position?: string | null
  company?: string | null
  username: string | null
}

export type INotificationAndSetting = notification & {
  notificationSetting: {
    user_notification_setting_id: number
    mode: NOTIFICATION_MODE
    email_mode: NOTIFICATION_EMAIL_MODE
    sms_mode: NOTIFICATION_SMS_MODE
    updated_at: Date
    availability_template: {
      timezone: timezone | null
      availability: availability[]
      availability_template_id: number
      type: AVAILABILITY_TEMPLATE_TYPE
      name: string | null
    } | null
    keywords: {
      created_at: Date
      keyword: string
    }[]
  }
}
