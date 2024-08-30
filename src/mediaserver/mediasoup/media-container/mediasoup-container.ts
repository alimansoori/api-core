import { version as mediasoupVersion, observer as mediasoupObserver } from 'mediasoup'
import pidusage from 'pidusage'
import mediaConfig from '@app/utility/config/media.config.js'
import { DeLogger } from '@app/lib/de-logger.js'
import MediasoupRoom from '@mediaserver/mediasoup/room/mediasoup-room.js'
import MediasoupRouter from '@mediaserver/mediasoup/router/mediasoup-router.js'
import MediasoupWorker from '@mediaserver/mediasoup/worker/mediasoup-worker.js'
import { container, inject, singleton } from 'tsyringe'
import MediasoupRtcTransport from '../rtc-transport/mediasoup-rtc-transport.js'
import { MediasoupWebinar } from '../room/mediasoup-webinar.js'
import { DefaultMediasoupBranch, IMeetingStatus, LOCATION_KEY, MediaserverModeType } from '@app/shared-models/index.js'
import { MediasoupAudioRoom } from '../room/mediasoup-audio-room.js'
import PrometheusCollector from '@app/lib/promCollectors/prometheus.collector.js'
import { clearInterval } from 'timers'
import { getMsCollector } from '@app/lib/promCollectors/mediaserver.prom.js'
import { logger } from '@app/lib/logger.js'
import MediaserverRepository from '@app/database/entities/mediaserver/mediaserver.repo.js'
import MediaserverIntegration from '@app/lib/integrations/mediaServer/mediaserver.integration.js'

const { numWorkers, worker: workerConfig, webRtcTransport } = mediaConfig.mediasoup
const mediaserverIntegration = container.resolve(MediaserverIntegration)

@singleton()
export class MediasoupContainer {
  private static smallestLoad = 1000000
  private static WEBINAR_MODE_CONSUMER_WORKERS_NUM = 2
  private static readonly numWorkers = numWorkers
  private readonly logger: DeLogger = new DeLogger({ namespace: 'MediasoupContainer', tags: ['mediasoup'] })

  /* Media Workers Store */
  static workers: MediasoupWorker[] = []
  static nextWorkerIdx = -1

  /* Media Rooms Store */
  private rooms = new Map<string, MediasoupRoom>()

  constructor(
    @inject(PrometheusCollector) private promCollector: PrometheusCollector,
    @inject(MediaserverRepository) private mediaserverRepo: MediaserverRepository,
    @inject(MediaserverIntegration) private mediaserverIntegration: MediaserverIntegration,
  ) {
    this.init()
  }

  private async init() {
    DeLogger.startDumpTimeout()

    this.setupMediasoupObserver() // default observers

    await this.createWorkers()
    await this.loadPreviousRooms()
  }

  public async loadPreviousRooms() {
    // get all rooms as key-values from redis
    const rooms = await this.mediaserverRepo.getMediaServerRooms()

    const onlineRooms = rooms.filter(({ value }) => value?.isClosed === false)

    for (const room of onlineRooms) {
      const meeting_id = +room.key.split(':')[2]
      if (isNaN(meeting_id)) logger.error(`Not a number meeting_id : ${meeting_id}`)

      this.logger.log('Reopening previous room', { meeting_id })

      const meeting = await this.mediaserverRepo.getMeetingById(meeting_id, [
        'attendees',
        'workspace',
        'meeting_location',
        'meeting_location.location',
        'server',
        'meeting_recording',
      ])
      if (!meeting?.server_id || meeting.status !== IMeetingStatus.LIVE) continue

      const mediaRoom = await this.createRoom(meeting, meeting.workspace.server_id)
      const hasRecording = meeting.meeting_recording?.find((recording) => !recording.recording_end_time)

      if (hasRecording) {
        mediaserverIntegration.emitMessage(
          'recording:stopped',
          {
            meeting_id: meeting.meeting_id,
            stopped_at: Date.now(),
            hash: hasRecording.meeting_recording_hash,
          },
          mediaRoom,
        )
      }

      this.logger.log('Reopened previous room successfully', { meeting_id })
    }
  }

  public getRoom(meeting_hash: string) {
    return this.rooms.get(meeting_hash)
  }

  private async removeRoom(meeting_hash: string) {
    this.rooms.delete(meeting_hash)
  }

  public freeRoom(meeting_hash: string) {
    const room = this.getRoom(meeting_hash)

    if (room && !room.closed) {
      room.forceClose(false, false)
      logger.info('Close 2')
    }

    this.removeRoom(meeting_hash)
  }

