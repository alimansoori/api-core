import MediaserverRepository from '@app/database/entities/mediaserver/mediaserver.repo.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { DeLogger } from '@app/lib/de-logger.js'
import MediaserverIntegration from '@app/lib/integrations/mediaServer/mediaserver.integration.js'
import { getMsCollector } from '@app/lib/promCollectors/mediaserver.prom.js'
import PrometheusCollector from '@app/lib/promCollectors/prometheus.collector.js'
import NotificationManager from '@app/mediaserver/notification/notification-manager.js'
import {
  ITranscriptionMessage,
  MediaserverMeetingObject,
  MediaserverPeerObject,
  MediaserverProducerCallbackObject,
} from '@app/shared-models/index.js'
import {
  DefaultMediasoupBranch,
  MediaserverModeType,
  MediaSoupAppData,
  MediaSoupAppDataType,
  MediasoupBranch,
  MediaSoupKindEnum,
  MediaSoupMediaType,
  MediaSoupPauseableType,
  MediaSoupRTPCapabilities,
  MediaSoupRTPParameters,
  MediaSoupShareableType,
} from '@app/shared-models/mediasoup-shared-types.js'
import MediasoupConsumer from '@mediaserver/mediasoup/consumer/mediasoup-consumer.js'
import MediasoupPeer from '@mediaserver/mediasoup/peer/mediasoup-peer.js'
import MediasoupProducer from '@mediaserver/mediasoup/producer/mediasoup-producer.js'
import MediasoupRouter from '@mediaserver/mediasoup/router/mediasoup-router.js'
import { container } from 'tsyringe'
import MediasoupAudioLevelObserver from '../audio/mediasoup-audio-observer.js'
import { MediaRoomSetting } from './interfaces/mediasoup-room.interface.js'
import { logger } from '@app/lib/logger.js'
import MediaserverTracker from '@app/mediaserver/tracker/mediaserver-tracker.js'
import dayjs from 'dayjs'
import { generateNanoID } from '@app/utility/helpers/index.js'
import Mixpanel from '@app/lib/mixpanel/mixpanel.js'
import E2EE from '@app/lib/e2e/E2EE.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'

/* Configs */
const { MS_ROOM_AUTO_CLOSE_MIN } = getConfigs()

/* Repo's */
const notificationManager = container.resolve(NotificationManager)
const mediaserverRepo = container.resolve(MediaserverRepository)
const mediaserverIntegration = container.resolve(MediaserverIntegration)
const promCollector = container.resolve(PrometheusCollector)
const mediaserverTracker = container.resolve(MediaserverTracker)
const mixpanel = container.resolve(Mixpanel)

export default class MediasoupRoom {
  /* Settings */
  public readonly mode: MediaserverModeType = MediaserverModeType.normal
  private _setting: MediaRoomSetting = { presentation: 'anyone', view_transcription_permit: 'anyone' }

  /* States */
  private _closed = false

  private _recording = new Map<
    string,
    {
      startedAt: Date
      hash: string
      branchId: number
    }
  >()

  private _endedRecordings = new Map<
    string,
    {
      pendingUploads: Set<string>
    }
  >()

  private _transcription = false
  private _encrypted = false
  private _encryptionKey = new E2EE()
  private _migrated: number | null = null

  /* Storages */
  private _producers: Map<string, MediasoupProducer> = new Map()
  private _consumers: Map<string, MediasoupConsumer> = new Map()
  private _audioLevelObserver!: MediasoupAudioLevelObserver
  private _peers: Map<string, MediasoupPeer> = new Map()

  /**
   * `[branch_hash]:[MediaSoupAppDataType] -> boolean`
   */
  private _locks = new Map<`${string}:${MediaSoupAppDataType}`, boolean>()

  /* Timer */
  private _autoCloseStarted = false
  private _autoCloseInterval!: NodeJS.Timeout

  /* Logger */
  public readonly logger: DeLogger = new DeLogger({ namespace: 'Room', tags: ['room'] })

  constructor(
    private _sid: number, // SID : Server ID
    private _isLocal: boolean,
    private _meeting_id: number,
    private _meeting_hash: string,
    private _meeting_startedAt: Date | null,

    private _name: string,
    protected _router: MediasoupRouter,
  ) {
    this.logger.meta = { meeting_id: _meeting_id.toString(), meeting_hash: _meeting_hash }
    this.init().catch((err) => logger.error(err))
  }

