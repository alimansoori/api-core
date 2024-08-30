import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport.js'
import mediaConfig from '@app/utility/config/media.config.js'
import { DeLogger } from '@app/lib/de-logger.js'
import { MediaSoupDTLSState, MediaSoupWebRTCTransportInstance } from '@mediaserver/mediasoup/mediasoup-types.js'
import MediasoupRouter from '@mediaserver/mediasoup/router/mediasoup-router.js'
import {
  MediaCalibrateAction,
  MediaSoupDTLSParameters,
  MediaSoupMediaType,
} from '@app/shared-models/mediasoup-shared-types.js'

const { webRtcTransport: webRtcTransportConfig } = mediaConfig.mediasoup

export default class MediasoupRtcTransport {
  private static readonly webRtcTransportConfig = webRtcTransportConfig
  private readonly logger: DeLogger = new DeLogger({ namespace: 'RtcTransport', tags: ['transport'] })

  private _transport!: WebRtcTransport
  private _type: MediaSoupMediaType = MediaSoupMediaType.consume
  private _initialized: boolean = false
  private _currentMaxIncomingBitrate = webRtcTransportConfig.maxIncomingBitrate

  constructor(private _routerInstance: MediasoupRouter) {}

  public async init(type?: MediaSoupMediaType) {
    if (this._transport && !this._transport.closed) {
      this.logger.log('Warning... trying to init initialized transport.').save()
      return
    }

    if (type) this._type = type

    await this.createWebRtcTransport()
  }

  private async createWebRtcTransport(): Promise<MediaSoupWebRTCTransportInstance> {
    const { maxIncomingBitrate, initialAvailableOutgoingBitrate } = MediasoupRtcTransport.webRtcTransportConfig

    const transport = await this._routerInstance.router.createWebRtcTransport({
      listenIps: webRtcTransportConfig.listenIps,
      enableSctp: webRtcTransportConfig.enableSctp,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate,
    })

    try {
      await transport.setMaxIncomingBitrate(maxIncomingBitrate)
    } catch (error) {
      this.logger.error('error: transport:setMaxIncomingBitrate', { error }).save()
    }

    transport.on('dtlsstatechange', (dtlsState: MediaSoupDTLSState) => {
      if (dtlsState === 'closed') {
        try {
          this._initialized = false
          transport.close()
        } catch (error) {
          this.logger.error('error : transport:dtlsstatechange_closed', { error }).save()
        }
      }
    })
    this._transport = transport
    this._initialized = true
    this.logger.log('Transport created by id', { transportId: transport.id, type: this._type }).save()
    return transport
  }

  public async setMaxIncomingBitrate(maxBitrate: number) {
    try {
      await this.transport.setMaxIncomingBitrate(maxBitrate)
    } catch (error) {
      this.logger.log('error: transport:setMaxIncomingBitrate', { error }).save()
    }
  }

  public async connect(dtlsParameters: MediaSoupDTLSParameters) {
    await this._transport.connect({ dtlsParameters })
  }

  public async restart() {
    return await this._transport.restartIce()
  }

  public async calibrate(action: MediaCalibrateAction) {
    // deprecated [not working]
    const { maxIncomingBitrate } = MediasoupRtcTransport.webRtcTransportConfig

    const decBitrate = Math.max(Math.round(this._currentMaxIncomingBitrate / 10), 10) // minimum value is 10
    const incMaxBitrate = Math.min(this._currentMaxIncomingBitrate * 10, maxIncomingBitrate * 100)
    let apply = false

    switch (action) {
      case MediaCalibrateAction.inc:
        this._currentMaxIncomingBitrate = incMaxBitrate
        apply = true
        break
      case MediaCalibrateAction.dec:
        this._currentMaxIncomingBitrate = decBitrate
        apply = true
        break
      default:
        break
    }

    if (apply) {
      await this.transport.setMaxIncomingBitrate(this._currentMaxIncomingBitrate)
      this.logger
        .log('[Calibrate] Transport', {
          action,
          _currentMaxIncomingBitrate: this._currentMaxIncomingBitrate,
        })
        .save()
    }
  }

  public close() {
    this._transport.close()
  }

  get routerInstance() {
    return this._routerInstance
  }

  get transport() {
    return this._transport
  }

  get initialized() {
    return this._initialized
  }

  get closed() {
    return this._transport.closed
  }
}
