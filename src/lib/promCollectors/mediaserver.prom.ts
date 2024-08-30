import mediaConfig from '@app/utility/config/media.config.js'
import { container } from 'tsyringe'
import { PromCollectorItem, PromCollectorTypes, PromCollectorWithInstance } from './interfaces/prom.interface.js'
import PrometheusCollector from './prometheus.collector.js'

const PREFIX = 'ms_'

const prefixProm = (label: string) => `${PREFIX}${label}`

const msCollectorsData: PromCollectorItem<PromCollectorTypes>[] = [
  {
    id: 'worker_count',
    type: 'gauge',
    name: prefixProm('worker'),
    help: 'worker_count_of_mediaserver',
  },
  {
    id: 'router_count',
    type: 'gauge',
    name: prefixProm('router'),
    help: 'router_count_of_mediaserver',
  },
  {
    id: 'transport_count',
    type: 'gauge',
    name: prefixProm('transport'),
    help: 'transport_count_of_mediaserver',
  },
  {
    id: 'producer_count',
    type: 'gauge',
    name: prefixProm('producer'),
    help: 'producer_count_of_mediaserver',
  },
  {
    id: 'consumer_count',
    type: 'gauge',
    name: prefixProm('consumer'),
    help: 'consumer_count_of_mediaserver',
  },
  /* Room */
  {
    id: 'open_room_count',
    type: 'gauge',
    name: prefixProm('open_room'),
    help: 'open_room_count_of_mediaserver',
  },
  {
    id: 'cam_count',
    type: 'gauge',
    name: prefixProm('cam_count'),
    help: 'cam_count_count_of_mediaserver',
  },
  {
    id: 'mic_count',
    type: 'gauge',
    name: prefixProm('mic_count'),
    help: 'mic_count_count_of_mediaserver',
  },
  {
    id: 'screen_count',
    type: 'gauge',
    name: prefixProm('screen_count'),
    help: 'screen_count_count_of_mediaserver',
  },

  {
    id: 'peer_count',
    type: 'gauge',
    name: prefixProm('peer_count'),
    help: 'peer_count_count_of_mediaserver',
  },
  {
    id: 'producer_bitrate',
    type: 'gauge',
    name: prefixProm('producer_bitrate'),
    help: 'bitrate of producer in bit per second',
    labelNames: ['meetingHash', 'peerId', 'producerId', 'type'],
  },
  {
    id: 'producer_jitter',
    type: 'gauge',
    name: prefixProm('producer_jitter'),
    help: 'jitter of producer in milliseconds',
    labelNames: ['meetingHash', 'peerId', 'producerId', 'type'],
  },
  {
    id: 'producer_packet_loss',
    type: 'gauge',
    name: prefixProm('producer_packet_loss'),
    help: 'packet loss of producer in percentage',
    labelNames: ['meetingHash', 'peerId', 'producerId', 'type'],
  },
  {
    id: 'ffmpeg_process_cpu',
    type: 'gauge',
    name: prefixProm('ffmpeg_process_cpu'),
    help: 'cpu usage of ffmpeg process in percentage',
    labelNames: ['meetingHash', 'peerId', 'producerId', 'type', 'pid'],
  },
]

export const msCollectors: PromCollectorWithInstance<PromCollectorTypes>[] = []

export const getMsCollector = <T extends PromCollectorTypes>(id: string) => {
  return msCollectors.find((q) => q.id === id) as PromCollectorWithInstance<T>
}

export const mediaserverPromInit = () => {
  const { numWorkers } = mediaConfig.mediasoup

  for (let i = 0; i < numWorkers; i++) {
    msCollectorsData.push({
      id: `worker_cpu_${i}`,
      type: 'gauge',
      name: prefixProm(`worker_cpu_${i}`),
      help: `worker_cpu_usage_${i}`,
    })
    msCollectorsData.push({
      id: `worker_memory_${i}`,
      type: 'gauge',
      name: prefixProm(`worker_memory_${i}`),
      help: `worker_memory_usage_${i}`,
    })
  }

  const prom = container.resolve(PrometheusCollector)
  prom.init()

  msCollectorsData.forEach((t) => {
    msCollectors.push({ ...t, instance: prom.addRedisCollector(t.type, t.name, t.help, t.labelNames)! })
  })
}