  private helper = getHelper()

  private async init() {
    promCollector.incGauge(getMsCollector<'gauge'>('open_room_count')?.instance).then()
    this._audioLevelObserver = new MediasoupAudioLevelObserver(this)
    await this._audioLevelObserver.init(this._router)

    this.startAutoCloseInterval()

    this.logger.log('Room initialized.', { sid: this._sid.toString() }).save()
  }

  public startAutoCloseInterval() {
    // setup auto-close interval
    if (this._autoCloseStarted) return
    this._autoCloseInterval = setInterval(() => {
      if (this.isEmpty()) {
        if (this.closed) {
          clearInterval(this._autoCloseInterval)
          return
        }

        this.logger.log(`Room Auto Closed after ${MS_ROOM_AUTO_CLOSE_MIN}Min Due to Empty Peers`).save()
        this.forceClose(true, !this._migrated)
        logger.info('Close 3')
      }
    }, MS_ROOM_AUTO_CLOSE_MIN * 60_000)
    this._autoCloseStarted = true
  }
  private resetCloseInterval() {
    this._autoCloseStarted = false
    clearInterval(this._autoCloseInterval)

    this.startAutoCloseInterval()
  }
  public isEmpty() {
    return this._peers.size === 0
  }

  /* Start Peer Methods */

  addPeer(peer: MediasoupPeer) {
    this._peers.set(peer.id, peer)
    this.notifyNewPeer(peer, peer.id)
    promCollector.incGauge(getMsCollector<'gauge'>('peer_count')?.instance).then()
  }
  removePeer(id: string) {
    const peer = this.getPeer(id)
    peer?.disconnect()
    this._peers.delete(id)
    if (this._peers.size === 0) this.resetCloseInterval()
    this.notifyDisPeer(id, peer)
    promCollector.decGauge(getMsCollector<'gauge'>('peer_count')?.instance).then()
    this.logger.log('Peer removed from mediaRoom.', { peerId: id }).save()
  }
  hasPeer(id: string) {
    return this._peers.has(id)
  }
  getPeer(id: string) {
    return this._peers.get(id)
  }
  getPeersByNumeralId(user_id: number) {
    const peers: MediasoupPeer[] = []
    this._peers.forEach((p) => {
      if (p.user_id === user_id) peers.push(p)
    })
    return peers
  }
  getPeerByBranch(branchHash: string) {
    const peers: MediasoupPeer[] = []
    this._peers.forEach((peer) => {
      if (peer.branch.hash === branchHash) peers.push(peer)
    })
    return peers
  }
  peerSwitch(peer: MediasoupPeer, branch: MediasoupBranch, firedByPeerId?: string) {
    // get current producers before being closed
    const camProducer = peer.getProducerByType(MediaSoupShareableType.cam)
    const micProducer = peer.getProducerByType(MediaSoupShareableType.mic)
    const screenProducer = peer.getProducerByType(MediaSoupShareableType.screen)

    const currentState = {
      cam: camProducer?.closed === false || camProducer?.paused === false,
      mic: micProducer?.closed === false || micProducer?.paused === false,
      screen: screenProducer?.closed === false || screenProducer?.paused === false,
    }

    // switch peer to target branch (BOR)
    peer.switchBranch(branch)

    const producers = this.generateProducersIdByBranch(branch)

    // notify other peers for peer switch
    this.notifySwitchPeer(peer, branch, producers, currentState, firedByPeerId)
  }

  /* End Peer Methods */

  /* Start Peer Notify */

