import os from 'os'
import { isDevelopment } from '@app/utility/helpers/index.js'
import {
  MediaSoupListenIp,
  MediaSoupWorkerLogLevel,
  MediaSoupWorkerLogTag,
} from '@mediaserver/mediasoup/mediasoup-types.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { MediaSoupRouterCodecs } from '@app/shared-models/mediasoup-shared-types.js'
const cpuCount = os.cpus().length
const ifaces = os.networkInterfaces()

const { MS_PORT, MS_MIN_PORT, MS_MAX_PORT, MS_ANNOUNCE_IP } = getConfigs()

const development = isDevelopment()

const getLocalIp = () => {
  let localIp = '127.0.0.1'
  if (!ifaces) return localIp
  Object.keys(ifaces).forEach((ifname) => {
    if (!ifname) return
    const ifacesList = ifaces[ifname] || []

    for (const iface of ifacesList) {
      if (!iface) continue

      // Ignore IPv6 and 127.0.0.1
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        continue
      }

      // Set the local ip to the first IPv4 address found and exit the loop
      localIp = iface.address
      return
    }
  })
  return localIp
}

interface WorkerConfigInterface {
  rtcMinPort: number
  rtcMaxPort: number
  logLevel: MediaSoupWorkerLogLevel
  logTags: MediaSoupWorkerLogTag[]
}

interface RouterConfigInterface {
  mediaCodecs: MediaSoupRouterCodecs
}

interface RtcConfigInterface {
  listenIps: MediaSoupListenIp[]
  enableSctp: boolean
  maxIncomingBitrate: number
  initialAvailableOutgoingBitrate: number
}

interface PlainConfigInterface {
  listenIp: MediaSoupListenIp
  rtcpMux: boolean
  comedia: boolean
}

interface MediasoupConfigInterface {
  numWorkers: number
  worker: WorkerConfigInterface
  router: RouterConfigInterface
  webRtcTransport: RtcConfigInterface
  plainRtpTransport: PlainConfigInterface
}

interface MediaConfigInterface {
  listenIp: string
  listenPort: number
  sslCrt: string
  sslKey: string
  mediasoup: MediasoupConfigInterface
}

// mediaserver configuration Here ... :)
const mediaConfig: MediaConfigInterface = {
  listenIp: '0.0.0.0',
  listenPort: MS_PORT,
  sslCrt: '../../ssl/cert.pem',
  sslKey: '../../ssl/key.pem',

  mediasoup: {
    // Worker settings
    numWorkers: cpuCount - 1, // leave one core free to work
    worker: {
      rtcMinPort: MS_MIN_PORT,
      rtcMaxPort: MS_MAX_PORT,
      logLevel: development ? 'debug' : 'none',
      logTags: development
        ? ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp', 'rtx', 'bwe', 'score', 'simulcast', 'svc']
        : [],
    },
    // Router settings
    router: {
      mediaCodecs: [
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2,
          preferredPayloadType: 111,
        },
        {
          kind: 'video',
          mimeType: 'video/VP9',
          clockRate: 90000,
          preferredPayloadType: 120,
          parameters: {
            'x-google-start-bitrate': 600,
          },
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          preferredPayloadType: 121,
          parameters: {
            'x-google-start-bitrate': 1000,
          },
        },
      ],
    },
    // WebRtcTransport settings
    webRtcTransport: {
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: MS_ANNOUNCE_IP || getLocalIp(),
        },
      ],
      enableSctp: false,
      maxIncomingBitrate: 2500000,
      initialAvailableOutgoingBitrate: 600000,
    },
    plainRtpTransport: {
      listenIp: { ip: '0.0.0.0', announcedIp: getLocalIp() },
      rtcpMux: true,
      comedia: false,
    },
  },
}

export default mediaConfig
