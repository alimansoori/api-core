import { MediaSoupAppDataType, MediaSoupKindEnum } from '@app/shared-models/index.js'
import { AppData, Consumer, PlainTransport } from 'mediasoup/node/lib/types.js'

export interface MediaRecordParameters {
  user_id: number
  kind: MediaSoupKindEnum
  type: MediaSoupAppDataType
  plainRtpConsumer: Consumer<AppData>
  plainTransport: PlainTransport<AppData>
  remoteRtpPort: number
  remoteRtcpPort?: number
  localRtcpPort?: number
}

export interface FfmpegObserverEvents {
  'segment:creating': string
  'segment:last': {}
  'process-close': {}
}

export type FfmpegObserverEventsKeys = keyof FfmpegObserverEvents