  private notifySwitchPeer(
    peer: MediasoupPeer,
    branch: MediasoupBranch,
    branchProducers: MediaserverProducerCallbackObject[],
    currentState: { cam: boolean; mic: boolean; screen: boolean },
    firedByPeerId?: string,
  ) {
    notificationManager.emit(peer.id, 'peer:switch', {
      id: peer.id,
      branch,
      firedByPeerId: firedByPeerId ?? null,
      branchProducers,
      recordingStartedAt: this.recording.get(branch.hash)?.startedAt || null,
      currentState,
    })
    notificationManager.broadcastEmit(
      'peer:new',
      {
        id: peer.id,
        name: peer.name,
        avatar: peer.avatar,
        chatUsername: peer.chatUsername,
        role: peer.role,
        isHold: peer.is_hold,
        branch: peer.branch,
        peerProducers: branchProducers.filter((producer) => producer.peerId === peer.id),
        locks: Object.fromEntries(peer.locks),
        trackingTime: this.getActivityTime(peer),
      },
      this,
      peer.id,
    )
    this.notifyRandomPeerForRecordingPreview(peer.branch)
  }
  private notifyNewPeer(peer: MediasoupPeer, excludeId?: string) {
    mediaserverIntegration.emitMessage(
      'peer:joined',
      {
        meeting_id: peer.branch.hash === DefaultMediasoupBranch.hash ? this._meeting_id : peer.branch.id,
        peer_id: peer.id,
        joined_at: Date.now(),
      },
      this,
    )
    notificationManager.broadcastEmit(
      'peer:new',
      {
        id: peer.id,
        name: peer.name,
        avatar: peer.avatar,
        chatUsername: peer.chatUsername,
        role: peer.role,
        isHold: peer.is_hold,
        branch: peer.branch,
        locks: Object.fromEntries(peer.locks),
        trackingTime: this.getActivityTime(peer),
      },
      this,
      excludeId,
    )
    this.notifyRandomPeerForRecordingPreview(peer.branch)
  }

  private getActivityTime(peer: MediasoupPeer): number {
    let activityTime: number = 0
    const activities = peer.voiceActivityHistory?.filter((item) => Number(item.peerId.split('_')[0]) === peer.user_id)

    if (activities) {
      for (const activity of activities) {
        activityTime += activity.voiceActivityHistory.activityTime
      }
    }

    return activityTime
  }

  private notifyDisPeer(peerId: string, peer?: MediasoupPeer) {
    mediaserverIntegration.emitMessage(
      'peer:left',
      {
        meeting_id: peer && peer.branch.hash !== DefaultMediasoupBranch.hash ? peer.branch.id : this.meeting_id,
        peer_id: peerId,
        left_at: Date.now(),
        remainedUserPeers: peer
          ? this.getPeerByBranch(peer.branch.hash)
              .filter((branchPeer) => branchPeer.user_id === peer.user_id && branchPeer.id !== peer.id)
              .map((userPeer) => userPeer.id)
          : [],
      },
      this,
    )
    notificationManager.broadcastEmit(
      'peer:dis',
      {
        peerId,
      },
      this,
      peerId,
    )
    mediaserverTracker.track(
      {
        type: 'peer:left',
        meeting_id: peer && peer.branch.hash !== DefaultMediasoupBranch.hash ? peer.branch.id : this.meeting_id,
        fired_by: peerId,
      },
      this,
    )
    if (peer) this.notifyRandomPeerForRecordingPreview(peer.branch)
  }
  public notifyUpdatePeer(peer: MediasoupPeer) {
    notificationManager.broadcastEmit(
      'peer:update',
      {
        id: peer.id,
        name: peer.name,
        avatar: peer.avatar,
        chatUsername: peer.chatUsername,
        role: peer.role,
        isHold: peer.is_hold,
        branch: peer.branch,
        locks: Object.fromEntries(peer.locks),
        trackingTime: this.getActivityTime(peer),
      },
      this,
    )
  }

  private notifyLock(type: MediaSoupAppDataType, firedByPeerId: string) {
    // disabled time limitation
    /* const now = +new Date();
    const lastTimeNotified = this._consumerScoreLastTime.get(consumerId);
    if (lastTimeNotified && (now - lastTimeNotified) <= 2_500) return;
    this._consumerScoreLastTime.set(consumerId, now); */

    notificationManager.broadcastEmit(
      'media:lockAll',
      {
        type,
        firedByPeerId,
      },
      this,
    )
  }
  private notifyUnlock(type: MediaSoupAppDataType, firedByPeerId: string) {
    notificationManager.broadcastEmit(
      'media:unlockAll',
      {
        type,
        firedByPeerId,
      },
      this,
    )
  }

  /* End Peer Notify */

  /* Start Media Methods */

  public getRouter(type: MediaSoupMediaType) {
    return this._router
  }

  protected canProduce(type: MediaSoupAppDataType) {
    // Nothing on normal Mode
    return true
  }

