import { MediaSoupAppData } from '@app/shared-models'
import { types } from 'mediasoup'

export type MediaSoupAudioLevelObserverOptions = types.AudioLevelObserverOptions
export type MediaSoupAudioLevelObserverVolume = types.AudioLevelObserverVolume
export type MediaSoupAudioLevelObserverInstance = types.AudioLevelObserver

export type MediaSoupWorkerInstance = types.Worker
export type MediaSoupWorkerSettings = types.WorkerSettings
export type MediaSoupWorkerResourceUsages = types.WorkerResourceUsage
export type MediaSoupWorkerLogLevel = types.WorkerLogLevel
export type MediaSoupWorkerLogTag = types.WorkerLogTag

export type MediaSoupRouterInstance = types.Router
export type MediaSoupRouterOptions = types.RouterOptions

export type MediaSoupWebRTCTransportInstance = types.WebRtcTransport
export type MediaSoupWebRTCTransportOptions = types.WebRtcTransportOptions
export type MediaSoupListenIp = types.TransportListenIp | string

export type MediaSoupDTLSState = types.DtlsState

export type MediaSoupConsumerScore = types.ConsumerScore

export type MediaSoupProducerScore = types.ProducerScore

export type MediaSoupPlainTransport = types.PlainTransport
export type MediaSoupPlainTransportOptions = types.PlainTransportOptions

export type MediaSoupConsumerInstance = types.Consumer

export type MediaSoupProducerInstance = types.Producer<MediaSoupAppData>

export interface MediasoupPeerActivity {
  peerId: string
  voiceActivityHistory: {
    activityCount: number
    activityTime: number
  }
}
