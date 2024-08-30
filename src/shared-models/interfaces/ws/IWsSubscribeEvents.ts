import {
  MediaSoupAppData,
  MediaSoupDTLSParameters,
  MediaSoupIceCandidate,
  MediaSoupIceParameters,
  MediaSoupMediaType,
  MediaSoupRTPCapabilities,
  MediaSoupRTPParameters,
  MediaSoupSctpParameters,
  MediaSoupKind,
  MediaSoupAppDataType,
  MediasoupBranch,
  MediaserverModeType,
} from './../../mediasoup-shared-types.js'
import { IWSDataModel } from './index.js'
import { IFileResponseModel, PERMISSION } from '../app/index.js'
import {
  IWsBroadcastMsgToMR,
  IWsCancelKnock,
  IWsFinishIntegrationMR,
  IWsLeaveAttendee,
  IWsRaiseHandMR,
  IWsStartIntegrationMR,
  IWsSubscribe,
  IWsUnsubscribe,
  IWsUpdateIntegrationMR,
  ISubHeartbeat,
  IWsJoinMeeting,
  IWsCreateTransport,
  IWsConnectTransport,
  IWsRestartTransport,
  IWsProduce,
  IWsConsume,
  IWsProducerID,
  IWsConsumerID,
  IWsMediaToggleLock,
  IWsMediaPauseAll,
  IWsSwitchMeetingBranch,
  IWsPeerHold,
  IWsCbID,
  IWsCalibrateMedia,
  IWsCalibrateAllMedia,
  IWsPeerKick,
  IWsProducerAskResume,
  IWsBranch,
  IWsConsumerUpdatePriority,
} from './events/subscribe/index.js'

interface IDefaultSubscribeEvents {
  '--heartbeat--': ISubHeartbeat
}
export interface ISubscribeEvents extends IDefaultSubscribeEvents {
  'room:message': IWsBroadcastMsgToMR
  'room:raise-hand': IWsRaiseHandMR
  'room:attendee:leave': IWsLeaveAttendee
  'room:integration:start': IWsStartIntegrationMR<any>
  'room:integration:update': IWsUpdateIntegrationMR<any>
  'room:integration:finish': IWsFinishIntegrationMR
  'knock:cancel': IWsCancelKnock
  subscribe: IWsSubscribe
  unsubscribe: IWsUnsubscribe
  checkUserStatus: any
}

export interface IMediaserverSubscribeEvents extends IDefaultSubscribeEvents {
  join: IWsJoinMeeting
  'peer:hold': IWsPeerHold
  'peer:unHold': IWsCbID
  'peer:kick': IWsPeerKick
  'transport:create': IWsCreateTransport
  'transport:connect': IWsConnectTransport
  'transport:restart': IWsRestartTransport
  'producer:produce': IWsProduce
  'producer:all': IWsCbID
  'producer:pause': IWsProducerID
  'producer:resume': IWsProducerID
  'producer:askResume': IWsProducerAskResume
  'producer:close': IWsProducerID
  'consumer:consume': IWsConsume
  'consumer:resume': IWsConsumerID
  'consumer:updatePriority': IWsConsumerUpdatePriority
  'media:lock': IWsMediaToggleLock
  'media:unlock': IWsMediaToggleLock
  'media:lockAll': IWsMediaPauseAll
  'media:unlockAll': IWsMediaPauseAll
  'media:pauseAll': IWsMediaPauseAll
  'media:closeAll': IWsMediaPauseAll
  'meeting:switchBranch': IWsSwitchMeetingBranch
  'media:calibrate': IWsCalibrateMedia
  'media:calibrateAll': IWsCalibrateAllMedia
  'recording:start': IWsBranch
  'recording:stop': IWsBranch
  'transcription:start': IWsCbID
  'transcription:stop': IWsCbID
  'encryption:start': IWsCbID
  'encryption:stop': IWsCbID
}

export type ISubscribeEventTypes = keyof ISubscribeEvents
export type IMediaserverSubscribeEventTypes = keyof IMediaserverSubscribeEvents

export type IWSSubscribeDataModel<T extends ISubscribeEventTypes> = IWSDataModel<ISubscribeEvents, T>