  public async produce(
    peer: MediasoupPeer,
    rtpParameters: MediaSoupRTPParameters,
    kind: MediaSoupKindEnum,
    appData: MediaSoupAppData,
    isPaused?: boolean,
  ) {
    try {
      if (!this.canProduce(appData.type)) throw new Error('Can not produce this type.')

      if (appData.type === MediaSoupShareableType.screen) {
        // check presentation of screen type for current peer
        const { role } = peer
        const minimumRoleToProduce = this.helper.root.convertPermitToPermission(this._setting.presentation)

        if (role < minimumRoleToProduce) {
          throw new Error('Permission Denied.')
        }
      }

      appData.encryptionKey = this.encryptionKey.key

      const { produce, producerInstance } = await peer.createProduce(rtpParameters, kind, appData, isPaused)

      const producerId = produce.id
      this.addProducer(producerId, producerInstance) // add to room instance

      if (this.recording.get(appData.branch.hash)) {
        producerInstance.record()
      }

      if (this.transcription) {
        producerInstance.transcribe()
      }

      promCollector.incGauge(getMsCollector<'gauge'>(`${appData.type}_count`)?.instance).then()

      produce.observer.on('close', () => {
        this.logger.log('[producer] closed.', { producerId }).save()
        promCollector.decGauge(getMsCollector<'gauge'>(`${appData.type}_count`)?.instance).then()

        const producer = peer.getProducer(producerId)!

        if (producer.recording) {
          producer.stopRecord()
        }

        if (producer.transcription) {
          producer.stopTranscribe()
        }

        peer.removeProducer(producerId) // remove producer from peer instance
        this.removeProducer(producerId) // remove producer from room instance

        this.notifyCloseProducer(
          peer.id,
          producerId,
          producerInstance.appData.type,
          peer.branch,
          producerInstance.actionFiredByPeerId ?? undefined,
          producerInstance.restartWithCodec ?? undefined,
        )

        producer.unsetPromStats()
      })
      produce.observer.on('pause', () => {
        this.notifyPausedProducer(
          peer.id,
          producerId,
          producerInstance.appData.type,
          peer.branch,
          undefined,
          producerInstance.actionFiredByPeerId ?? undefined,
        )
      })
      produce.observer.on('resume', () => {
        // producer resumed so notify consumers
        this.notifyResumedProducer(producerId, peer.branch)
      })

      // observe audio producer
      if (kind === MediaSoupKindEnum.audio) await this._audioLevelObserver.addProducer(producerId)

      // pipe produce function
      await this.pipeProducer(producerId)

      // Notify All for New Producer
      this.notifyNewProducer(producerInstance, peer.branch, peer.id)
      if (appData.type === MediaSoupShareableType.screen) this.notifyRandomPeerForRecordingPreview(peer.branch)

      return producerId
    } catch (error: any) {
      this.logger.error('[produce]', { error }).save()
    }
  }

  protected async pipeProducer(producerId: string) {
    // Nothing on normal Mode
  }

  protected async setPeerTransportMaxIncomingBitrate(peer: MediasoupPeer, type: MediaSoupMediaType) {
    // Nothing on normal Mode
  }

