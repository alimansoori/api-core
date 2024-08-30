import { MediaserverModeType, MediaSoupMediaType } from '@app/shared-models/index.js'
import MediasoupRouter from '../router/mediasoup-router.js'
import MediasoupRoom from './mediasoup-room.js'

export class MediasoupWebinar extends MediasoupRoom {
  public override readonly mode: MediaserverModeType = MediaserverModeType.webinar
  constructor(
    _sid: number,
    _isLocal: boolean,
    _meeting_id: number,
    _meeting_hash: string,
    _meeting_startedAt: Date | null,
    _name: string,
    _router: MediasoupRouter,
    private _consumerRouters: MediasoupRouter[],
  ) {
    super(_sid, _isLocal, _meeting_id, _meeting_hash, _meeting_startedAt, _name, _router)
  }

  override getRouter(type: MediaSoupMediaType) {
    if (type === MediaSoupMediaType.produce) return this._router

    let router: MediasoupRouter | undefined
    this._consumerRouters.forEach((cRouter) => {
      const consumerSize = cRouter.appData.consumers.size
      if (consumerSize >= 500) return
      router = cRouter
    })

    if (!router) throw new Error('No Available Router !')
    return router
  }

  override async pipeProducer(producerId: string) {
    // pipe to all exists consumer Routers
    // hint : if routers are in same worker we don't need piping producers
    for (const cRouter of this._consumerRouters) {
      if (cRouter.closed) continue
      await this._router.pipeToRouter(producerId, cRouter)
    }
  }
}
