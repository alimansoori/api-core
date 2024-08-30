import { IMeetingRoomIntegrationTypes, IRaiseHandTypes } from '../../../index.js'
import {
  MediaCalibrateAction,
  MediaSoupAppData,
  MediaSoupDTLSParameters,
  MediaSoupKindEnum,
  MediaSoupMediaType,
  MediaSoupPauseableType,
  MediaSoupRTPCapabilities,
  MediaSoupRTPParameters,
  MediaSoupShareableType,
  MediasoupBranch,
} from '../../../../mediasoup-shared-types.js'

// ########## heartbeat ##########
export interface ISubHeartbeat {
  message: string
}

// ########## room:message ##########
export interface IWsBroadcastMsgToMR {
  meeting_hash: string
  isEmoji: boolean
  peer_id: string
  msg: string
}

// ########## knock:cancel ##########
export interface IWsCancelKnock {
  meeting_hash: string
}

// ########## room:integration:finish ##########
export interface IWsFinishIntegrationMR {
  meeting_hash: string
  integration_id: string
}

// ########## room:attendee:leave ##########
export interface IWsLeaveAttendee {
  meeting_hash: string
}

// ########## room:raise-hand ##########
export interface IWsRaiseHandMR {
  meeting_hash: string
  is_raised: boolean
  type: IRaiseHandTypes
  peer_id: string
}

// ########## room:integration:start ##########
export interface IStartYoutubeIntegrationMeta {
  url: string
  videoId: string
  paused: boolean
  seek: number
  volume: number
  state: 'playing' | 'paused'
}
export interface IStartMiroIntegrationMeta {
  url: string
}
export interface IStartGoogleDriveIntegrationMeta {
  url: string
  id: string
}
export interface IStartFigmaIntegrationMeta {
  url: string
}

export interface IWsStartIntegrationMR<T extends IMeetingRoomIntegrationTypes> {
  meeting_hash: string
  integration: IMeetingRoomIntegrationTypes
  metadata: T extends 'youtube'
    ? IStartYoutubeIntegrationMeta
    : T extends 'miro'
      ? IStartMiroIntegrationMeta
      : T extends 'googleDrive'
        ? IStartGoogleDriveIntegrationMeta
        : T extends 'figma'
          ? IStartFigmaIntegrationMeta
          : any
}

// ########## room:integration:update ##########
export interface IUpdateYoutubeIntegrationMeta {
  paused: boolean
  seek: number
  volume: number
  state: 'playing' | 'paused'
}
export interface IUpdateMiroIntegrationMeta {
  url: string
}
export interface IUpdateGoogleDriveIntegrationMeta {
  url: string
  id: string
}
export interface IUpdateFigmaIntegrationMeta {
  url: string
}

export interface IWsUpdateIntegrationMR<T extends IMeetingRoomIntegrationTypes> {
  meeting_hash: string
  integration_id: string
  metadata: T extends 'youtube'
    ? IUpdateYoutubeIntegrationMeta
    : T extends 'miro'
      ? IUpdateMiroIntegrationMeta
      : T extends 'googleDrive'
        ? IUpdateGoogleDriveIntegrationMeta
        : T extends 'figma'
          ? IUpdateFigmaIntegrationMeta
          : any
}

// ########## subscribe ##########

export enum EWsSubscriptionChannelName {
  'workspace:detail-page' = 'wdp',
  'meeting:detail-page' = 'mdp',
  'meeting:room' = 'mr',
  'room:detail-page' = 'rdp',
  'project:detail-page' = 'pdp',
  'opportunity:detail-page' = 'odp',
  'service:detail-page' = 'sdp',
  'note:detail-page' = 'ndp',
  'agenda:module' = 'am',
  'document:module' = 'dm',
  'user_profile:detail-page' = 'updp',
  'workspace_profile:detail-page' = 'wpdp',
  'private_file:detail-page' = 'pfdp',
  'folder:detail-page' = 'fodp',
  'availability-template-page' = 'atp',
  'meeting_recording:detail-page' = 'mrdp',
}
export type EWsSubscriptionChannelNameKeys = keyof typeof EWsSubscriptionChannelName
export enum EWsSubscriptionModules {
  'meeting' = 'meeting',
  'room' = 'room',
  'project' = 'project',
  'opportunity' = 'opportunity',
  'service' = 'service',
  'note' = 'note',
  'agenda' = 'agenda',
  'document' = 'document',
  'workspace' = 'workspace',
  'user_profile' = 'user_profile',
  'workspace_profile' = 'workspace_profile',
  'private_file' = 'private_file',
  'folder' = 'folder',
  'availability_template' = 'availability_template',
  'meeting_recording' = 'meeting_recording',
}
export type IWsSubscriptionModules = keyof typeof EWsSubscriptionModules

// in future this type will helps us to explicit types for each topic
export type IWsSubscribeData = {
  id: string | number | string[] | number[]
}

export type IWsSubscribeModel = {
  topic: EWsSubscriptionChannelNameKeys
  meta?: {
    peer_id: string
  }
}

export type IWsSubscribe = IWsSubscribeData & IWsSubscribeModel

// ########## unsubscribe ##########
export type IWsUnsubscribeData = {
  topic: EWsSubscriptionChannelNameKeys
  id: string | number | string[] | number[]
}
export type IWsUnsubscribe = IWsUnsubscribeData

// ######### Mediaserver Events ##########

export interface IWsCbID {
  _id?: string
}
export interface IWsJoinMeeting extends IWsCbID {
  meeting_hash: string
  branch_hash?: string
  isHold?: boolean
}

export interface IWsBranch extends IWsCbID {
  branch: MediasoupBranch
}
export interface IWsPeerHold extends IWsCbID {
  peerId?: string
}
export interface IWsPeerKick extends IWsCbID {
  peerId: string
}

export interface IWsCreateTransport extends IWsCbID {
  type: MediaSoupMediaType
}

export interface IWsConnectTransport extends IWsCbID {
  type: MediaSoupMediaType
  dtlsParameters: MediaSoupDTLSParameters
}

export interface IWsRestartTransport extends IWsCbID {
  type: MediaSoupMediaType
}

export interface IWsProduce extends IWsCbID {
  kind: MediaSoupKindEnum
  rtpParameters: MediaSoupRTPParameters
  appData: MediaSoupAppData
  isPaused?: boolean
}

export interface IWsConsume extends IWsCbID {
  producerId: string
  rtpCapabilities: MediaSoupRTPCapabilities
}

export interface IWsProducerID extends IWsCbID {
  producerId: string
}

export interface IWsConsumerID extends IWsCbID {
  consumerId: string
}

export interface IWsConsumerUpdatePriority extends IWsCbID {
  consumerId: string
  isPrior: boolean
}

export interface IWsProducerAskResume extends IWsCbID {
  peerId: string
  type: MediaSoupPauseableType
}

export interface IWsMediaToggleLock extends IWsCbID {
  peerId: string
  type: MediaSoupShareableType
}

export interface IWsMediaPauseAll extends IWsCbID {
  type: MediaSoupPauseableType
}

export interface IWsSwitchMeetingBranch extends IWsCbID {
  branch_hash: string
  /**
   * If it's targeting other peers, there should be at least Admin permission.
   */
  targetPeerIds: string[]
}

export interface IWsCalibrateMedia extends IWsCbID {
  action: MediaCalibrateAction
  consumerId: string
}

export interface IWsCalibrateAllMedia extends IWsCbID {
  action: MediaCalibrateAction
}