  public async consume(peer: MediasoupPeer, producer: MediasoupProducer, rtpCapabilities: MediaSoupRTPCapabilities) {
    try {
      const appData = producer.appData

      if (producer.appData.peerId && !this.hasPeer(producer.appData.peerId)) {
        this.removeProducer(producer.producerId)
        throw new Error('Producer not existed in peer producers.')
      }

      // check producer branch if exists
      if (producer.appData.branch && producer.appData.branch.hash !== peer.branch.hash) {
        throw new Error('Cant Consume Other Branches Producers')
      }

      this.setPeerTransportMaxIncomingBitrate(peer, MediaSoupMediaType.consume)

      const { consume, consumerInstance, params } = await peer.createConsume(producer, rtpCapabilities, appData)

      const consumerId = consume.id
      this.addConsumer(consumerId, consumerInstance) // add to room instance

      // if consume producer closes close this
      consume.on('producerclose', () => {
        consumerInstance.close()
      })
      consume.observer.on('close', () => {
        peer.removeConsumer(consumerId) // remove consumer from peer instance
        this.removeConsumer(consumerId) // remove consumer from room instance
      })
      return params
    } catch (error: any) {
      this.logger.error('[consume]', { error }).save()
    }
  }
  private addProducer(producerId: string, producerInstance: MediasoupProducer) {
    this._producers.set(producerId, producerInstance)
  }
  private removeProducer(producerId: string) {
    this._producers.delete(producerId)
  }
  public getProducer(producerId: string) {
    return this._producers.get(producerId)
  }
  public closeProducer(producerId: string, firedByPeerId: string) {
    const producerInstance = this.getProducer(producerId)
    if (!producerInstance || producerInstance.closed) return

    producerInstance.close(firedByPeerId)
  }
  public pauseProducer(producerId: string, firedByPeerId: string) {
    const producerInstance = this.getProducer(producerId)
    if (!producerInstance || producerInstance.closed) return

    producerInstance.pause(firedByPeerId)

    return producerInstance.appDataType
  }
  public pauseAll(type: MediaSoupPauseableType, firedByPeerId: string) {
    for (const [producerId, producer] of this._producers) {
      const producerAppData = producer.appData
      const producerPeerId = producerAppData?.peerId
      const producerType = producerAppData.type
      if (producerPeerId && producerPeerId === firedByPeerId) continue
      if (producerType === MediaSoupShareableType.screen || producerType !== type) continue
      this.pauseProducer(producerId, firedByPeerId)
    }
  }
  public closeAll(type: MediaSoupPauseableType, firedByPeerId: string) {
    for (const [producerId, producer] of this._producers) {
      const producerAppData = producer.appData
      const producerPeerId = producerAppData?.peerId
      const producerType = producerAppData.type
      if (producerPeerId && producerPeerId === firedByPeerId) continue
      if (producerType === MediaSoupShareableType.screen || producerType !== type) continue
      this.closeProducer(producerId, firedByPeerId)
    }
  }
  public resumeProducer(producer: MediasoupProducer) {
    producer.resume()
    return producer
  }
  private addConsumer(consumerId: string, consumerInstance: MediasoupConsumer) {
    this._consumers.set(consumerId, consumerInstance)
  }
  private removeConsumer(consumerId: string) {
    this._consumers.delete(consumerId)
  }
  public getConsumer(consumerId: string) {
    return this._consumers.get(consumerId)
  }
  public resumeConsumer(consumer: MediasoupConsumer) {
    return consumer.resume()
  }

  /* End Media Methods */

  /* Start Media Notify */

  private notifyNewProducer(producer: MediasoupProducer, branch: MediasoupBranch, excludeId?: string) {
    notificationManager.broadcastEmitByBranch(
      'producer:new',
      {
        producerId: producer.producerId,
        peerId: producer.appData.peerId,
        type: producer.appData.type,
        isPaused: !!producer.paused,
      },
      this,
      branch,
      excludeId,
    )
  }
  private notifyPausedProducer(
    peerId: string,
    producerId: string,
    type: MediaSoupAppDataType,
    branch: MediasoupBranch,
    excludeId?: string,
    firedByPeerId?: string,
  ) {
    notificationManager.broadcastEmitByBranch(
      'producer:pause',
      {
        peerId,
        producerId,
        type,
        firedByPeerId,
      },
      this,
      branch,
      excludeId,
    )
  }
  private notifyResumedProducer(producerId: string, branch: MediasoupBranch, excludeId?: string) {
    notificationManager.broadcastEmitByBranch(
      'producer:resume',
      {
        producerId,
      },
      this,
      branch,
      excludeId,
    )
  }
  private notifyCloseProducer(
    peerId: string,
    producerId: string,
    type: MediaSoupAppDataType,
    branch: MediasoupBranch,
    firedByPeerId?: string,
    restartWithCodec?: 'vp8' | 'vp9',
  ) {
    notificationManager.broadcastEmitByBranch(
      'producer:close',
      {
        peerId,
        producerId,
        type,
        firedByPeerId,
        restartWithCodec,
      },
      this,
      branch,
    )
  }
  /* End Media Notify */

  /* Start Lock Methods */

  public isLockType(branch: MediasoupBranch, type: MediaSoupAppDataType) {
    return this._locks.get(`${branch.hash}:${type}`) ?? false
  }
  public unlockType(branch: MediasoupBranch, type: MediaSoupAppDataType, firedByPeerId: string) {
    this._locks.set(`${branch.hash}:${type}`, false)
    this.notifyUnlock(type, firedByPeerId)
  }
  public lockType(branch: MediasoupBranch, type: MediaSoupAppDataType, firedByPeerId: string) {
    this._locks.set(`${branch.hash}:${type}`, true)
    this.notifyLock(type, firedByPeerId)
  }

  /* End Lock Methods */

  /* Start Room Close Methods */

