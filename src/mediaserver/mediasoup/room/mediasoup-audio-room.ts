import {
  MediaserverModeType,
  MediaSoupAppDataType,
  MediaSoupMediaType,
  MediaSoupShareableType,
} from '@app/shared-models/index.js'
import MediasoupPeer from '../peer/mediasoup-peer.js'
import MediasoupRouter from '../router/mediasoup-router.js'
import MediasoupRoom from './mediasoup-room.js'

export class MediasoupAudioRoom extends MediasoupRoom {
  public override readonly mode: MediaserverModeType = MediaserverModeType.audio
  constructor(
    _sid: number,
    _isLocal: boolean,
    _meeting_id: number,
    _meeting_hash: string,
    _meeting_startedAt: Date | null,
    _name: string,
    _router: MediasoupRouter,
  ) {
    super(_sid, _isLocal, _meeting_id, _meeting_hash, _meeting_startedAt, _name, _router)
  }

  override canProduce(type: MediaSoupAppDataType) {
    // only can produce mic type
    return type === MediaSoupShareableType.mic
  }

  override async setPeerTransportMaxIncomingBitrate(peer: MediasoupPeer, type: MediaSoupMediaType) {
    await peer.setTransportMaxIncomingBitrate(type, 0)
  }
}
