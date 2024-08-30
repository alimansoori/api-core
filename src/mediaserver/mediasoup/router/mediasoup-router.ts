import mediaConfig from '@app/utility/config/media.config.js'
import { DeLogger } from '@app/lib/de-logger.js'
import {
  MediaSoupPlainTransportOptions,
  MediaSoupProducerInstance,
  MediaSoupConsumerInstance,
  MediaSoupRouterInstance,
  MediaSoupWorkerInstance,
  MediaSoupAudioLevelObserverOptions,
} from '@mediaserver/mediasoup/mediasoup-types.js'
import MediasoupWorker from '@mediaserver/mediasoup/worker/mediasoup-worker.js'
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport.js'

const { router: routerConfigs } = mediaConfig.mediasoup

export type MediaSoupRouterAppData = {
  transports: Map<string, WebRtcTransport>
  producers: Map<string, MediaSoupProducerInstance>
  consumers: Map<string, MediaSoupConsumerInstance>
  worker: MediaSoupWorkerInstance
}

export default class MediasoupRouter {
  private static readonly mediaCodecs = routerConfigs.mediaCodecs
  private readonly logger: DeLogger = new DeLogger({ namespace: 'MediasoupRouter', tags: ['mediasoup', 'router'] })

  private _router!: MediaSoupRouterInstance

  constructor(private _workerInstance: MediasoupWorker) {}

  get workerInstance() {
    return this._workerInstance
  }

  get workerPid() {
    return this._workerInstance.worker.pid
  }

  get router() {
    return this._router
  }

  get rtpCapabilities() {
    return this._router.rtpCapabilities
  }

  get closed() {
    return this._router.closed
  }

  get appData() {
    return this._router.appData as MediaSoupRouterAppData
  }

  public async createRouter(): Promise<MediaSoupRouterInstance> {
    const router = await this.workerInstance.worker.createRouter({
      mediaCodecs: MediasoupRouter.mediaCodecs,
    })
    this.logger.log('Mediasoup Router created', { routerId: router.id }).save()
    this._router = router
    return router
  }

  public async createPlainTransport(options: MediaSoupPlainTransportOptions) {
    return await this._router.createPlainTransport(options)
  }

  public async pipeToRouter(producerId: string, routerInstance: MediasoupRouter) {
    if (this.workerPid === routerInstance.workerPid) return false
    if (this._router.id === routerInstance._router.id) return false
    await this._router.pipeToRouter({ producerId, router: routerInstance.router })
    return true
  }

  public async createAudioLevelObserver(options?: MediaSoupAudioLevelObserverOptions) {
    return await this.router.createAudioLevelObserver(options)
  }
}
