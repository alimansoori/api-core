import { DeLogger } from '@app/lib/de-logger.js'
import {
  MediaSoupAppData,
  MediaSoupMediaType,
  MediaSoupRTPCapabilities,
  MediaSoupKindEnum,
} from '@app/shared-models/mediasoup-shared-types.js'
import MediasoupRtcMedia from '@mediaserver/mediasoup/rtc-media/mediasoup-rtc-media.js'
import MediasoupRtcTransport from '@mediaserver/mediasoup/rtc-transport/mediasoup-rtc-transport.js'
import { MediaSoupConsumerInstance } from '../mediasoup-types.js'
import MediasoupPeer from '../peer/mediasoup-peer.js'
import MediasoupProducer from '../producer/mediasoup-producer.js'

export default class MediasoupConsumer extends MediasoupRtcMedia {
  static readonly MAX_SPATIAL_LAYER: number = 3
  static readonly MAX_TEMPORAL_LAYER: number = 1
  private readonly logger: DeLogger = new DeLogger({ namespace: 'Consumer', tags: ['consumer'] })

  constructor(
    _rtcTransportInstance: MediasoupRtcTransport,
    protected _peer: MediasoupPeer,
  ) {
    super(_rtcTransportInstance, MediaSoupMediaType.consume)
  }
  private _isPrior = false

  override get producerId() {
    return this._consumer?.producerId
  }
  get peer() {
    return this._peer
  }

  get isPrior() {
    return this._isPrior
  }

  set isPrior(value) {
    this._isPrior = value

    this.logger.log('Consumer isPrior updated.', { isPrior: value }).save()
  }

  async consume(
    producer: MediasoupProducer,
    rtpCapabilities: MediaSoupRTPCapabilities,
    appData: MediaSoupAppData,
    isPaused = false,
  ): Promise<MediaSoupConsumerInstance> {
    if (!this._rtcTransportInstance) {
      this.logger.error('Cant Create Consumer Cause _rtcTransportInstance no found').save()
      throw new Error('_rtcTransportInstance is undefined')
    }

    try {
      this._consumer = await this._rtcTransportInstance.transport.consume({
        producerId: producer.producerId,
        rtpCapabilities,
        paused: false,
        appData,
      })

      this.logger.meta = {
        consumerId: this.consumerId,
        producerId: this.producerId,
        peerId: this.peer.id,
        meeting_hash: this.peer.room.meeting_hash,
      }

      // remove event emitter limit
      this._consumer.setMaxListeners(0)

      if (this._consumer.kind === MediaSoupKindEnum.video || isPaused) {
        // hint : better to pause video kind consumers at first time
        this._pause()
      }

      this._consumer.on('score', async (score) => {
        if (this.score !== score.score) {
          this._score = score.score
          this.peer.calculateConsumersAverageScore()
        }

        this._prevOverall = this._overall
        this._overall = this.scoreToOverall(score.score)
      })

      this.scalabilityMode = producer.scalabilityMode
      this.codec = producer.codec

      if (this._consumer.kind === MediaSoupKindEnum.video) {
        if (this.peer.getPriorVideoConsumers().length) {
          this.setLowestPriority()
        } else {
          this.setHighestPriority()
        }
      }

      return this._consumer
    } catch (error) {
      this.logger.log('an error occurred while creating consumer', { error }).save()
      throw error
    }
  }

  close() {
    this._close()
  }

  pause() {
    this._pause()
  }

  resume() {
    this._resume()
  }