  public async createRoom(
    meeting: NonNullable<AwaitedReturn<MediaserverRepository['getMeetingById']>>,
    main_sid: number,
    prepareForMigration = false,
  ) {
    let meetingMode: MediaserverModeType = MediaserverModeType.normal

    switch (meeting.meeting_location?.location?.key) {
      case LOCATION_KEY.uni_meet_webinar:
        meetingMode = MediaserverModeType.webinar
        break
      case LOCATION_KEY.uni_meet_audio:
        meetingMode = MediaserverModeType.audio
        break

      default:
        break
    }

    let room: MediasoupRoom | MediasoupAudioRoom | MediasoupWebinar
    const worker = this.getWorker()

    if (!worker) {
      this.logger.log('warning... [createRoom] no worker found for create router!').save()
      throw new Error('Worker Not Found !')
    }

    const router = await this.createRouter(worker)

    switch (meetingMode) {
      case MediaserverModeType.webinar: {
        const consumerWorkers: MediasoupWorker[] = []

        for (let i = 0; i < MediasoupContainer.WEBINAR_MODE_CONSUMER_WORKERS_NUM; i++) {
          const cWorker = this.getWorker()
          if (cWorker) consumerWorkers.push(cWorker)
        }

        const consumerRouters = await Promise.all(consumerWorkers.map(async (cWorker) => this.createRouter(cWorker)))
        room = new MediasoupWebinar(
          main_sid,
          main_sid === meeting.server_id,
          meeting.meeting_id,
          meeting.meeting_hash,
          meeting.started_at,
          meeting.name,
          router,
          consumerRouters,
        )
        break
      }

      case MediaserverModeType.audio: {
        room = new MediasoupAudioRoom(
          main_sid,
          main_sid === meeting.server_id,
          meeting.meeting_id,
          meeting.meeting_hash,
          meeting.started_at,
          meeting.name,
          router,
        )
        break
      }

      default: {
        room = new MediasoupRoom(
          main_sid,
          main_sid === meeting.server_id,
          meeting.meeting_id,
          meeting.meeting_hash,
          meeting.started_at,
          meeting.name,
          router,
        )
        break
      }
    }

    this.rooms.set(meeting.meeting_hash, room)
    await this.mediaserverRepo.setMediaServerRoom(meeting.meeting_id, { isClosed: false })

    // set default settings
    room.setting = {
      presentation: meeting.enable_presentation_permit,
      view_transcription_permit: meeting.view_transcription_permit,
    }

    if (!prepareForMigration && meeting.server_id !== main_sid) {
      const { isLocal } = await this.mediaserverIntegration.getAddressFromServer(meeting.server_id!)

      if (!isLocal) {
        room.migrate(meeting.server!.server_id, meeting.server!.url)
      }
    }

    if (meeting.is_e2ee) {
      room.startEncryption()
    }

    if (meeting.is_cloud_recording_autostart) {
      // set a delay to make sure meeting is completely started
      setTimeout(() => {
        room.startRecording(DefaultMediasoupBranch)
      }, 1000)
    }

    if (meeting.is_transcription_autostart) {
      // set a delay to make sure meeting is completely started
      setTimeout(() => {
        room.startTranscription()
      }, 1000)
    }

    return room
  }

  public async createWorkers() {
    const portInterval = Math.floor((workerConfig.rtcMaxPort - workerConfig.rtcMinPort) / MediasoupContainer.numWorkers)

    if (MediasoupContainer.workers.length) {
      this.logger
        .log('Warning ... there is some workers already', { workersCount: MediasoupContainer.workers.length })
        .save()
    }

    for (let i = 0; i < MediasoupContainer.numWorkers; i++) {
      // create workers count of num workers
      const min = workerConfig.rtcMinPort + i * portInterval
      const max =
        i === MediasoupContainer.numWorkers - 1
          ? workerConfig.rtcMaxPort
          : workerConfig.rtcMinPort + (i + 1) * portInterval - 1
      const workerInstance = new MediasoupWorker(min, max)

      try {
        const w = await workerInstance.init()
        await this.promCollector.incGauge(getMsCollector<'gauge'>('worker_count')?.instance)

        w.appData.interval = setInterval(async () => {
          pidusage(
            w.pid,
            async (
              err: Error | undefined,
              stats: {
                cpu: number
                memory: number
              },
            ) => {
              if (err) return
              await this.promCollector.setGauge(getMsCollector<'gauge'>(`worker_cpu_${i}`)?.instance, stats.cpu)
              await this.promCollector.setGauge(getMsCollector<'gauge'>(`worker_memory_${i}`)?.instance, stats.memory)
            },
          )
        }, 10_000)

        w.on('died', async () => {
          if (typeof w.appData.interval === 'number') {
            clearInterval(w.appData.interval)
          }

          await this.promCollector.decGauge(getMsCollector<'gauge'>('worker_count')?.instance)
          MediasoupContainer.workers = MediasoupContainer.workers.filter((q) => q.worker.pid !== w.pid)
        })
        MediasoupContainer.workers.push(workerInstance)
      } catch (error) {
        this.logger.error('Error creating Worker', { error }).save()
      }
    }
  }

