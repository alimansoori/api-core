import { IWSDataModel, IWsJoinMeeting } from './index.js'
import {
  IOnError,
  IPubHeartbeat,
  IOnMRIntegrationFinished,
  IOnMRIntegrationStarted,
  IOnMRIntegrationUpdated,
  IOnReceiveBORClosed,
  IOnReceiveBORInvite,
  IOnReceiveBOROpened,
  IOnReceiveBroadcastMsgMR,
  IOnReceiveKnockCanceled,
  IOnReceiveNewBORCreated,
  IOnReceiveNotification,
  IOnReceiveRaiseHandMR,
  IOnReceiveBORUsersCountUpdated,
  IOnReceiveRespondKnockReq,
  IOnReceiveAttendeeMovedToBOR,
  IOnReceiveAttendeeRemovedFromBOR,
  ISendUnibotMsg,
  IOnReceiveBORRemoved,
  IOnReceiveBORSettingUpdated,
  IOnReceiveBroadcastInstantMeeting,
  IMeetingStatusChanged,
  IModuleAttendeeRoleChange,
  IUserJoinedOrAddedToModule,
  IUserLeftOrRemovedFromModule,
  IWsUpdateRoomServer,
  IRoomAttendeeMovedNotice,
  IModuleSharingSettingUpdated,
  IModuleStatusChanged,
  IModuleChatStatusUpdated,
  IBreakOutRoomAction,
  IMeetingVote,
  IGroupAttendeeAddedOrRemovedToModule,
  IDocumentBlockDifferences,
  IDocumentDelete,
  IDocumentUpdateName,
  IMeetingRecordingStatusUpdated,
  IOnAttendeeKnockReq,
  IUpdateSingleAgenda,
  IUpdateAllAgendas,
  IMeetingCloseNotify,
  IBookingIsConfirmed,
  IModuleContentUpdate,
  IMeetingPermissionsChanged,
  IRoomReset,
  IMeetingUserStatusUpdated,
  INewProducer,
  IMeetingRemoved,
  IProducerID,
  IDisPeer,
  IMediaPeer,
  IHoldToggle,
  ISwitchPeer,
  IBranchClosed,
  IScoreConsumer,
  IScoreProducer,
  IModuleAttendeeLabelChange,
  IDocumentBlockReorder,
  IMeetingMigrate,
  IMediaserverModuleStatusUpdate,
  ITranscriptionMessage,
  IConfirmProducerResume,
  IProducerClosed,
  IOpportunityExpressInterest,
  IOpportunityUpdateAssignment,
  IOpportunityUpdated,
  IPeerLockUnlock,
  IDocumentBlockChanges,
  IProducerPaused,
  IAvailabilityTemplateUpdated,
  ILockAllUnlockAll,
  IMediaserverRecordingStatusUpdate,
  INotifyRecordingPreview,
  IModuleAIUpdate,
  IIntegratedCalendars,
  IPeerScore,
} from './events/publish/index.js'

