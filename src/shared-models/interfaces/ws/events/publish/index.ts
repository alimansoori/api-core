import {
  IAgendaStatus,
  IDocumentBlock,
  IErrors,
  IFileResponseModel,
  IMeetingRoomIntegrationTypes,
  INotification,
  IRaiseHandTypes,
  IUpdateAllStatus,
  MediaserverProducerCallbackObject,
  SHARING_ACCESS,
} from '../../../index.js'
import {
  MediaOverall,
  MediaSoupAppDataType,
  MediasoupBranch,
  MediaSoupPauseableType,
  TalkingTimes,
} from '../../../../mediasoup-shared-types.js'
import { IMeetingStatesType, PERMISSION } from '../../../app/index.js'
import {
  ATTENDEE_REQUEST_STATUS,
  breakoutroom_setting,
  MEETING_TYPE,
  MEETING_PERMIT,
  server,
  sharing_label,
  timezone,
  TRANSCRIPTION_ENGINE,
  URL_PRIVACY,
  USER_ROLE,
} from '../../../backend.js'
import { IWsSubscriptionModules } from '../subscribe/index.js'
import { BreakoutRoomItem, ITransferBORMode } from '@app/api/v1/breakoutRoom/shared/types/breakoutroom.types.js'
import { ISetBlockingEventReq } from '@app/api/v1/workspace/shared/types/workspace.types.js'
import { IDifference } from '@app/api/v1/document/shared/types/document.types.js'

// ########## error ##########
export interface IOnError {
  key?: keyof typeof IErrors
  msg: string
}

// ########## heartbeat ##########
export interface IPubHeartbeat {
  message?: string
  branchProducersHash?: string
  talkingTimes?: TalkingTimes
}

// ########## room:integration:finished ##########
export interface IOnMRIntegrationFinished {
  finished_by: number
  integration_id: string
  peer_id?: string
  // integration_type: IMeetingRoomIntegrationTypes;
}

// ########## room:integration:started ##########
export interface IOnMRIntegrationStartedYoutube {
  videoId: string
  paused: boolean
  seek: number
  volume: number
  name: string
}
export interface IOnMRIntegrationStartedMiro {
  url: string
  name: string
}
export interface IOnMRIntegrationStartedGoogleDrive {
  url: string
  name: string
  id: string
}

export interface IOnMRIntegrationStartedFigma {
  url: string
}

export type IOnMRIntegrationStarted<T extends IMeetingRoomIntegrationTypes> = {
  integration_id: string
  started_by: number
  started_at: string
  integration: IMeetingRoomIntegrationTypes
  peer_id?: string
  metadata: T extends 'youtube'
    ? IOnMRIntegrationStartedYoutube
    : T extends 'miro'
      ? IOnMRIntegrationStartedMiro
      : T extends 'googleDrive'
        ? IOnMRIntegrationStartedGoogleDrive
        : T extends 'figma'
          ? IOnMRIntegrationStartedFigma
          : any
}

// ########## room:integration:updated ##########
interface IOnMRIntegrationUpdatedYoutube {
  url: string
  videoId: string
  paused: boolean
  seek: number
  volume: number
  state: 'playing' | 'paused'
}
interface IOnMRIntegrationUpdatedMiro {}
interface IOnMRIntegrationUpdatedGoogleDrive {}
interface IOnMRIntegrationUpdatedFigma {}

export type IOnMRIntegrationUpdated<T extends IMeetingRoomIntegrationTypes> = {
  integration_id: string
  started_by: number
  started_at: string
  updated_by: number
  updated_at: string
  integration: IMeetingRoomIntegrationTypes
  peer_id?: string
  metadata: T extends 'youtube'
    ? IOnMRIntegrationUpdatedYoutube
    : T extends 'miro'
      ? IOnMRIntegrationUpdatedMiro
      : T extends 'googleDrive'
        ? IOnMRIntegrationUpdatedGoogleDrive
        : T extends 'figma'
          ? IOnMRIntegrationUpdatedFigma
          : any
}

