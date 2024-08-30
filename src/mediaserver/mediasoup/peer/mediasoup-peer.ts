import { IMediaWebsocketSchema } from '@app/interfaces/index.js'
import { DeLogger } from '@app/lib/de-logger.js'
import NotificationManager from '@app/mediaserver/notification/notification-manager.js'
import {
  IFileResponseModel,
  MediaserverPeerObject,
  MediaserverProducerCallbackObject,
  MediaserverTransportDataObject,
  PERMISSION,
} from '@app/shared-models/index.js'
import {
  DefaultMediasoupBranch,
  MediaCalibrateAction,
  MediaOverall,
  MediaserverModeType,
  MediaSoupAppData,
  MediaSoupAppDataType,
  MediasoupBranch,
  MediaSoupDTLSParameters,
  MediaSoupIceCandidate,
  MediaSoupKindEnum,
  MediaSoupMediaType,
  MediaSoupRTPCapabilities,
  MediaSoupRTPParameters,
  MediaSoupShareableType,
} from '@app/shared-models/mediasoup-shared-types.js'
import { WsMediaHandler } from '@app/ws/helpers/wsMediaHandler.js'
import MediasoupRtcTransport from '@mediaserver/mediasoup/rtc-transport/mediasoup-rtc-transport.js'
import { ConsumerScore, ConsumerStat } from 'mediasoup/node/lib/Consumer.js'
import { ProducerScore, ProducerStat } from 'mediasoup/node/lib/Producer.js'
import { container } from 'tsyringe'
import MediasoupConsumer from '../consumer/mediasoup-consumer.js'
import { MediasoupPeerActivity } from '../mediasoup-types.js'
import MediasoupProducer from '../producer/mediasoup-producer.js'
import MediasoupRoom from '../room/mediasoup-room.js'
import MediaserverIntegration from '@app/lib/integrations/mediaServer/mediaserver.integration.js'

/* Repo's */
const notificationManager = container.resolve(NotificationManager)
const mediaserverIntegration = container.resolve(MediaserverIntegration)
export default class MediasoupPeer {
  /* States */
  private _user_id: number
  private _socket!: IMediaWebsocketSchema
  private _calibrating = false
  private _currentSvcLayer = {
    s: MediasoupConsumer.MAX_SPATIAL_LAYER,
    t: MediasoupConsumer.MAX_TEMPORAL_LAYER,
  }

  /* Storage */
  private _producerTransport?: MediasoupRtcTransport
  private _consumerTransport?: MediasoupRtcTransport
  private _voiceActivityHistory!: MediasoupPeerActivity[]

  private _producers = new Map<string, MediasoupProducer>()
  private _consumers = new Map<string, MediasoupConsumer>()
  private _locks = new Map<MediaSoupAppDataType, boolean>()

  private _consumerScoreLastTime = new Map<string, number>()
  private _producerScoreLastTime = new Map<string, number>()

  private _consumersAvgScore = 10
  private _producersAvgScore = 10

  /* Logger */
  private readonly logger: DeLogger = new DeLogger({ namespace: 'Peer', tags: ['peer'] })

  constructor(
    private _room: MediasoupRoom,
    private _id: string,
    private _name: string,
    private _avatar: IFileResponseModel,
    private _chatUsername: string | null,
    private _role: PERMISSION,
    private _isHold = false,
    private _branch: MediasoupBranch = DefaultMediasoupBranch,
  ) {
    this._user_id = MediasoupPeer.convertIdToUserId(this._id)
    this.logger.meta = { meeting_hash: _room.meeting_hash, peerId: this._id }
  }

  public async init(ws: IMediaWebsocketSchema, branch = DefaultMediasoupBranch) {
    // set branch and ws
    this._branch = branch
    this._socket = ws
    this._socket.branch = branch

    this.setDefaultLocks()

    // create mediasoup rtc transport on init
    // user have to request for producer transport (if ws Callback implemented)
    this._consumerTransport = await this.createTransport(MediaSoupMediaType.consume)

    this.logger
      .log('Peer initialized.', {
        fullName: this._name,
        branch: branch.hash,
        transportId: this._consumerTransport.transport.id,
      })
      .save()
  }

