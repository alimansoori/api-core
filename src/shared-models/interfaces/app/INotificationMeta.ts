import { SHARABLE_MODULE } from '../index.js'
import { MEETING_TYPE } from '../backend.js'
import { INotificationMetaMention } from './INotification.js'
import { IRequestToJoinRespond } from './../database/sharing.js'

export interface IMeetingActionNotif {
  meeting: {
    meeting_hash: string
    url: string
    name: string
    type: MEETING_TYPE
    response?: IRequestToJoinRespond
  }
  variables: INotificationMetaMention<'src_user_id' | 'meeting_name'>
}

export interface IMeetingKnockNotif {
  meeting_user_id: number
  meeting: {
    meeting_hash: string
    url: string
    name: string
    type: MEETING_TYPE
  }
  variables: INotificationMetaMention<'src_user_id' | 'meeting_name'>
}

export interface IMeetingInfoNotif {
  meeting: {
    meeting_hash: string
    url: string
    name: string
    type: MEETING_TYPE
  }
  variables: INotificationMetaMention<'src_user_id' | 'meeting_name'>
}

export interface IModuleRequestAccessNotif {
  module: SHARABLE_MODULE
  record_id: number | string
  share_id: number
  variables: INotificationMetaMention<'src_user_id' | 'name'>
}

export interface IWorkspaceInviteNotif {
  workspace: {
    name: string
    workspace_id: number
  }
  variables: [INotificationMetaMention<'src_user_id' | 'name'>]
}

export interface IModuleRequestAccessReplyNotif {
  module: SHARABLE_MODULE
  record_id: number | string
  respond: 'accepted' | 'declined'
  share_id: number
  variables: INotificationMetaMention<'src_user_id' | 'respond' | 'name'>
}

export interface INoteInviteNotif {
  invited_user_id: number
  page: {
    page_hash: string
    name: string
  }
  variables: INotificationMetaMention<'src_user_id' | 'page_name'>
}

export interface INoteInfoNotif {
  page: {
    page_hash: string
    name: string
  }
  variables: INotificationMetaMention<'src_user_id' | 'page_name'>
}

export interface IProjectActionNotif {
  project: {
    project_hash: string
    name: string
  }
  variables: INotificationMetaMention<'src_user_id' | 'project_name'>
}

export interface IOpportunityInfoNotif {
  opportunity: {
    name: string
    opportunity_hash: string
  }
  variables: INotificationMetaMention<'src_user_id' | 'opportunity_name'>
}

export interface IServiceInviteNotif {
  invited_user_id: number
  service: {
    service_url: string
    name: string
  }
  variables: INotificationMetaMention<'src_user_id' | 'service_name'>
}

export interface IMeetingRecordingInviteNotif {
  invited_user_id: number
  meeting_recording: {
    meeting_recording_hash: string
    meeting_url: string
    name: string
  }
  variables: INotificationMetaMention<'src_user_id' | 'meeting_recording_name'>
}

export interface INotificationTest {}
