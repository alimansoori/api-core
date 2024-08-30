import {
  IMsgBORClosed,
  IMsgCloseMeeting,
  IMsgFreeMeeting,
  IMsgKickPeer,
  IMsgMigrateMeeting,
  IMsgPeerJoined,
  IMsgPeerLeft,
  IMsgRecordingStarted,
  IMsgRecordingStopped,
  IMsgRoomClosed,
  IMsgSwitchPeer,
  IMsgTranscriptionMessage,
  IMsgUpdateMeeting,
  IMsgUpdatePeer,
  IRecordingAllFilesUploaded,
  IRecordingFileUploaded,
  IRecordingPreviewGifUploaded,
} from './events.js'

interface IDefaultMessagingEvents {
  ping: null
}

export interface IMessagingEvents extends IDefaultMessagingEvents {
  'meeting:close': IMsgCloseMeeting
  'meeting:update': IMsgUpdateMeeting
  'peer:kick': IMsgKickPeer
  'peer:update': IMsgUpdatePeer
  'peer:switch': IMsgSwitchPeer
  'bor:close': IMsgBORClosed
  'meeting:free': IMsgFreeMeeting
  'meeting:migrate': IMsgMigrateMeeting
  'meeting:migrate:handle': IMsgMigrateMeeting
  /* API BACKEND MESSAGES */
  'room:closed': IMsgRoomClosed
  'peer:joined': IMsgPeerJoined
  'peer:left': IMsgPeerLeft
  'recording:started': IMsgRecordingStarted
  'recording:stopped': IMsgRecordingStopped
  'transcription:message': IMsgTranscriptionMessage
  'recording:file-uploaded': IRecordingFileUploaded
  'recording:preview-uploaded': IRecordingPreviewGifUploaded
  'recording:all-files-uploaded': IRecordingAllFilesUploaded
}

export type IMessagingEventTypes = keyof IMessagingEvents