export interface MediaserverProducerCallbackObject {
  id: string
  peerId: string
  kind: MediaSoupKind
  type: MediaSoupAppDataType
  isPaused: boolean
}

export interface MediaserverPeerObject {
  id: string
  name: string
  avatar: IFileResponseModel
  chatUsername: string | null
  role: PERMISSION
  isHold: boolean
  branch: MediasoupBranch
  locks: MediaSoupAppDataType[]
  producers: MediaserverProducerCallbackObject[]
}

export interface MediaserverTransportDataObject {
  id: string
  iceParameters: MediaSoupIceParameters
  iceCandidates: MediaSoupIceCandidate[]
  dtlsParameters: MediaSoupDTLSParameters
  sctpParameters: MediaSoupSctpParameters | undefined
}

export interface MediaserverMeetingObject {
  id: string
  name: string
  mode: MediaserverModeType
  peers: MediaserverPeerObject[]
  rtpCapabilities: MediaSoupRTPCapabilities
  recordingStartedAt: Date | null
  transcription: boolean
  encrypted: boolean
  encryptionKey: string
  consumerTransportData?: MediaserverTransportDataObject
  branchLocks: MediaSoupAppDataType[]
}
export interface IMediaserverJoinCallback {
  me: MediaserverPeerObject
  meeting: MediaserverMeetingObject
}

export interface IMediaserverSuccessCallback {
  success: boolean
}

export interface IMediaserverProducerSuccessCallback {
  success: boolean
  producerId: string
  type: MediaSoupAppDataType
}

export interface IMediaserverTransportCreateCallback {
  type: MediaSoupMediaType
  transportData: MediaserverTransportDataObject
}

export interface IMediaserverTransportRestartCallback extends IMediaserverSuccessCallback {
  iceParameters: MediaSoupIceParameters
}

export interface IMediaserverProduceCallback extends IMediaserverSuccessCallback {
  producerId: string
  appData: MediaSoupAppData
  isPaused: boolean
}

export interface IMediaserverProduceAllCallback extends IMediaserverSuccessCallback {
  producers: MediaserverProducerCallbackObject[]
}

interface MediaserverConsumerParamsObject {
  producerId: string
  id: string
  kind: MediaSoupKind
  rtpParameters: MediaSoupRTPParameters
  type: any
  producerPaused: boolean
  appData: MediaSoupAppData
}
export interface IMediaserverConsumeCallback extends IMediaserverSuccessCallback {
  params: MediaserverConsumerParamsObject
}

export interface IMediaserverCallbackEvents {
  join: IMediaserverJoinCallback
  'peer:hold': IMediaserverSuccessCallback
  'peer:unHold': IMediaserverSuccessCallback
  'peer:kick': IMediaserverSuccessCallback
  'transport:create': IMediaserverTransportCreateCallback
  'transport:connect': IMediaserverSuccessCallback
  'transport:restart': IMediaserverTransportRestartCallback
  'producer:produce': IMediaserverProduceCallback
  'producer:all': IMediaserverProduceAllCallback
  'producer:pause': IMediaserverProducerSuccessCallback
  'producer:resume': IMediaserverProducerSuccessCallback
  'producer:askResume': IMediaserverSuccessCallback
  'producer:close': IMediaserverProducerSuccessCallback
  'consumer:consume': IMediaserverConsumeCallback
  'consumer:resume': IMediaserverSuccessCallback
  'media:lock': IMediaserverSuccessCallback
  'media:unlock': IMediaserverSuccessCallback
  'media:pauseAll': IMediaserverSuccessCallback
  'media:closeAll': IMediaserverSuccessCallback
  'meeting:switchBranch': IMediaserverSuccessCallback
  'media:calibrate': IMediaserverSuccessCallback
  'media:calibrateAll': IMediaserverSuccessCallback
  'recording:start': IMediaserverSuccessCallback
  'recording:stop': IMediaserverSuccessCallback
}

export type IMediaserverCallbackEventTypes = keyof IMediaserverCallbackEvents

export type ISubscriber = {
  ws_id: string
  role: PERMISSION
  peer_id: string
  user_id: number
}
