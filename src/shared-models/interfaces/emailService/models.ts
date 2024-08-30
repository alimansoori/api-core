import { ATTENDEE_REQUEST_STATUS } from '../backend.js'
import { NOTIFICATION_EMAIL_MODE, PERMISSION } from '../app/index.js'
import { IEmailTemplates } from './IEmailTemplates.js'
import {
  IAgendaItemsProps,
  IAttendeesProps,
  IBookingAppointmentType,
  IFooterProps,
  IHeaderProps,
  ILocationProps,
  ILoginNewUserData,
  IMainCTAProps,
  IPasswordChangedUserData,
  IPinCodeProps,
  ITimeSlotsProps,
} from './interfaces.js'

// export enum EmailTypeEnum {
//   EmailBasic = 'EmailBasic',
//   MeetingWithTimeAgenda = 'MeetingWithTimeAgenda',
//   MeetingWithICS = 'MeetingWithICS',
//   MeetingWithComment = 'MeetingWithComment',
//   MeetingBaseEmail = 'MeetingBaseEmail',
//   BookingEmail = 'BookingEmail',
//   BookingWithICS = 'BookingWithICS',
//   ChangePassword = 'ChangePassword',
//   ChangePasswordSuccessfully = 'ChangePasswordSuccessfully',
//   UnknownLoginAttempt = 'UnknownLoginAttempt',
// }
// export type EmailType = keyof typeof EmailTypeEnum;
export type EmailType =
  | 'EmailBasic'
  | 'MeetingBaseEmail'
  | 'MeetingWithTimeAgenda'
  | 'MeetingWithICS'
  | 'MeetingWithComment'
  | 'BookingEmail'
  | 'BookingWithICS'
  | 'ChangePassword'
  | 'ChangePasswordSuccessfully'
  | 'UnknownLoginAttempt'
export type EmailBasic = {
  emailDataType: EmailType
  header: IHeaderProps
  mainCTA: IMainCTAProps
  footer: IFooterProps
}

export type MeetingBaseEmail = EmailBasic & {
  attendees: IAttendeesProps
}

export type MeetingWithTimeAgenda = MeetingBaseEmail & {
  timeSlots: ITimeSlotsProps
  agenda: IAgendaItemsProps
  location?: ILocationProps
}
export type MeetingWithICS = MeetingWithTimeAgenda & {
  icsLink?: string
  icsValue?: string
}

export type MeetingWithComment = MeetingWithTimeAgenda & {
  comment?: string
}

export type BookingEmail = MeetingWithTimeAgenda & {
  appointment_type: IBookingAppointmentType
  comment?: string
}

export type BookingWithICS = BookingEmail & {
  icsLink?: string
  icsValue?: string
  rescheduleUrl?: string
  cancelUrl?: string
}

export type ChangePassword = EmailBasic & {
  pinCode: IPinCodeProps
}

export type ChangePasswordSuccessfully = EmailBasic & {
  data: IPasswordChangedUserData
}
export type UnknownLoginAttempt = EmailBasic & {
  data: ILoginNewUserData
}

export type SendEmailDataType<T extends EmailType> = T extends 'EmailBasic'
  ? EmailBasic
  : T extends 'MeetingWithTimeAgenda'
    ? MeetingWithTimeAgenda
    : T extends 'MeetingWithICS'
      ? MeetingWithICS
      : T extends 'MeetingWithComment'
        ? MeetingWithComment
        : T extends 'MeetingBaseEmail'
          ? MeetingBaseEmail
          : T extends 'BookingEmail'
            ? BookingEmail
            : T extends 'BookingWithICS'
              ? BookingWithICS
              : T extends 'ChangePassword'
                ? ChangePassword
                : T extends 'ChangePasswordSuccessfully'
                  ? ChangePasswordSuccessfully
                  : T extends 'UnknownLoginAttempt'
                    ? UnknownLoginAttempt
                    : null

export type CoverAndLogo = {
  logo: {
    src: string
    alt: string
  }
  cover:
    | {
        src: string
        alt: string
      }
    | undefined
}

export type Receiver = {
  email: string
  user_id: number
  user_hash: string
  is_guest: boolean
  calc_permission: PERMISSION
  request_status: ATTENDEE_REQUEST_STATUS
  time_zone?: string
  email_mode?: NOTIFICATION_EMAIL_MODE
}

export type WorkspaceFeatures = {
  workspace_id: number
  name: string
  subdomain: string
  custom_domain?: string
}

export type SendEmailReq<T extends EmailType> = {
  data: SendEmailDataType<T>
  config: {
    senderName: string
    isSystemEmail: boolean
    template: IEmailTemplates
    to: string
    locale: string
    subject: string
  }
}