  async setHighestPriority() {
    if (this.scalabilityMode === 'L1T3') {
      this.setPreferredLayers({ spatialLayer: 0, temporalLayer: 2 })
    } else if (this.scalabilityMode === 'L3T3') {
      this.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 })
    }

    await this._consumer?.setPriority(1)
  }
  async setLowestPriority() {
    if (this.scalabilityMode === 'L1T3') {
      this.setPreferredLayers({ spatialLayer: 0, temporalLayer: 1 })
    } else if (this.scalabilityMode === 'L3T3') {
      this.setPreferredLayers({ spatialLayer: 0, temporalLayer: 1 })
    }

    await this._consumer?.setPriority(2)
  }

  async setPreferredLayers({ spatialLayer, temporalLayer }: { spatialLayer: number; temporalLayer: number }) {
    if (this.closed || this.kind !== MediaSoupKindEnum.video) return

    this.logger.log('Consumer set preferredLayers.', { spatialLayer, temporalLayer }).save()

    await this._consumer?.setPreferredLayers({ spatialLayer, temporalLayer }).catch((error) => {
      this.logger.error('setPreferredLayers() failed.', { error, spatialLayer, temporalLayer }).save()
    })
  }

  private async requestKeyFrame() {
    if (!this._consumer || this.closed || this.kind !== MediaSoupKindEnum.video) return

    try {
      await this._consumer.requestKeyFrame()
    } catch (reason) {
      this.logger.log('failed to call requestKeyFrame()').save()
    }
  }

  static getReduceNextSpatialLayer(temporalLayer: number, spatialLayer: number) {
    if (temporalLayer > 0) {
      return spatialLayer
    }

    return spatialLayer > 0 ? spatialLayer - 1 : 0
  }

  static getReduceNextTemporalLayer(temporalLayer: number) {
    return temporalLayer > 0 ? temporalLayer - 1 : 0
  }

  public async reduceLayers() {
    if (!this._consumer || this.closed || this.kind !== MediaSoupKindEnum.video) return

    const { MAX_SPATIAL_LAYER: maxSpatial, MAX_TEMPORAL_LAYER: maxTemporal } = MediasoupConsumer
    let currentLayers = this._consumer.currentLayers

    if (!currentLayers) {
      currentLayers = { spatialLayer: maxSpatial, temporalLayer: maxTemporal }
    }

    const { spatialLayer = maxSpatial, temporalLayer = maxTemporal } = currentLayers
    const nextTemporalLayer = MediasoupConsumer.getReduceNextTemporalLayer(temporalLayer)
    const nextSpatialLayer = MediasoupConsumer.getReduceNextSpatialLayer(temporalLayer, spatialLayer)

    const status = await this.setPreferredLayers({
      spatialLayer: nextSpatialLayer,
      temporalLayer: nextTemporalLayer,
    })

    this.logger.log('[reduceLayers] Consumer').save()

    return { status }
  }

  static getIncreaseNextSpatialLayer(temporalLayer: number, spatialLayer: number) {
    const { MAX_SPATIAL_LAYER: maxSpatial, MAX_TEMPORAL_LAYER: maxTemporal } = MediasoupConsumer

    if (spatialLayer === 0 && temporalLayer === 0) return 1

    if (temporalLayer < maxTemporal) {
      return spatialLayer
    }

    return spatialLayer < maxSpatial ? spatialLayer + 1 : maxSpatial
  }

  static getIncreaseNextTemporalLayer(temporalLayer: number) {
    const { MAX_TEMPORAL_LAYER: maxTemporal } = MediasoupConsumer
    return temporalLayer < maxTemporal ? temporalLayer + 1 : maxTemporal
  }

  public async increaseLayers() {
    if (!this._consumer || this.closed || this.kind !== MediaSoupKindEnum.video) return

    const { MAX_SPATIAL_LAYER: maxSpatial, MAX_TEMPORAL_LAYER: maxTemporal } = MediasoupConsumer
    let currentLayers = this._consumer.currentLayers

    if (!currentLayers) {
      currentLayers = { spatialLayer: maxSpatial, temporalLayer: maxTemporal }
    }

    const { spatialLayer = maxSpatial, temporalLayer = maxTemporal } = currentLayers
    const nextTemporalLayer = MediasoupConsumer.getIncreaseNextTemporalLayer(temporalLayer)
    const nextSpatialLayer = MediasoupConsumer.getIncreaseNextSpatialLayer(temporalLayer, spatialLayer)

    const status = await this.setPreferredLayers({
      spatialLayer: nextSpatialLayer,
      temporalLayer: nextTemporalLayer,
    })
    await this.requestKeyFrame()

    this.logger.log('[increaseLayers] Consumer').save()

    return { status }
  }

  public async getStats() {
    if (!this._consumer || this._consumer.closed) return
    return await this._consumer.getStats()
  }
}
