import { INotificationInitiator } from '../index.js'
import {
  IMeetingActionNotif,
  IMeetingInfoNotif,
  IMeetingKnockNotif,
  IMeetingRecordingInviteNotif,
  IModuleRequestAccessNotif,
  IModuleRequestAccessReplyNotif,
  INoteInfoNotif,
  INoteInviteNotif,
  INotificationTest,
  IOpportunityInfoNotif,
  IProjectActionNotif,
  IServiceInviteNotif,
  IWorkspaceInviteNotif,
} from './INotificationMeta.js'

export type INotificationMetaMention<K extends string> = Record<K, { text: string; id: number | string | null }>

export interface INotificationDefaults {
  notification_id: number
  created_at: Date
  is_read: boolean
  is_seen: boolean
  is_silent: boolean
  src_user: INotificationInitiator | null
  dst_user_id: number
  // message?: string;
  workspace_id: number | null
}

export type INotificationDataModel<T, K extends keyof T> = {
  template: K
  meta: T[K]
}

export interface INotificationTemplateMeta {
  meeting_canceled: IMeetingActionNotif
  meeting_attended: IMeetingActionNotif
  meeting_poll_canceled: IMeetingActionNotif
  meeting_poll_updated: IMeetingActionNotif
  meeting_poll_declined_one: IMeetingActionNotif
  meeting_declined_one: IMeetingActionNotif
  meeting_vote: IMeetingActionNotif
  meeting_invite_poll: IMeetingActionNotif
  room_added: IMeetingActionNotif
  meeting_invite: IMeetingActionNotif
  meeting_updated: IMeetingActionNotif
  meeting_confirmed: IMeetingActionNotif
  service_invite: IServiceInviteNotif
  service_host_changed: IServiceInviteNotif
  booking_declined: IMeetingActionNotif
  booking_canceled: IMeetingActionNotif
  booking_confirmed: IMeetingActionNotif
  booking_pending: IMeetingActionNotif
  booking_rescheduled: IMeetingActionNotif
  booking_auto_confirm: IMeetingActionNotif
  booking_invited: IMeetingActionNotif
  meeting_invitation_approved: IMeetingActionNotif
  room_invitation_approved: IMeetingActionNotif
  meeting_knock_request: IMeetingKnockNotif

  meeting_all_voted: IMeetingInfoNotif
  meeting_reminder_tomorrow: IMeetingInfoNotif
  meeting_reminder_1hr: IMeetingInfoNotif
  meeting_reminder_30min: IMeetingInfoNotif
  meeting_reminder_now: IMeetingInfoNotif
  meeting_start: IMeetingInfoNotif
  meeting_missed: IMeetingInfoNotif
  meeting_recording_invite: IMeetingRecordingInviteNotif
  room_opened: IMeetingInfoNotif

  module_request_access: IModuleRequestAccessNotif
  workspace_invite: IWorkspaceInviteNotif
  workspace_join: IModuleRequestAccessNotif
  workspace_left: IModuleRequestAccessNotif
  module_request_access_reply: IModuleRequestAccessReplyNotif
  notification_test: INotificationTest

  page_invite: INoteInviteNotif
  page_update: INoteInfoNotif
  matter_added: IProjectActionNotif

  opportunity_updated: IOpportunityInfoNotif
  opportunity_expressed: IOpportunityInfoNotif
  opportunity_assigned: IOpportunityInfoNotif
  opportunity_invited: IOpportunityInfoNotif
}

export type INotificationTemplate = keyof INotificationTemplateMeta

export type INotificationMeta<T extends INotificationTemplate> = INotificationDataModel<INotificationTemplateMeta, T>

export type INotification<T extends INotificationTemplate = INotificationTemplate> = INotificationDefaults &
  INotificationDataModel<INotificationTemplateMeta, T>