// ########## breakoutroom:attendee:moved ##########
export interface IBORUniModel {
  issuer_user_id: number
  meeting_hash: string
  url: string
  breakoutroom_setting: breakoutroom_setting
}
export interface IOnReceiveAttendeeMovedToBOR extends IBORUniModel {
  mode: ITransferBORMode
  main_room_url: string
  main_room_type: MEETING_TYPE

  target_url: string
  target_type: MEETING_TYPE
  target_meeting_name: string
}

// ########## breakoutroom:attendee:removed ##########
export interface IOnReceiveAttendeeRemovedFromBOR extends IBORUniModel {
  main_room_hash: string
  main_room_url: string
}

// ########## breakoutroom:closed ##########
export interface IOnReceiveBORClosed extends IBORUniModel {
  main_room_hash: string
  main_room_url: string
  redirect: boolean
}

// ########## breakoutroom:invite ##########
export interface IBOROpen {
  issuer_user_id: number
  meeting_hash: string
  url: string
  BORName: string
}
export type IOnReceiveBORInvite = IBOROpen

// ########## breakoutroom:opened ##########
export type IOnReceiveBOROpened = IBOROpen

// ########## breakoutroom:removed ##########
export interface IOnReceiveBORRemoved {
  issuer_user_id: number
  meeting_hash: string
  url: string
}

// ########## breakoutroom:setting:updated ##########
export type IOnReceiveBORSettingUpdated = IBORUniModel

// ########## breakoutroom:users-count:updated ##########
export interface IOnReceiveBORUsersCountUpdated {
  meetings: {
    meeting_hash: string
    url: string
    total_attendees: number
    online_attendees: number[]
  }[]
}

// ########## instant-meeting ##########
export interface IOnReceiveBroadcastInstantMeeting {
  meeting_hash: string
  user: {
    user_id: number
    first_name: string
    last_name: string
    avatar?: IFileResponseModel
  }
}

// ########## room:message ##########
export interface IOnReceiveBroadcastMsgMR {
  isEmoji: boolean
  peer_id: string
  meeting_hash: string
  msg: string
  user_id: number
}

// ########## room:update:server ##########
export interface IWsUpdateRoomServer {
  meeting_hash: string
  user_id: number
  server: server
}

// ########## breakoutroom:created ##########
export type IOnReceiveNewBORCreated = BreakoutRoomItem

// ########## notification ##########
export type IOnReceiveNotification = INotification

// ########## push notification ##########
export type IOnReceivePushNotification = {
  title: string
  body: string
  dst_user_id: number
  notification_id: number
  project_domain: string
  redirect_url: string
  avatar_url?: string
}

// ########## room:raise-hand ##########
export interface IOnReceiveRaiseHandMR {
  meeting_hash: string
  current_user_id: number
  attendees_raised: {
    user_id: number
    raise_hand?: {
      order: number
      type: IRaiseHandTypes
    }
    peer_id: string
  }[]
}

// ########## knock:request:reply ##########
export interface IOnReceiveRespondKnockReq {
  request_status: ATTENDEE_REQUEST_STATUS
  meeting_hash: string
  meeting_user_id: number
  replied_by: {
    user_id: number
    username: string
    chat_id: string | null
  }
}

// ########## knock:request ##########
export interface IOnAttendeeKnockReq {
  meeting_hash: string
  url: string
  meeting_user_id: number
  knocked_by: {
    user_id: number
    username: string
    chat_id: string | null
  }
}

// ########## knock:canceled ##########
export interface IOnReceiveKnockCanceled {
  meeting_hash: string
  url?: string
  meeting_user_id: number
  canceled_by?: {
    user_id: number
    username: string
    chat_id: string | null
  }
}