export interface IEmitEvents {
  error: IOnError
  '--heartbeat--': IPubHeartbeat
  join: IWsJoinMeeting
  notification: IOnReceiveNotification
  'instant-meeting': IOnReceiveBroadcastInstantMeeting
  'knock:request': IOnAttendeeKnockReq
  'knock:request:reply': IOnReceiveRespondKnockReq
  'room:message': IOnReceiveBroadcastMsgMR
  'room:update:server': IWsUpdateRoomServer
  'room:raise-hand': IOnReceiveRaiseHandMR
  'room:integration:started': IOnMRIntegrationStarted<any>
  'room:integration:updated': IOnMRIntegrationUpdated<any>
  'room:integration:finished': IOnMRIntegrationFinished
  'knock:canceled': IOnReceiveKnockCanceled
  'breakoutroom:created': IOnReceiveNewBORCreated
  'breakoutroom:invite': IOnReceiveBORInvite
  'breakoutroom:opened': IOnReceiveBOROpened
  'breakoutroom:closed': IOnReceiveBORClosed
  'breakoutroom:removed': IOnReceiveBORRemoved
  'breakoutroom:setting:updated': IOnReceiveBORSettingUpdated
  'breakoutroom:users-count:updated': IOnReceiveBORUsersCountUpdated
  'breakoutroom:attendee:moved': IOnReceiveAttendeeMovedToBOR
  'breakoutroom:attendee:removed': IOnReceiveAttendeeRemovedFromBOR
  'breakoutroom:action': IBreakOutRoomAction
  'meeting:close-notify': IMeetingCloseNotify
  'meeting:status:changed': IMeetingStatusChanged
  'meeting:permissions-updated': IMeetingPermissionsChanged
  'module:attendee:new': IUserJoinedOrAddedToModule
  'meeting:attendee:joined': IUserJoinedOrAddedToModule
  'module:attendee:removed': IUserLeftOrRemovedFromModule
  'meeting:attendee:left': IUserLeftOrRemovedFromModule
  'module:sharing-setting:updated': IModuleSharingSettingUpdated
  'module:activity:status': IModuleStatusChanged
  'module:attendee:updated-role': IModuleAttendeeRoleChange
  'module:attendee:updated-label': IModuleAttendeeLabelChange
  'module:chat-status:updated': IModuleChatStatusUpdated
  'module:content-updated': IModuleContentUpdate
  'module:ai-updated': IModuleAIUpdate
  'integrate:calendar': IIntegratedCalendars
  'room:moved-users-notice': IRoomAttendeeMovedNotice
  'room:reset': IRoomReset
  'meeting:vote': IMeetingVote
  'meeting:removed': IMeetingRemoved
  'booking:confirmed': IBookingIsConfirmed
  'meeting:recording-status:updated': IMeetingRecordingStatusUpdated
  'meeting:user-status:updated': IMeetingUserStatusUpdated
  'module:attendee-group:new': IGroupAttendeeAddedOrRemovedToModule
  'module:attendee-group:removed': IGroupAttendeeAddedOrRemovedToModule
  'document:block-differences': IDocumentBlockDifferences
  'document:block-changes': IDocumentBlockChanges
  'document:delete': IDocumentDelete
  'document:update-name': IDocumentUpdateName
  'document:block-reorder': IDocumentBlockReorder
  'agenda:single:update': IUpdateSingleAgenda
  'agenda:all:update': IUpdateAllAgendas
  'opportunity:express-interest': IOpportunityExpressInterest
  'opportunity:update-assignment': IOpportunityUpdateAssignment
  'opportunity:updated': IOpportunityUpdated
  'availability-template:updated': IAvailabilityTemplateUpdated

  sendUnibotMsg: ISendUnibotMsg
  'peer:new': IMediaPeer
  'transport:init': null
  'transcription:message': ITranscriptionMessage
  /* MEDIA SERVER EMIT TYPES */
  'peer:dis': IDisPeer
  'peer:kick': IDisPeer
  'peer:update': IMediaPeer
  'peer:switch': ISwitchPeer
  'peer:score': IPeerScore
  'producer:new': INewProducer
  'producer:close': IProducerClosed
  'producer:pause': IProducerPaused
  'producer:resume': IProducerID
  'producer:confirmResume': IConfirmProducerResume
  'hold:toggle': IHoldToggle
  'meeting:closed': null
  'branch:closed': IBranchClosed
  'media:lockAll': ILockAllUnlockAll
  'media:unlockAll': ILockAllUnlockAll
  'peer:lock': IPeerLockUnlock
  'peer:unlock': IPeerLockUnlock
  'score:consumer': IScoreConsumer
  'score:producer': IScoreProducer
  'recording:notify-preview': INotifyRecordingPreview
  'meeting:migrate': IMeetingMigrate
  'recording:update': IMediaserverRecordingStatusUpdate
  'transcription:update': IMediaserverModuleStatusUpdate
  'encryption:update': IMediaserverModuleStatusUpdate
}

export type IEmitEventTypes = keyof IEmitEvents

export type IWSEmitDataModel<T extends IEmitEventTypes> = IWSDataModel<IEmitEvents, T>