  public getWorker(): MediasoupWorker | undefined {
    MediasoupContainer.nextWorkerIdx++
    if (MediasoupContainer.nextWorkerIdx > MediasoupContainer.workers.length - 1) MediasoupContainer.nextWorkerIdx = 0

    let selectedWorkerIndex = MediasoupContainer.nextWorkerIdx
    let selectedWorker = MediasoupContainer.workers[selectedWorkerIndex]
    // Find leastLoad Worker
    MediasoupContainer.workers.forEach((workerInstance, index) => {
      const workerLoad = this.getWorkerTransportsCount(workerInstance)

      if (workerLoad < MediasoupContainer.smallestLoad && !workerInstance.closed) {
        MediasoupContainer.smallestLoad = workerLoad
        selectedWorker = workerInstance
        selectedWorkerIndex = index
        MediasoupContainer.nextWorkerIdx = index + 1
        if (MediasoupContainer.nextWorkerIdx === MediasoupContainer.workers.length) MediasoupContainer.nextWorkerIdx = 0
      }
    })

    this.logger
      .log('smallest worker selected', { selectedWorkerIndex, workersCount: MediasoupContainer.workers.length })
      .save()

    return selectedWorker
  }

  private getWorkerTransportsCount(workerInstance: MediasoupWorker) {
    const workerTransports = workerInstance.worker.appData.transports as Map<string, MediasoupRtcTransport>
    return workerTransports.size
  }

  public getWorkers(): MediasoupWorker[] {
    return MediasoupContainer.workers
  }

  public async createRouter(workerInstance: MediasoupWorker): Promise<MediasoupRouter> {
    const routerInstance = new MediasoupRouter(workerInstance)
    await routerInstance.createRouter()
    return routerInstance
  }

  private setupMediasoupObserver() {
    this.logger.log('|------> Mediasoup Library Ready', { mediasoupVersion, listenIps: webRtcTransport.listenIps }).save()
    mediasoupObserver.on('newworker', async (worker) => {
      worker.appData.routers = new Map()
      worker.appData.transports = new Map()
      worker.appData.producers = new Map()
      worker.appData.consumers = new Map()

      worker.observer.on('newrouter', async (router) => {
        router.appData.transports = new Map()
        router.appData.producers = new Map()
        router.appData.consumers = new Map()
        router.appData.worker = worker

        if (worker.appData.routers instanceof Map) {
          worker.appData.routers.set(router.id, router)
          await this.promCollector.incGauge(getMsCollector<'gauge'>('router_count')?.instance)
        }

        router.observer.on('close', async () => {
          if (worker.appData.routers instanceof Map) {
            worker.appData.routers.delete(router.id)
            await this.promCollector.decGauge(getMsCollector<'gauge'>('router_count')?.instance)
          }
        })

        router.observer.on('newtransport', async (transport) => {
          transport.appData.producers = new Map()
          transport.appData.consumers = new Map()
          transport.appData.dataProducers = new Map()
          transport.appData.router = router

          if (router.appData.transports instanceof Map) {
            router.appData.transports.set(transport.id, transport)
            await this.promCollector.incGauge(getMsCollector<'gauge'>('transport_count')?.instance)
          }

          transport.observer.on('close', async () => {
            if (router.appData.transports instanceof Map) {
              router.appData.transports.delete(transport.id)
              await this.promCollector.decGauge(getMsCollector<'gauge'>('transport_count')?.instance)
            }
          })

          transport.observer.on('newproducer', async (producer) => {
            producer.appData.transport = transport

            if (transport.appData.producers instanceof Map) {
              transport.appData.producers.set(producer.id, producer)
              await this.promCollector.incGauge(getMsCollector<'gauge'>('producer_count')?.instance)
            }

            if (router.appData.producers instanceof Map) {
              router.appData.producers.set(producer.id, producer)
            }

            if (worker.appData.producers instanceof Map) {
              worker.appData.producers.set(producer.id, producer)
            }

            producer.observer.on('close', async () => {
              if (transport.appData.producers instanceof Map) {
                transport.appData.producers.delete(producer.id)
                await this.promCollector.decGauge(getMsCollector<'gauge'>('producer_count')?.instance)
              }

              if (router.appData.producers instanceof Map) {
                router.appData.producers.delete(producer.id)
              }

              if (worker.appData.producers instanceof Map) {
                worker.appData.producers.delete(producer.id)
              }
            })
          })

          transport.observer.on('newconsumer', async (consumer) => {
            consumer.appData.transport = transport

            if (transport.appData.consumers instanceof Map) {
              transport.appData.consumers.set(consumer.id, consumer)
              await this.promCollector.incGauge(getMsCollector<'gauge'>('consumer_count')?.instance)
            }

            if (router.appData.consumers instanceof Map) {
              router.appData.consumers.set(consumer.id, consumer)
            }

            if (worker.appData.consumers instanceof Map) {
              worker.appData.consumers.set(consumer.id, consumer)
            }

            consumer.observer.on('close', async () => {
              if (transport.appData.consumers instanceof Map) {
                transport.appData.consumers.delete(consumer.id)
                await this.promCollector.decGauge(getMsCollector<'gauge'>('consumer_count')?.instance)
              }

              if (router.appData.consumers instanceof Map) {
                router.appData.consumers.delete(consumer.id)
              }

              if (worker.appData.consumers instanceof Map) {
                worker.appData.consumers.delete(consumer.id)
              }
            })
          })
        })
      })
    })
  }
}