  public notifyRoomClosed() {
    if (!this._closed) return
    notificationManager.broadcastEmit('meeting:closed', null, this)
  }
  public branchClosed(branchHash: string) {
    // switch peers of this branch to default Branch
    const peers = this.getPeerByBranch(branchHash)
    peers.forEach((peer) => {
      this.peerSwitch(peer, DefaultMediasoupBranch)
    })
  }
  public notifyBranchClosed(branch: MediasoupBranch) {
    notificationManager.broadcastEmit(
      'branch:closed',
      {
        branch,
      },
      this,
    )
  }
  public async forceClose(notify = false, dbSet = false) {
    if (this._closed) return

    this._closed = true
    await mediaserverRepo.setMediaServerRoom(this._meeting_id, { isClosed: true })

    if (notify) this.notifyRoomClosed()

    this.logger.log('Room forceClose Called.', { notify, dbSet }).save()

    clearInterval(this._autoCloseInterval)

    setTimeout(() => {
      this._audioLevelObserver.close()

      if (this.recording.size) {
        this.recording.forEach((recordingData, branch) => this.stopRecording({ id: recordingData.branchId, hash: branch }))
      }

      if (this.transcription) this.stopTranscription()

      this._consumers.clear()
      this._producers.clear()

      for (const [_, peer] of this._peers) {
        peer.disconnect()
      }

      this._peers.clear()

      promCollector.decGauge(getMsCollector<'gauge'>('open_room_count')?.instance).then()

      if (dbSet) {
        mediaserverIntegration.emitMessage(
          'room:closed',
          {
            meeting_id: this._meeting_id,
            participants: this._audioLevelObserver.getActivityHistoryList(),
          },
          this,
        )
      }

      /* const mediaContainer = container.resolve(MediasoupContainer);
mediaContainer.removeRoom(this._id); */
    }, 1000)
  }

  /* End Room Close Methods */

  /* Start Recording Methods */

  public async startRecording(branch: MediasoupBranch) {
    if (this.recording.get(branch.hash)) {
      this.logger.log('Recording Is Already Started !').save()
      return
    }

    const recordingData = {
      startedAt: dayjs.utc().toDate(),
      hash: generateNanoID(),
      branchId: branch.id,
    }

    this._recording.set(branch.hash, recordingData)
    this.notifyToggleRecording(branch)

    for (const producer of this.getProducersByBranch(branch)) {
      if (producer.appData.type === MediaSoupShareableType.cam) {
        producer.close(undefined, 'vp8')
        continue
      }

      await producer.record()
    }

    mediaserverIntegration.emitMessage(
      'recording:started',
      {
        meeting_id: branch.hash === DefaultMediasoupBranch.hash ? this._meeting_id : branch.id,
        started_at: Date.now(),
        recording_hash: recordingData.hash,
      },
      this,
    )

    mixpanel.trackBackend({
      event: 'Recording has been started',
      properties: {
        name: this.name,
        meeting_id: this._meeting_id,
      },
    })

    this.notifyRandomPeerForRecordingPreview(branch)
  }

  public async stopRecording(branch: MediasoupBranch) {
    const recordData = this.recording.get(branch.hash)

    if (!recordData) {
      this.logger.log('Recording Not Started Yet !').save()
      return
    }

    const recordingProcessesFileNames = this.getProducersByBranch(branch)
      .filter((producer) => producer.recording?.process?.isRunning)
      .map((producer) => producer.recording!.process!.fileName)

    if (!recordingProcessesFileNames.length) {
      mediaserverIntegration.emitMessage(
        'recording:all-files-uploaded',
        {
          meeting_hash: branch.hash === DefaultMediasoupBranch.hash ? this.meeting_hash : branch.hash,
          recordingData: recordData,
        },
        this,
      )
    } else {
      const pendingUploadsSet: Set<string> = new Set()
      recordingProcessesFileNames.forEach((id) => pendingUploadsSet.add(id))

      this.endedRecordings.set(branch.hash, { pendingUploads: pendingUploadsSet })
      this.logger
        .log('Some uploads are pending for ended recording.', {
          branchHash: branch.hash,
          pendingUploads: pendingUploadsSet,
        })
        .save()
    }

    for (const producer of this.getProducersByBranch(branch)) {
      if (producer.appData.type === MediaSoupShareableType.cam) {
        producer.close(undefined, 'vp9')
        continue
      }

      producer.stopRecord()
    }

    mediaserverIntegration.emitMessage(
      'recording:stopped',
      {
        meeting_id: branch.hash === DefaultMediasoupBranch.hash ? this.meeting_id : branch.id,
        stopped_at: Date.now(),
        hash: recordData.hash,
      },
      this,
    )

    this._recording.delete(branch.hash)

    this.notifyToggleRecording(branch)

    mixpanel.trackBackend({
      event: 'Recording has been stopped',
      properties: {
        name: this.name,
        meeting_id: this.meeting_id,
      },
    })
  }