  /* Start Lock Methods */

  public isLockType(type: MediaSoupAppDataType) {
    return this._locks.get(type) ?? false
  }
  public unlockType(type: MediaSoupAppDataType, firedByPeerId: string) {
    this._locks.set(type, false)
    this._room.notifyUpdatePeer(this)
    this.notifyPeerUnlock(type, firedByPeerId)

    this.logger.log('Peer access unlocked.', { type, firedByPeerId }).save()
  }
  public lockType(type: MediaSoupAppDataType, firedByPeerId: string) {
    this._locks.set(type, true)
    this._room.notifyUpdatePeer(this)
    this.notifyPeerLock(type, firedByPeerId)

    this.logger.log('Peer access locked.', { type, firedByPeerId }).save()
  }

  private setDefaultLocks() {
    const lockAccess = {
      mic: false,
      cam: false,
      screen: false,
    }

    const isNotAdmin = this._role <= PERMISSION.Collaborator

    switch (this._room.mode) {
      case MediaserverModeType.webinar:
        // set default lock to false [only co-host and admin]
        lockAccess.mic = isNotAdmin
        lockAccess.cam = isNotAdmin
        lockAccess.screen = isNotAdmin
        break

      case MediaserverModeType.audio:
        lockAccess.cam = false
        lockAccess.screen = false
        break

      default:
        break
    }

    Object.keys(lockAccess).forEach((key) => {
      this._locks.set(
        MediaSoupShareableType[key as keyof typeof MediaSoupShareableType],
        lockAccess[key as keyof typeof lockAccess],
      )
    })
  }

  /* End Lock Methods */

  /* Start Media Methods */

  public async setTransportMaxIncomingBitrate(type: MediaSoupMediaType, maxBitrate: number) {
    const transport = this.getTransportByType(type)
    if (!transport) return false
    await transport.setMaxIncomingBitrate(maxBitrate)
    return true
  }

  public async createTransport(type: MediaSoupMediaType) {
    const router = this._room.getRouter(type)
    const transportInstance = new MediasoupRtcTransport(router)

    await transportInstance.init(type)

    return transportInstance
  }
  public async createProduce(
    rtpParameters: MediaSoupRTPParameters,
    kind: MediaSoupKindEnum,
    appData: MediaSoupAppData,
    isPaused?: boolean,
  ) {
    // fill appData with branch
    appData.branch = this._branch

    const transport = this._producerTransport

    if (!transport?.initialized) {
      throw new Error('[createProduce] transport not found or closed')
    }

    const producerInstance = new MediasoupProducer(transport, this)
    const produce = await producerInstance.produce(rtpParameters, kind, appData, isPaused)

    produce.on('score', async (score) => {
      if (producerInstance.prevOverall === producerInstance.overall) return
      const stats = await produce.getStats()
      this.notifyProducerScore(produce.id, producerInstance.overall, score, stats)
    })
    this.addProducer(produce.id, producerInstance) // add producer to peer instance
    return { producerInstance, produce }
  }
  public async createConsume(
    producer: MediasoupProducer,
    rtpCapabilities: MediaSoupRTPCapabilities,
    appData: MediaSoupAppData,
  ) {
    // fill appData with branch
    appData.branch = this._branch

    const transport = this._consumerTransport

    if (!transport?.initialized) {
      throw new Error('[createConsumer] transport not found or closed')
    }

    const consumerInstance = new MediasoupConsumer(transport, this)
    const consume = await consumerInstance.consume(producer, rtpCapabilities, appData, false)

    consume.on('score', async (score) => {
      if (consumerInstance.prevOverall === consumerInstance.overall) return
      const stats = await consume.getStats()
      this.notifyConsumerScore(consume.id, consumerInstance.overall, score, stats)
    })
    this.addConsumer(consume.id, consumerInstance) // add consumer to peer instance
    return {
      consumerInstance,
      consume,
      params: {
        producerId: producer.producerId,
        id: consume.id,
        kind: consume.kind,
        rtpParameters: consume.rtpParameters,
        type: consume.type,
        producerPaused: consume.producerPaused,
        appData,
      },
    }
  }
  private addProducer(producerId: string, producerInstance: MediasoupProducer) {
    this._producers.set(producerId, producerInstance)
  }
  public removeProducer(producerId: string) {
    this._producers.delete(producerId)
    this._producerScoreLastTime.delete(producerId)
  }
  public getProducer(producerId: string): MediasoupProducer | undefined {
    return this._producers.get(producerId)
  }
  private addConsumer(consumerId: string, consumerInstance: MediasoupConsumer) {
    this._consumers.set(consumerId, consumerInstance)
  }
  public removeConsumer(consumerId: string) {
    this._consumers.delete(consumerId)
    this._consumerScoreLastTime.delete(consumerId)
  }