export interface ISendUnibotMsg {
  msg: string
  room_id: string
}

// ########## meeting:close-notify ##########
export interface IMeetingCloseNotify {
  meeting_hash: string
  /**
   * `null` means closing is cancelled.
   */
  closeInSeconds: number | null
}

// ########## meeting:status:changed ##########
export interface IMeetingStatusChanged {
  meeting_hash: string
  status?: IMeetingStatesType
  is_knocked?: boolean
}

// ########## module:user-joined/added ##########
export interface ISocketAttendeeBase {
  user_id: number
  first_name: string
  last_name: string
  timezone: timezone | null
  avatar: IFileResponseModel | null
  role: USER_ROLE
  calc_permission: PERMISSION
}
export interface IUserJoinedOrAddedToModule extends ISocketAttendeeBase {
  record_id: number | string
  module: IWsSubscriptionModules
}

// ########## module:attendee-group:new/removed ##########
export interface IGroupAttendeeAddedOrRemovedToModule {
  module: IWsSubscriptionModules
  record_id: string | number
  group_id: number
}

// ########## meeting:attendee:removed ##########
export interface IUserLeftOrRemovedFromModule {
  record_id: number | string
  module: IWsSubscriptionModules
  user_id: number
  dont_remove_from_module_users?: boolean
}

// ########## room:opened ##########
export interface IRoomOpened {
  meeting_hash: string
}

// ########## room:reset ##########
export interface IRoomReset {
  url: string
}

// ########## module:sharing-setting:updated ##########
export interface IModuleSharingSettingUpdated {
  record_id: number | string
  module: IWsSubscriptionModules
  updated_by_user_id: number
  url_privacy?: keyof typeof URL_PRIVACY
}

// ########## module:status:changed ##########
export interface IModuleStatusChanged {
  record_id: number | string
  module: IWsSubscriptionModules
  status: 'enabled' | 'disabled'
}

// ########## module:chat-status ##########
export interface IModuleChatStatusUpdated {
  record_id: number | string
  module: IWsSubscriptionModules
  chat_name?: string
  chat_id?: string
  is_chat_enable: boolean
}

// ########## module:change-role ##########
export interface IModuleAttendeeRoleChange {
  record_id: number | string
  module: IWsSubscriptionModules
  user_id?: number
  usergroup_id?: number
  permission: PERMISSION
  my_permissions: (keyof typeof SHARING_ACCESS)[]
}

// ########## module:change-role ##########
export interface IModuleAttendeeLabelChange {
  record_id: number | string
  module: IWsSubscriptionModules
  user_id?: number
  usergroup_id?: number
  sharing_label: sharing_label | null
}

// ########## module:content-updated ##########
export interface IModuleContentUpdate {
  record_id: number | string
}

// ########## module:ai-updated ##########
export interface IModuleAIUpdate {
  module: IWsSubscriptionModules
  record_id: number | string
  ai_prompt_hash: string
  question: string
  ai_response: string
}

// ########## integrate:calendar ##########
export interface IIntegratedCalendars {
  calendars: {
    type: ISetBlockingEventReq['type']
    email: string
  }[]
}

// ########## room:moved-users-notice ##########
export interface IRoomAttendeeMovedNotice {
  meeting: {
    meeting_hash: string
    url: string
    name: string
  }
  users_count: number
  user?: {
    user_id: number
    avatar: IFileResponseModel
  }
}
// ########## breakoutroom:action ##########
export interface IBreakOutRoomAction {
  name: string
  meeting_hash: string
  url: string
  main_room_url?: string
  data?: BreakoutRoomItem
  action: 'updated' | 'created' | 'deleted'
}
// ########## meeting:vote ##########
export interface IMeetingVote {
  meeting_hash: string
}

// ########## meeting:removed ##########
export interface IMeetingRemoved {
  meeting_hash: string
}