  private notifyToggleRecording(branch: MediasoupBranch) {
    notificationManager.broadcastEmit(
      'recording:update',
      {
        status: !!this.recording.get(branch.hash),
        branch,
      },
      this,
    )
  }

  private notifyRandomPeerForRecordingPreview(branch: MediasoupBranch) {
    const recording = this.recording.get(branch.hash)
    if (!recording) return

    const branchPeers = [...this.peers.values()].filter((peer) => peer.branch.hash === branch.hash)
    const randomPeer = branchPeers.length ? branchPeers[Math.floor(Math.random() * branchPeers.length)] : undefined

    randomPeer?.notifyRecordingPreview(recording.hash, branch)
  }

  /* End Recording Methods */

  /* Start Transcription Methods */

  public async startTranscription() {
    if (this._transcription) {
      this.logger.log('Transcription Is Already Started !').save()
      return
    }

    this._transcription = true
    this.notifyToggleTranscription()

    for (const [_i, producerInstance] of this._producers) {
      await producerInstance.transcribe()
    }

    mixpanel.trackBackend({
      event: 'Transcription has been started',
      properties: {
        name: this.name,
        meeting_id: this.meeting_id,
      },
    })
  }

  public stopTranscription() {
    if (!this._transcription) {
      this.logger.log('Transcription Not Started Yet !').save()
      return
    }

    this._transcription = false
    this.notifyToggleTranscription()

    this._producers.forEach((producerInstance) => {
      producerInstance.stopTranscribe()
    })

    mixpanel.trackBackend({
      event: 'Transcription has been stopped ',
      properties: {
        name: this.name,
        meeting_id: this.meeting_id,
      },
    })
  }

  private notifyToggleTranscription() {
    notificationManager.broadcastEmit(
      'transcription:update',
      {
        status: this.transcription,
      },
      this,
    )
  }

  public sendTranscriptionMessage(data: ITranscriptionMessage) {
    this.peers.forEach((peer) => {
      if (peer.role >= this.helper.root.convertPermitToPermission(this.setting.view_transcription_permit)) {
        notificationManager.emit(peer.id, 'transcription:message', data)
      }
    })
  }

  /* End Transcription Methods */

  /* Start Encryption Methods */

  public startEncryption() {
    if (this._encrypted) {
      this.logger.error('Encryption is already started.').save()
      return
    }

    this._encrypted = true
    this.notifyToggleEncryption()
    this.logger.log('Encryption started.').save()
  }

  public stopEncryption() {
    if (!this._encrypted) {
      this.logger.error('Encryption is not started yet.').save()
      return
    }

    this._encrypted = false
    this.notifyToggleEncryption()
    this.logger.log('Encryption stopped.').save()
  }

  private notifyToggleEncryption() {
    notificationManager.broadcastEmit(
      'encryption:update',
      {
        status: this._encrypted,
      },
      this,
    )
  }

  /* End Encryption Methods */

  /* Start Migration Methods */

  private async getServerAvailable(sid: number) {
    return await mediaserverRepo.getServer(sid)
  }

  private notifyMigrate(target_sid: number, target_url: string) {
    notificationManager.broadcastEmit(
      'meeting:migrate',
      {
        main_sid: this._sid,
        target_sid,
        target_url,
      },
      this,
    )
  }