  public getProducerObjects() {
    const producersId: MediaserverProducerCallbackObject[] = []
    this._producers.forEach((producer) => {
      if (!producer.producerId || !producer.kind) return
      producersId.push({
        id: producer.producerId,
        peerId: producer.appData.peerId!,
        kind: producer.kind,
        type: producer.appDataType,
        isPaused: !!producer.paused,
      })
    })
    return producersId
  }

  public getTransportByType(type: MediaSoupMediaType) {
    return type === MediaSoupMediaType.consume ? this._consumerTransport : this._producerTransport
  }
  public async connectTransport(transport: MediasoupRtcTransport, dtlsParameters: MediaSoupDTLSParameters) {
    if (!transport.initialized) {
      throw new Error('[restartTransport] transport is not initialized or closed .')
    }

    await transport.connect(dtlsParameters)
  }
  public async restartTransport(transport: MediasoupRtcTransport) {
    if (!transport.initialized) {
      throw new Error('[restartTransport] transport is not initialized or closed .')
    }

    return await transport.restart()
  }
  getTransportData(transportInstance?: MediasoupRtcTransport): MediaserverTransportDataObject {
    if (!transportInstance) {
      throw new Error('Transport Not Found')
    }

    const { transport } = transportInstance

    if (!transport) {
      throw new Error('Transport Not Initialized')
    }

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates as MediaSoupIceCandidate[],
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    }
  }
  setProducerTransport(transport: MediasoupRtcTransport) {
    if (this._producerTransport?.initialized) {
      this.logger.log('[setProducerTransport] Warning there is an active transport already').save()
    }

    this._producerTransport = transport
  }
  setConsumerTransport(transport: MediasoupRtcTransport) {
    if (this._consumerTransport?.initialized) {
      this.logger.log('[setConsumerTransport] Warning there is an active transport already').save()
    }

    this._consumerTransport = transport
  }
  getProducerByType(type: MediaSoupAppDataType): MediasoupProducer | undefined {
    let foundProducer: MediasoupProducer | undefined

    for (const [_, producer] of this._producers) {
      const producerType = producer?.appData?.type

      if (producerType === type) {
        foundProducer = producer
      }
    }

    return foundProducer
  }

  getPriorVideoConsumers(): MediasoupConsumer[] {
    const priorConsumers: MediasoupConsumer[] = []
    this._consumers.forEach((consumer) => {
      if (consumer.kind === 'video' && consumer.isPrior) priorConsumers.push(consumer)
    })

    return priorConsumers
  }

  async calculateProducersAverageScore() {
    let sumScore = 0

    this._producers.forEach((producer) => {
      sumScore += producer.score
    })

    const avg = Math.round(sumScore / this._producers.size)
    if (avg === this._producersAvgScore) return

    this._producersAvgScore = avg

    this.notifyPeerScore(
      (this._producersAvgScore + this._consumersAvgScore) / 2,
      this._producersAvgScore,
      this._consumersAvgScore,
    )
  }

  async calculateConsumersAverageScore() {
    let sumScore = 0

    this._consumers.forEach((consumer) => {
      sumScore += consumer.score
    })

    const avg = Math.round(sumScore / this._consumers.size)
    if (avg === this._consumersAvgScore) return

    this._consumersAvgScore = avg

    this.notifyPeerScore(
      (this._producersAvgScore + this._consumersAvgScore) / 2,
      this._producersAvgScore,
      this._consumersAvgScore,
    )
  }

  async setConsumerPrior(consumer: MediasoupConsumer) {
    if (consumer.isPrior) return

    consumer.isPrior = true
    consumer.setHighestPriority()

    const priorConsumers = this.getPriorVideoConsumers()

    // if this consumer was the first prior consumer, we'll set other consumers to the lowest priority
    if (priorConsumers.length <= 1) {
      this._consumers.forEach((consumerInstance) => {
        if (consumerInstance.kind !== 'video' || consumerInstance.consumerId === consumer.consumerId) {
          return
        }

        consumerInstance.setLowestPriority()
      })
    }
  }

  async unsetConsumerPrior(consumer: MediasoupConsumer) {
    if (!consumer.isPrior) return

    consumer.isPrior = false

    const priorConsumers = this.getPriorVideoConsumers()

    // if there is other prior consumers, we'll set this consumer to the lowest priority (we already did it for other non-priors)
    // if there is no prior consumers anymore, we'll set all consumer to the highest priority
    if (priorConsumers.length) {
      consumer.setLowestPriority()
    } else {
      this._consumers.forEach((consumerInstance) => {
        if (consumerInstance.kind !== 'video') {
          return
        }

        consumerInstance.setHighestPriority()
      })
    }
  }

  /* End Media Methods */

  /* Start Media Notify */
  private notifyPeerLock(type: MediaSoupAppDataType, firedByPeerId: string) {
    notificationManager.broadcastEmit(
      'peer:lock',
      {
        peerId: this._id,
        type,
        firedByPeerId,
      },
      this.room,
    )
  }

  private notifyPeerUnlock(type: MediaSoupAppDataType, firedByPeerId: string) {
    notificationManager.broadcastEmit(
      'peer:unlock',
      {
        peerId: this._id,
        type,
        firedByPeerId,
      },
      this.room,
    )
  }
  private notifyConsumerScore(
    consumerId: string,
    overall: MediaOverall,
    score: ConsumerScore,
    stats: (ProducerStat | ConsumerStat)[],
  ) {
    notificationManager.emit(this._id, 'score:consumer', {
      consumerId: consumerId,
      ...score,
      stats,
      overall,
    })
  }
  private notifyProducerScore(producerId: string, overall: MediaOverall, score: ProducerScore[], stats: ProducerStat[]) {
    notificationManager.emit(this._id, 'score:producer', {
      producerId,
      data: score.map((s) => ({
        score: s.score,
        ssrc: s.ssrc,
        rid: s.rid,
      })),
      stats,
      overall,
    })
  }
  private notifyPeerScore(avgScore: number, producersAvgScore: number, consumersAvgScore: number) {
    notificationManager.broadcastEmit(
      'peer:score',
      {
        peerId: this.id,
        avgScore,
        producersAvgScore,
        consumersAvgScore,
      },
      this.room,
    )
  }

  public notifyRecordingPreview(recording_hash: string, branch: MediasoupBranch) {
    notificationManager.emit(this._id, 'recording:notify-preview', {
      branch,
      recording_hash,
    })

    this.logger.log('Peer notified to take screenshot.').save()
  }

  /* End Media Notify */

  /* Start Media Network Calibration Methods */

  private async videoConsumerCalibrate(consumer: MediasoupConsumer, action: MediaCalibrateAction) {
    switch (action) {
      case MediaCalibrateAction.inc:
        await consumer.increaseLayers()
        break
      case MediaCalibrateAction.dec:
        await consumer.reduceLayers()
        break
      case MediaCalibrateAction.no_cam:
        if (consumer.appData.type !== MediaSoupShareableType.cam) break
        consumer.pause()
        break
      default:
        consumer.reduceLayers()
        break
    }
  }
  public async calibrateAllConsumers(action: MediaCalibrateAction) {
    if (!this._consumerTransport || this._consumerTransport?.closed) {
      this._calibrating = false
      return false
    }

    if (this._calibrating) return false

    this._calibrating = true

    if (this._consumers.size && (action === MediaCalibrateAction.inc || action === MediaCalibrateAction.dec)) {
      // update current svc layers of peer
      const { s: spatialLayer, t: temporalLayer } = this._currentSvcLayer
      let nextTemporalLayer: number
      let nextSpatialLayer: number

      if (action === MediaCalibrateAction.inc) {
        nextTemporalLayer = MediasoupConsumer.getIncreaseNextTemporalLayer(temporalLayer)
        nextSpatialLayer = MediasoupConsumer.getIncreaseNextSpatialLayer(temporalLayer, spatialLayer)
      } else {
        nextTemporalLayer = MediasoupConsumer.getReduceNextTemporalLayer(temporalLayer)
        nextSpatialLayer = MediasoupConsumer.getReduceNextSpatialLayer(temporalLayer, spatialLayer)
      }

      this._currentSvcLayer = {
        s: nextSpatialLayer,
        t: nextTemporalLayer,
      }
    }

    try {
      for (const [_, consumer] of this._consumers) {
        if (consumer.closed || consumer.paused || consumer.kind !== MediaSoupKindEnum.video) continue

        await this.videoConsumerCalibrate(consumer, action)
      }
    } catch (error) {
      this.logger.log('Bulk Calibration failed', { action }).save()

      return false
    } finally {
      this._calibrating = false
    }

    return true
  }
  public async calibrateConsumer(consumerId: string, action: MediaCalibrateAction) {
    if (!this._consumerTransport || this._consumerTransport?.closed) return false
    if (action === MediaCalibrateAction.no_cam) return false // only in calibrate:all method

    const consumer = this._consumers.get(consumerId)
    if (!consumer || consumer.closed || consumer.kind !== MediaSoupKindEnum.video) return false

    try {
      await this.videoConsumerCalibrate(consumer, action)
    } catch (error) {
      this.logger.log('Calibration failed for consumer', { consumerId, action }).save()
      return false
    }

    return true
  }

  /* End Media Network Calibration Methods */

  /* Start Hold Methods */

  public hold() {
    this._producers.forEach((producer) => {
      producer.close()
    })
    this._consumers.forEach((consumer) => {
      consumer.pause()
    })
    this._isHold = true
    this.notifyToggleHold()
    this.logger.log('Peer hold').save()
  }
  public unHold() {
    this._consumers.forEach((consumer) => {
      consumer.resume()
    })
    this._isHold = false
    this.notifyToggleHold()
    this.logger.log('Peer unhold').save()
  }
  private notifyToggleHold() {
    notificationManager.broadcastEmitByBranch(
      'hold:toggle',
      {
        peerId: this._id,
        isHold: this.is_hold,
      },
      this.room,
      this.branch,
    )
  }

  /* End Hold Methods */

  /* Start Branch Methods */

  public switchBranch(branch: MediasoupBranch) {
    mediaserverIntegration.emitMessage(
      'peer:left',
      {
        meeting_id: this.branch.hash === DefaultMediasoupBranch.hash ? this.room.meeting_id : this.branch.id,
        peer_id: this.id,
        left_at: Date.now(),
        remainedUserPeers: this.room
          .getPeerByBranch(this.branch.hash)
          .filter((peer) => peer.user_id === this.user_id && peer.id !== this.id)
          .map((peer) => peer.id),
      },
      this.room,
    )

    const previousBranchHash = this._branch.hash

    // update ws branch
    this._socket.branch = branch

    // change peer branch
    this._branch = branch

    // close producers and consumers first
    this._producers.forEach((producer) => {
      producer.appData.branch = branch

      if (producer.appData.type === MediaSoupShareableType.screen) {
        producer.close()
      } else {
        if (producer.recording) {
          producer.stopRecord()
        }

        if (this.room.recording.get(this._branch.hash)) {
          producer.record()
        }

        if (producer.transcription) {
          producer.stopTranscribe()
        }

        if (this.room.recording) {
          producer.transcribe()
        }
      }
    })
    this._consumers.forEach((consumer) => {
      consumer.close()
    })

    mediaserverIntegration.emitMessage(
      'peer:joined',
      {
        meeting_id: this.branch.hash === DefaultMediasoupBranch.hash ? this.room.meeting_id : this.branch.id,
        peer_id: this.id,
        joined_at: Date.now(),
      },
      this.room,
    )
    this.logger.log('Peer branch switched.', { previousBranch: previousBranchHash, currentBranch: branch.hash }).save()
  }

  /* End Branch Methods */

  /* Start Peer Control Methods */

  public disconnect(kickNotify = false) {
    if (kickNotify) {
      notificationManager.emit(this.id, 'peer:kick', {
        peerId: this.id,
      })
    }

    setTimeout(() => {
      this._consumerTransport?.close()
      this._producerTransport?.close()

      this._producers.forEach((producer) => {
        producer.close()
      })
      this._consumers.forEach((consumer) => {
        consumer.close()
      })

      const wsMediaHandler = container.resolve(WsMediaHandler)
      const clients = wsMediaHandler.getClient(this._id)
      clients.forEach((ws) => {
        try {
          ws.joinedMediaRoom = false
          wsMediaHandler.end(ws, 'disconnect() method called.')
        } catch (err) {
          // ...
        }
      })
    }, 500)
  }
  public update(params: { name?: string; role?: PERMISSION }) {
    const { name, role } = params
    if (name) this._name = name
    if (role) this._role = role
    // Notify Others
    if (name || role) this._room.notifyUpdatePeer(this)
    this.logger.log('Peer updated', { ...params }).save()
  }

  /* End Peer Control Methods */

  static convertIdToUserId(id?: string) {
    if (!id) return 0
    const splittedId = id.split('_')
    return Number(splittedId[0])
  }

  /* Start Peer Parameters GET-SET */

  get id() {
    return this._id
  }
  get voiceActivityHistory() {
    return this._voiceActivityHistory
  }
  get user_id() {
    return this._user_id
  }
  get name() {
    return this._name
  }
  get role() {
    return this._role
  }
  get is_hold() {
    return this._isHold
  }
  get room() {
    return this._room
  }
  get avatar() {
    return this._avatar
  }
  get chatUsername() {
    return this._chatUsername
  }

  get branch() {
    return this._branch
  }
  get locks() {
    return this._locks
  }
  get producer_transport_data() {
    return this.getTransportData(this._producerTransport)
  }
  get consumer_transport_data() {
    return this.getTransportData(this._consumerTransport)
  }
  get calibrating() {
    return this._calibrating
  }
  get socket() {
    return this._socket
  }

  toObject(): MediaserverPeerObject {
    const locks: MediaserverPeerObject['locks'] = []
    this._locks.forEach((value, key) => {
      if (value) locks.push(key)
    })

    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      chatUsername: this.chatUsername,
      role: this.role,
      isHold: this.is_hold,
      branch: this.branch,
      locks,
      producers: this.getProducerObjects(),
    }
  }

  /* Start Peer Parameters GET-SET */
}