// ########## meeting:recording-status:updated ##########
export interface IMeetingRecordingStatusUpdated {
  meeting_hash: string
  recording_in_progress_from: Date | null
  is_completed?: boolean
}

// ########## meeting:user-status:updated ##########
export interface IMeetingUserStatusUpdated {
  meeting_hash: string
  meeting_user_id: number
  user_id: number
  user_status: 'seen' | 'accepted'
}

// ########## booking:confirmed ##########
export interface IBookingIsConfirmed {
  meeting_hash: string
}

// ########## document:block-changes ##########
export interface IDocumentBlockChanges {
  document_hash: string
  module: IWsSubscriptionModules
  blocks: IDocumentBlock[]
  time: number
  force_change: boolean
  user?: {
    user_hash: string
    first_name: string
    last_name: string
    nickname?: string | null
    avatar: IFileResponseModel | null
  }
  position?: {
    x?: number
    y?: number
    width?: number
    height?: number
    hash: string
  }
}

// ########## document:block-differences ##########
export interface IDocumentBlockDifferences {
  document_hash: string
  module: IWsSubscriptionModules
  differences: IDifference[]
  time: number
  user?: {
    user_hash: string
    first_name: string
    last_name: string
    avatar: IFileResponseModel | null
  }
  position?: {
    x?: number
    y?: number
    width?: number
    height?: number
    hash: string
  }
}

// ########## document:delete ##########
export interface IDocumentDelete {
  document_hash: string
  module: IWsSubscriptionModules
  user_hash: string
}

// ########## document:update-name ##########
export interface IDocumentUpdateName {
  document_hash: string
  note_hash: string
  user_hash: string
  module: IWsSubscriptionModules
  name: string
}

// ########## document:block-reorder ##########
export interface IDocumentBlockReorder {
  document_hash: string
  origin_block_hash: string
  dest_block_hash: string
}

// ########## agenda:single:update ##########
export interface IUpdateSingleAgenda {
  document_hash: string
  meeting_hash: string
  agenda_hash: string
  updated_by: number
  type: 'create' | 'update' | 'delete'
  has_description?: boolean
  user_hashes?: string[]
  elapsed_time?: number
  timebox?: number
  name?: string
  order?: number
  is_public: boolean
  is_completed?: boolean
  is_open_time?: boolean
  agenda_status?: IAgendaStatus
  start_time?: string
}

// ########## agenda:all:update ##########
export interface IUpdateAllAgendas {
  meeting_hash: string
  update_status: IUpdateAllStatus
}

// ########## opportunity:express-interest ##########
export interface IOpportunityExpressInterest {
  opportunity_hash: string
  user_id: number
  state: 'express' | 'cancel-express'
}

// ########## opportunity:update-assignment ##########
export interface IOpportunityUpdateAssignment {
  opportunity_hash: string
  user_id: number
  state: 'assign' | 'unassign'
}

// ########## opportunity:updated ##########
export interface IOpportunityUpdated {
  opportunity_hash: string
}

// ########## availability-template:updated ##########
export interface IAvailabilityTemplateUpdated {
  availability_template_id: number
}

// ########## meeting:permissions-updated ##########
export interface IMeetingPermissionsChanged {
  meeting_hash: string
  presentation: MEETING_PERMIT
  chat: MEETING_PERMIT
  is_chat_enable: boolean
  recording: MEETING_PERMIT
  raise_hand: MEETING_PERMIT
  view_transcription_permit: MEETING_PERMIT
  add_agenda_permit: MEETING_PERMIT
  max_attendee?: number | null
  max_session_length?: number | null
}

/* MEDIA SERVER EMIT TYPES */

