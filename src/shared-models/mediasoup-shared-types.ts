import { types } from 'mediasoup-client'

export type LogLevel = 'marketing' | 'log' | 'error'
export type LogSource = 'mediaserver' | 'backend' | 'web' | 'mobile' | 'desktop'
export type Log = {
  message: string
  meta: Record<string, any>
  level: LogLevel
  source: LogSource
}
export type MediaServerLog = Log & {
  namespace: string
  tags: string[]
  time: number
}

export enum MediaSoupPauseableType {
  'cam' = 'cam',
  'mic' = 'mic',
}

export enum MediaSoupShareableType {
  'cam' = 'cam',
  'mic' = 'mic',
  'screen' = 'screen',
}

export type MediaSoupAppDataType = MediaSoupShareableType | MediaSoupPauseableType

export enum MediaSoupMediaType {
  'produce' = 'produce',
  'consume' = 'consume',
}
export type MediaSoupKind = types.MediaKind
export enum MediaSoupKindEnum {
  'video' = 'video',
  'audio' = 'audio',
}

export enum MediaCalibrateAction {
  'inc' = 'inc',
  'dec' = 'dec',
  'no_cam' = 'no_cam',
}

export enum MediaOverall {
  'poor' = 'poor',
  'good' = 'good',
  'excellent' = 'excellent',
}

export enum MediaserverModeType {
  'normal' = 'normal',
  'webinar' = 'webinar',
  'audio' = 'audio',
}

export interface MediasoupBranch {
  id: number
  hash: string
}
export const DefaultMediasoupBranch: MediasoupBranch = {
  id: 0,
  hash: 'main',
}

export type MediaSoupRouterCodecs = types.RtpCodecCapability[]

export type MediaSoupRTPCodecCapability = types.RtpCodecCapability
export type MediaSoupRTPCapabilities = types.RtpCapabilities
export type MediaSoupRTPParameters = types.RtpParameters
export type MediaSoupDTLSParameters = types.DtlsParameters
export type MediaSoupTransport = types.Transport

export type MediaSoupIceParameters = types.IceParameters
export type MediaSoupIceCandidate = types.IceCandidate
export type MediaSoupSctpParameters = types.SctpParameters

export type MediaSoupAppData = {
  type: MediaSoupAppDataType
  peerId: string
  roomId?: string
  branch: MediasoupBranch
  encryptionKey?: string
  transport?: MediaSoupTransport
  dimensions?: { height: number; width: number }
}

export type BranchProducer = {
  producerId: string
  peerId: string
  isPaused: boolean
}

export type TalkingTimes = {
  /**
   * Percentage of talking time from start of the meeting to the moment
   */
  [peerId: string]: number
}
