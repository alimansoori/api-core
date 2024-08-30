import { DeLogger } from '@app/lib/de-logger.js'
import {
  MediaOverall,
  MediaSoupAppData,
  MediaSoupAppDataType,
  MediaSoupMediaType,
} from '@app/shared-models/mediasoup-shared-types.js'
import { MediaSoupConsumerInstance, MediaSoupProducerInstance } from '@mediaserver/mediasoup/mediasoup-types.js'
import MediasoupRtcTransport from '@mediaserver/mediasoup/rtc-transport/mediasoup-rtc-transport.js'

export default abstract class MediasoupRtcMedia {
  protected _consumer?: MediaSoupConsumerInstance
  protected _producer?: MediaSoupProducerInstance
  private readonly superLogger: DeLogger = new DeLogger({ namespace: 'RtcMedia', tags: ['mediasoup', 'media'] })

  scalabilityMode: 'L1T3' | 'L3T3' | null = null
  codec: 'opus' | 'vp8' | 'vp9' | null = null

  protected _prevOverall: MediaOverall = MediaOverall.good
  protected _overall: MediaOverall = MediaOverall.good
  protected _score = 10

  constructor(
    protected _rtcTransportInstance: MediasoupRtcTransport,
    private _type: MediaSoupMediaType,
  ) {}

  private get media() {
    return this._type === MediaSoupMediaType.produce ? this._producer : this._consumer
  }
  get rtcTransportInstance() {
    return this._rtcTransportInstance
  }
  get producer() {
    return this._producer
  }
  get consumer() {
    return this._consumer
  }
  get producerId() {
    return this._producer?.id
  }
  get consumerId() {
    return this._consumer?.id
  }
  get closed() {
    return this?.media?.closed
  }
  get paused() {
    return this.media?.paused
  }
  get kind() {
    return this.media?.kind
  }
  get type() {
    return this.media?.type
  }
  get appData() {
    return this.media?.appData as MediaSoupAppData
  }
  get appDataType() {
    return (this.media?.appData?.type as MediaSoupAppDataType) || ''
  }
  get peerId() {
    return this.appData?.peerId ?? ''
  }
  get roomId() {
    return this.appData?.roomId ?? ''
  }
  get prevOverall() {
    return this._prevOverall
  }
  get overall() {
    return this._overall
  }
  get score() {
    return this._score
  }

  /* Method Blueprints */
  protected get _exists() {
    if (!this.media) {
      this.superLogger
        .log(`Cant Execute Action Cause ${this._type === MediaSoupMediaType.produce ? 'producer' : 'consumer'} no found`)
        .save()
      return false
    }

    return true
  }

  protected _close() {
    this.superLogger
      .log(`[close] method called for ${this._type === MediaSoupMediaType.produce ? 'producer' : 'consumer'}`)
      .save()
    if (!this._exists) return
    this.media?.close()
  }
  protected _pause() {
    this.superLogger
      .log(`[pause] method called for ${this._type === MediaSoupMediaType.produce ? 'producer' : 'consumer'}`)
      .save()
    if (!this._exists) return
    this.media?.pause()
  }
  protected _resume() {
    this.superLogger
      .log(`[resume] method called for ${this._type === MediaSoupMediaType.produce ? 'producer' : 'consumer'}`)
      .save()
    if (!this._exists) return
    this.media?.resume()
  }

  protected scoreToOverall(score: number) {
    if (score < 4) return MediaOverall.poor
    if (score > 8) return MediaOverall.excellent
    return MediaOverall.good
  }
}