  public async migrate(targetServerId: number, targetServerUrl: string) {
    this.logger.log('Room is Migrating to another server.', { targetServerUrl }).save()

    const targetServer = await this.getServerAvailable(targetServerId)
    if (!targetServer) throw new Error('targetServer not Ready !')

    // free endpoint room
    const isEndpointAvailable = await mediaserverIntegration.getMediaServerRepoProxyData(
      'meeting.messaging',
      {
        method: 'meeting.messaging',
        input: {
          type: 'meeting:free',
          data: {
            meeting_hash: this._meeting_hash,
            main_sid: this._sid,
            prepareForMigration: true,
          },
        },
      },
      targetServerId,
    )

    if (!isEndpointAvailable) throw new Error('targetServer is Not Free ... retry again !')

    if (this._migrated) {
      this.logger.log('Room is already migrated, notifying the other server.', { migratedTo: this._migrated }).save()

      await mediaserverIntegration.getMediaServerRepoProxyData(
        'meeting.handleMigrateMeeting',
        {
          method: 'meeting.handleMigrateMeeting',
          input: {
            meeting_hash: this._meeting_hash,
            sid: targetServerId,
            url: targetServerUrl,
          },
        },
        this._migrated,
      )
    } else {
      this.handleMigrateMeeting(targetServerId, targetServerUrl)
    }
  }

  public handleMigrateMeeting(targetServerId: number, targetServerUrl: string) {
    if (this._migrated) throw new Error('Room is already migrated from this server.')

    // stop recording transcription first
    if (this.recording.size) {
      this.recording.forEach((recordingData, branch) => this.stopRecording({ id: recordingData.branchId, hash: branch }))
    }

    if (this.transcription) this.stopTranscription()

    // notify all for move
    this.notifyMigrate(targetServerId, targetServerUrl)

    const closeTime = Math.min(MS_ROOM_AUTO_CLOSE_MIN, 1)
    setTimeout(() => {
      this.forceClose(false, false)
      logger.info('Close 4')
    }, closeTime * 60_000)

    if (targetServerId === this._sid) {
      this._migrated = null
    } else {
      this._migrated = targetServerId
    }
  }

  /* End Migration Methods */

  /* Start Room Parameters GET-SET */

  get router() {
    return this._router
  }
  get setting() {
    return this._setting
  }
  set setting(roomSetting) {
    this.logger.log('Room Settings Updated', { ...roomSetting }).save()
    this._setting = roomSetting
  }
  get closed() {
    return this._closed
  }
  get sid() {
    return this._sid
  }
  get isLocal() {
    return this._isLocal
  }
  get meeting_hash() {
    return this._meeting_hash
  }
  get meeting_startedAt() {
    return this._meeting_startedAt
  }
  get meeting_id() {
    return this._meeting_id
  }
  get name() {
    return this._name
  }
  get producers() {
    return this._producers
  }
  get consumers() {
    return this._consumers
  }
  get peers() {
    return this._peers
  }
  get recording() {
    return this._recording
  }
  get transcription() {
    return this._transcription
  }
  get encrypted() {
    return this._encrypted
  }
  get encryptionKey() {
    return this._encryptionKey
  }
  get endedRecordings() {
    return this._endedRecordings
  }
  get migrated() {
    return this._migrated
  }
  get audioLevelObserver() {
    return this._audioLevelObserver
  }
  serializePeers() {
    const peers: MediaserverPeerObject[] = []
    this._peers.forEach((peer) => {
      peers.push(peer.toObject())
    })
    return peers
  }
  public generateProducersIdByBranch(branch = DefaultMediasoupBranch) {
    // get producers and filter it
    const producersId: MediaserverProducerCallbackObject[] = []
    this._producers.forEach((producer) => {
      if (!producer.kind) return
      if (producer.appData.branch.hash !== branch.hash) return
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

  public getProducersByBranch(branch: MediasoupBranch) {
    const producers: MediasoupProducer[] = []
    this._producers.forEach((producer) => {
      if (producer.appData.branch.hash !== branch.hash) return
      producers.push(producer)
    })
    return producers
  }

  getRtpCapabilities() {
    const { rtpCapabilities } = this._router
    return rtpCapabilities
  }
  toObject(branch = DefaultMediasoupBranch): MediaserverMeetingObject {
    const branchLocks: MediaserverMeetingObject['branchLocks'] = []
    this._locks.forEach((value, key) => {
      const keyParts = key.split(':')
      if (keyParts[0] === branch.hash && value) branchLocks.push(keyParts[1] as MediaSoupAppDataType)
    })

    return {
      id: this.meeting_hash,
      name: this.name,
      mode: this.mode,
      peers: this.serializePeers(),
      rtpCapabilities: this.getRtpCapabilities(),
      branchLocks,
      recordingStartedAt: this.recording.get(branch.hash)?.startedAt ?? null,
      transcription: this.transcription,
      encrypted: this.encrypted,
      encryptionKey: this.encryptionKey.key,
    }
  }

  /* End Room Parameters GET-SET */
}
