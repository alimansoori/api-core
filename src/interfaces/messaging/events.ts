import { MediasoupPeerActivity } from '@app/mediaserver/mediasoup/mediasoup-types.js'
import { MediaRoomSetting } from '@app/mediaserver/mediasoup/room/interfaces/mediasoup-room.interface.js'
import { MediaSoupAppDataType, MediasoupBranch, PERMISSION } from '@app/shared-models/index.js'
import { TRANSCRIPTION_ENGINE } from '@prisma/client'

// ########## meeting:close ##########
export interface IMsgCloseMeeting {
  meeting_hash: string
  notify?: boolean
}

// ########## meeting:update ##########
export interface IMsgUpdateMeeting {
  meeting_hash: string
  settings: MediaRoomSetting
}

// ########## peer:kick ##########
export interface IMsgKickPeer {
  meeting_hash: string
  peer_id: number | string
}

// ########## peer:update ##########
export interface IMsgUpdatePeer {
  meeting_hash: string
  peer_id: number | string
  name?: string
  role?: PERMISSION
}

// ########## peer:switch ##########
export interface IMsgSwitchPeer {
  meeting_hash: string
  branch: MediasoupBranch
  peer_id: number | string
}

// ########## bor:closed ##########
export interface IMsgBORClosed {
  meeting_hash: string
  branch_hash: string
}

// ########## meeting:free ########
export interface IMsgFreeMeeting {
  meeting_hash: string
  main_sid: number
  prepareForMigration?: boolean
}

// ########## meeting:migrate #########
export interface IMsgMigrateMeeting {
  meeting_hash: string
  sid: number
  url: string
}

/* API BACKEND MESSAGINGS */

// ########## room:closed #########
export interface IMsgRoomClosed {
  meeting_id: number
  participants: MediasoupPeerActivity[]
}
// ########## peer:joined #########
export interface IMsgPeerJoined {
  meeting_id: number
  peer_id: string
  joined_at: number
}
// ########## peer:left #########
export interface IMsgPeerLeft {
  meeting_id: number
  peer_id: string
  left_at: number
  remainedUserPeers: string[]
}
// ########## recording:started #########
export interface IMsgRecordingStarted {
  meeting_id: number
  started_at: number

  recording_hash: string
}
// ########## recording:stopped #########
export interface IMsgRecordingStopped {
  meeting_id: number
  stopped_at: number

  hash: string
}

// ########## transcription:message #########
export interface IMsgTranscriptionMessage {
  meeting_id: number
  user_id: number
  start_at: Date | string
  text: string
  no_speech_prob?: number
  audio_file_name?: string
  engine: TRANSCRIPTION_ENGINE
  branch: MediasoupBranch
}
export interface IRecordingFileUploaded {
  meeting_id: number

  folder_name: string
  file_size: number
  recordingData: {
    startedAt: Date
    hash: string
    branchId: number
  }

  start_time: Date
  end_time: Date

  peerId: string
  type: MediaSoupAppDataType
  record_user_id: number

  fileData: {
    name: string
    hash: string
    path: string
    MIME: string
    minio_path: string
    size: number
  }
}

export interface IRecordingPreviewGifUploaded {
  meeting_hash: string
  file_size: number
  recordData: {
    startedAt: Date
    hash: string
    branchId: number
  }
  name: string
  recordingPreviewPath: string
  fileData: {
    name: string
    hash: string
    path: string
    MIME: string
    minio_path: string
    size: number
  }
}

export interface IRecordingAllFilesUploaded {
  meeting_hash: string
  recordingData: {
    startedAt: Date
    hash: string
    branchId: number
  }
}
