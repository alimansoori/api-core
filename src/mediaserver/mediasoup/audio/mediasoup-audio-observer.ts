import { DeLogger } from '@app/lib/de-logger.js'
import { MediaSoupAppData } from '@app/shared-models/index.js'
import {
  MediaSoupAudioLevelObserverInstance,
  MediaSoupAudioLevelObserverVolume,
  MediasoupPeerActivity,
} from '../mediasoup-types.js'
import MediasoupRoom from '../room/mediasoup-room.js'
import MediasoupRouter from '../router/mediasoup-router.js'

export default class MediasoupAudioLevelObserver {
  private _currentActivePeerId = ''
  private _lastTimestamp!: number

  private _audioLevelObserver!: MediaSoupAudioLevelObserverInstance

  // the key is peerId, first array element is activityCount and second is activityTime
  private _peersActivationHistory: { [key: string]: [number, number] } = {}

  private readonly logger: DeLogger = new DeLogger({ namespace: 'AudioLevelObserver', tags: ['audio-observer'] })
  public static readonly INTERVAL = 1000
  public static readonly THRESHOLD = -35
  public static readonly TRANSCRIPTION_INTERVAL = 25
  public static readonly TRANSCRIPTION_THRESHOLD = -90

  public constructor(private _room: MediasoupRoom) {
    this.logger.meta = { meeting_hash: _room.meeting_hash }
  }

  public async init(router: MediasoupRouter) {
    this._audioLevelObserver = await router.createAudioLevelObserver({
      interval: MediasoupAudioLevelObserver.INTERVAL,
      threshold: MediasoupAudioLevelObserver.THRESHOLD,
      maxEntries: 10,
    })

    this._audioLevelObserver.observer.on('close', () => {
      this.logger.log('Audio level observer closed', {}).save()
    })

    this.setVolumeListener()
    this.setSilenceListener()
  }

  public close() {
    this._audioLevelObserver.close()
  }

  public async addProducer(producerId: string) {
    try {
      await this._audioLevelObserver.addProducer({ producerId })
    } catch (error) {
      this.logger.error('failed to add producer to audio level observer', { error }).save()
    }
  }

  private setVolumeListener() {
    this._audioLevelObserver.on('volumes', async (volumes: MediaSoupAudioLevelObserverVolume[]) => {
      const { producer } = volumes[0]
      const { peerId } = producer.appData as MediaSoupAppData

      if (peerId) {
        this.becomeActive(peerId)
      }
    })
  }

  private becomeActive(peerId: string) {
    if (this._currentActivePeerId !== peerId) {
      // new peer start speaking ...
      this._lastTimestamp = new Date().getTime() // start time of peer
      this.becomeInActive(this._currentActivePeerId) // save prev peer
    }

    this._currentActivePeerId = peerId // update speaker
  }

  public becomeInActive(peerId: string) {
    if (!peerId) return

    const time = new Date().getTime() - this._lastTimestamp

    if (!this._peersActivationHistory[peerId]) this._peersActivationHistory[peerId] = [0, 0]
    this._peersActivationHistory[peerId][0]++
    this._peersActivationHistory[peerId][1] += time / 1000
  }

  public getActivityHistoryList(excludeId: string[] = []): MediasoupPeerActivity[] {
    const historyList = Object.entries(this._peersActivationHistory)
      .map(([peerId, history]) => {
        return {
          peerId,
          voiceActivityHistory: {
            activityCount: history[0],
            activityTime: Math.round(history[1] * 1e2) / 1e2,
          },
        }
      })
      .filter((item) => item.voiceActivityHistory.activityTime > 0)
      .filter((item) => !excludeId.includes(item.peerId))
      .sort((a, b) => {
        const diff = a.voiceActivityHistory.activityTime - b.voiceActivityHistory.activityTime
        return diff === 0 ? a.voiceActivityHistory.activityCount - b.voiceActivityHistory.activityCount : diff
      })

    return historyList
  }

  private setSilenceListener() {
    this._audioLevelObserver.on('silence', async () => {
      this.becomeInActive(this._currentActivePeerId)
      this._currentActivePeerId = ''
    })
  }

  get roomId() {
    return this._room.meeting_hash
  }
}
