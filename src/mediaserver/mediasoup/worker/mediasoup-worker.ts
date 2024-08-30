import { createWorker } from 'mediasoup'
import { DeLogger } from '@app/lib/de-logger.js'
import { MediaSoupWorkerInstance } from '@mediaserver/mediasoup/mediasoup-types.js'
import mediaConfig from '@app/utility/config/media.config.js'
import { getMsCollector } from '@app/lib/promCollectors/mediaserver.prom.js'

const { worker: workerConfig } = mediaConfig.mediasoup

export default class MediasoupWorker {
  private _worker!: MediaSoupWorkerInstance
  private readonly logger: DeLogger = new DeLogger({ namespace: 'MediasoupWorker', tags: ['mediasoup', 'worker'] })
  public static readonly metrics = {
    count: getMsCollector<'gauge'>('worker_count'),
  }

  constructor(
    private readonly _minPort: number,
    private readonly _maxPort: number,
  ) {}

  get minPort() {
    return this._minPort
  }

  get maxPort() {
    return this._maxPort
  }

  get worker() {
    return this._worker
  }

  get closed() {
    return this._worker.closed
  }

  async init(): Promise<MediaSoupWorkerInstance> {
    // creating worker with media configs
    this._worker = await createWorker({
      logLevel: workerConfig.logLevel,
      logTags: workerConfig.logTags,
      rtcMinPort: this._minPort,
      rtcMaxPort: this._maxPort,
    })
    this.logger.log('[~] mediasoup worker created.', { minPort: this._minPort, maxPort: this._maxPort }).save()
    return this._worker
  }

  setupEvents() {
    this._worker.on('died', () => {
      // worker died !! lets create another
      this.logger.log('mediasoup worker died, creating new in 1 seconds...', { pid: this._worker.pid }).save()
      setTimeout(async () => {
        // create and replace worker after 1s;
        this.init()
      }, 1000)
    })
  }
}