// ########## peer:new ##########
export interface IMediaPeer {
  id: string
  name: string
  avatar: IFileResponseModel
  chatUsername: string | null
  role: PERMISSION
  branch: MediasoupBranch
  peerProducers?: MediaserverProducerCallbackObject[]
  isHold: boolean
  locks: {
    [k: string]: boolean
  }
  trackingTime: number
}
// ########## peer:dis | peer:kick ##########
export interface IDisPeer {
  peerId: string
}
// ########## peer:switch ##########
export interface ISwitchPeer {
  id: string
  branch: MediasoupBranch
  firedByPeerId: string | null
  branchProducers: MediaserverProducerCallbackObject[]
  recordingStartedAt: Date | null
  currentState: {
    cam: boolean
    mic: boolean
    screen: boolean
  }
}

// ########## producer:new ##########
export interface INewProducer {
  producerId: string
  peerId: string
  type: MediaSoupAppDataType
  isPaused: boolean
}
// ########## producer:close ##########
export interface IProducerID {
  producerId: string
}

export interface IProducerPaused {
  peerId: string
  producerId: string
  type: MediaSoupAppDataType
  firedByPeerId?: string
}

export interface IProducerClosed {
  peerId: string
  producerId: string
  type: MediaSoupAppDataType
  firedByPeerId?: string
  restartWithCodec?: 'vp8' | 'vp9'
}

// ########## producer:confirmResume #######
export interface IConfirmProducerResume {
  peerId: string
  type: MediaSoupPauseableType
}

// ########## hold:toggle ##########
export interface IHoldToggle {
  peerId: string
  isHold: boolean
}

export interface IBranchClosed {
  branch: MediasoupBranch
}

export type ProducerScore = {
  ssrc: number
  rid?: string
  score: number
}
export type ProducerStat = {
  type: string
  timestamp: number
  ssrc: number
  rtxSsrc?: number
  rid?: string
  kind: string
  mimeType: string
  packetsLost: number
  fractionLost: number
  packetsDiscarded: number
  packetsRetransmitted: number
  packetsRepaired: number
  nackCount: number
  nackPacketCount: number
  pliCount: number
  firCount: number
  score: number
  packetCount: number
  byteCount: number
  bitrate: number
  roundTripTime?: number
  rtxPacketsDiscarded?: number
  jitter: number
  bitrateByLayer?: any
}
export interface IScoreProducer {
  producerId: string
  overall: MediaOverall
  data: ProducerScore[]
  stats: ProducerStat[]
}
export interface IPeerScore {
  peerId: string
  avgScore: number
  producersAvgScore: number
  consumersAvgScore: number
}

export interface INotifyRecordingPreview {
  branch: MediasoupBranch
  recording_hash: string
}

export type ConsumerStat = {
  type: string
  timestamp: number
  ssrc: number
  rtxSsrc?: number
  kind: string
  mimeType: string
  packetsLost: number
  fractionLost: number
  packetsDiscarded: number
  packetsRetransmitted: number
  packetsRepaired: number
  nackCount: number
  nackPacketCount: number
  pliCount: number
  firCount: number
  score: number
  packetCount: number
  byteCount: number
  bitrate: number
  roundTripTime?: number
}

export interface ILockAllUnlockAll {
  type: MediaSoupAppDataType
  firedByPeerId: string
}
export interface IPeerLockUnlock {
  peerId: string
  type: MediaSoupAppDataType
  firedByPeerId: string
}
export interface IScoreConsumer {
  consumerId: string
  score: number
  overall: MediaOverall
  producerScore: number
  producerScores: number[]
  stats: (ProducerStat | ConsumerStat)[]
}

export interface IMeetingMigrate {
  main_sid: number
  target_sid: number
  target_url: string
}

export interface IMediaserverModuleStatusUpdate {
  status: boolean
}

export interface IMediaserverRecordingStatusUpdate {
  status: boolean
  branch: MediasoupBranch
}

export interface ITranscriptionMessage {
  user_id: number
  start_at: Date | string
  absolute_start_at: Date | string
  text: string
  audio_file_name?: string
  engine: TRANSCRIPTION_ENGINE
  branch: MediasoupBranch
}
