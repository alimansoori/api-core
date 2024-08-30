import { DeLogger } from '@app/lib/de-logger.js'
import {
  MediaSoupAppData,
  MediaSoupKindEnum,
  MediaSoupMediaType,
  MediaSoupRTPParameters,
} from '@app/shared-models/mediasoup-shared-types.js'
import MediasoupRtcMedia from '@mediaserver/mediasoup/rtc-media/mediasoup-rtc-media.js'
import MediasoupRtcTransport from '@mediaserver/mediasoup/rtc-transport/mediasoup-rtc-transport.js'
import { MediaSoupAudioLevelObserverInstance, MediaSoupProducerInstance } from '../mediasoup-types.js'
import FFMPEG from '@app/mediaserver/recording/ffmpeg.js'
import MediasoupAudioLevelObserver from '../audio/mediasoup-audio-observer.js'
import MediasoupPeer from '../peer/mediasoup-peer.js'
import { MediaRecordParameters } from '@app/mediaserver/recording/interfaces/mediaRecordingInterfaces.js'
import { GStreamer } from '@app/mediaserver/recording/gstreamer.js'
import { logger } from '@app/lib/logger.js'
import { getConfigs } from '@app/lib/config.validator.js'
import PortManager from '@app/mediaserver/recording/port-manager.js'
import mediaConfig from '@app/utility/config/media.config.js'
import { container } from 'tsyringe'
import { TranscriptionLogDumper } from '@app/lib/logDumper/LogTranscription/index.js'
import { TRANSCRIPTION_ENGINE } from '@prisma/client'
import { getMsCollector } from '@app/lib/promCollectors/mediaserver.prom.js'
import PrometheusCollector from '@app/lib/promCollectors/prometheus.collector.js'

const promCollector = container.resolve(PrometheusCollector)

export default class MediasoupProducer extends MediasoupRtcMedia {
  static readonly TRANSCRIPTION_MAX_SILENCE_TIMES = 7
  private readonly logger: DeLogger = new DeLogger({ namespace: 'Producer', tags: ['producer'] })
  private transcriptionLogDumper = container.resolve(TranscriptionLogDumper)
  protected _producer!: MediaSoupProducerInstance
  protected _room = this.peer.room
  statsLabels: Record<string, string> = {}
  statsInterval: NodeJS.Timeout | null = null
  actionFiredByPeerId: string | null = null
  restartWithCodec: 'vp8' | 'vp9' | null = null

  recording: {
    parameters: MediaRecordParameters
    process?: FFMPEG | GStreamer
  } | null = null
  transcription: {
    parameters: MediaRecordParameters
    process?: FFMPEG
    processedFiles: Set<string>
    initialVolumeLevel: number | null
    initialVolumeTime: Date | null
    restartDelaySteps: number
    texts: Map<TRANSCRIPTION_ENGINE, string[]>
    audioLevelObserver: MediaSoupAudioLevelObserverInstance
  } | null = null

  constructor(
    _rtcTransportInstance: MediasoupRtcTransport,
    protected _peer: MediasoupPeer,
  ) {
    super(_rtcTransportInstance, MediaSoupMediaType.produce)
    this.logger.meta = { meeting_hash: this.room.meeting_hash, peerId: this.peer.id }
  }
  get producer() {
    return this._producer
  }
  get producerId() {
    return this._producer.id
  }
  get peer() {
    return this._peer
  }
  get room() {
    return this._room
  }

  async produce(
    rtpParameters: MediaSoupRTPParameters,
    kind: MediaSoupKindEnum,
    appData: MediaSoupAppData,
    isPaused = false,
  ): Promise<MediaSoupProducerInstance> {
    this._producer = await this._rtcTransportInstance.transport.produce({
      kind,
      rtpParameters,
      appData,
      paused: isPaused,
    })
    this.logger.meta = { ...this.logger.meta, producerId: this._producer.id }
    this.statsLabels = {
      meetingHash: this.room.meeting_hash,
      peerId: this.peerId,
      producerId: this.producerId,
      type: appData.type,
    }

    // remove event emitter limit
    this._producer.setMaxListeners(0)

    this._producer.on('score', async (scores) => {
      if (scores.length) {
        if (this.score !== scores[0].score) {
          this._score = scores[0].score
          this.peer.calculateProducersAverageScore()
        }

        this._prevOverall = this._overall
        this._overall = this.scoreToOverall(scores[0].score)
      }
    })

    this.setPromStats()

    this.scalabilityMode =
      (this._producer.rtpParameters.encodings?.find((encoding) => encoding.scalabilityMode)?.scalabilityMode as
        | 'L1T3'
        | 'L3T3'
        | null) || null

    this.codec =
      (this._producer.rtpParameters.codecs[0]?.mimeType.split('/')[1]?.toLowerCase() as 'opus' | 'vp8' | 'vp9' | null) ||
      null

    return this._producer
  }

  close(firedByPeerId?: string, restartWithCodec?: 'vp8' | 'vp9') {
    if (firedByPeerId) this.actionFiredByPeerId = firedByPeerId
    if (restartWithCodec) this.restartWithCodec = restartWithCodec
    this._close()
  }

  pause(firedByPeerId?: string) {
    if (firedByPeerId) this.actionFiredByPeerId = firedByPeerId
    this._pause()

    if (this.recording?.process?.isRunning) {
      this.recording?.process.kill()
    }

    if (this.transcription?.process?.isRunning) {
      this.transcription?.process.kill()
      this.transcription.initialVolumeLevel = null
      this.transcription.initialVolumeTime = null
      this.transcription.restartDelaySteps = 0
      this.transcription.texts.clear()
    }
  }

  resume() {
    if (this.actionFiredByPeerId) this.actionFiredByPeerId = null
    this._resume()

    if (
      this.room.recording.get(this.producer.appData.branch.hash) &&
      this.recording &&
      (!this.recording.process || this.recording.process.isRunning === false)
    ) {
      this.recording.process = this.startFFMPEGProcess()
    }

    if (
      this.room.transcription &&
      this.transcription &&
      (!this.transcription.process || this.transcription.process.isRunning === false)
    ) {
      this.transcription.process = this.startFFMPEGProcess(true)
    }
  }

  public async getStats() {
    return await this._producer.getStats()
  }

  public startFFMPEGProcess(transcription = false) {
    const ffmpegInstance = new FFMPEG(
      this.room,
      this,
      transcription ? this.transcription!.parameters : this.recording!.parameters,
      transcription,
    )
    ffmpegInstance.process()

    return ffmpegInstance
  }

  private startGStreamerProcess(transcription = false) {
    const gStreamer = new GStreamer(
      this.room,
      this,
      transcription ? this.transcription!.parameters : this.recording!.parameters,
      transcription,
    )
    gStreamer.process()

    return gStreamer
  }

  private async createRecordParameters() {
    const transportConfig = mediaConfig.mediasoup.plainRtpTransport

    if (getConfigs().MEDIASERVER_RECORD_PROCESS === 'gstreamer') {
      transportConfig.rtcpMux = false
    }

    const plainTransport = await this.room.router.createPlainTransport(transportConfig)

    // await plainTransport.setMaxIncomingBitrate(0);

    const portManager = new PortManager(this)
    const rtpPort = await portManager.takePort(true)

    // if rtcpMux disabled we need rtcp Port for connection
    const rtcpPort = transportConfig.rtcpMux ? undefined : await portManager.takePort()

    // connect plain receiver transport
    await plainTransport.connect({
      ip: '127.0.0.1',
      port: rtpPort,
      rtcpPort,
    })

    plainTransport.observer.on('close', () => {
      portManager.releasePort(rtpPort)
      if (rtcpPort) portManager.releasePort(rtcpPort)
    })

    const { rtpCapabilities } = this.room.router
    const codecs = rtpCapabilities.codecs?.filter((codec: any) => codec.kind === this.kind)

    const plainRtpConsumer = await plainTransport.consume({
      producerId: this.producerId,
      rtpCapabilities: { codecs },
      paused: true,
    })

    // uncomment only for debugging purposes:
    // plainRtpConsumer.enableTraceEvent(['keyframe']);
    // plainRtpConsumer.addListener('trace', async (trace) => {
    //   console.log('trace', trace);
    // });

    plainRtpConsumer.setMaxListeners(0)
    await plainRtpConsumer.setPriority(255)
    await plainRtpConsumer.setPreferredLayers({ spatialLayer: 3, temporalLayer: 1 })

    const recordParameters: MediaRecordParameters = {
      user_id: this.peer.user_id,
      kind: this.kind as MediaSoupKindEnum,
      type: this.appDataType,
      remoteRtpPort: rtpPort,
      remoteRtcpPort: rtcpPort,
      localRtcpPort: plainTransport.rtcpTuple ? plainTransport.rtcpTuple.localPort : undefined,
      plainRtpConsumer,
      plainTransport,
    }

    // sometimes ffmpeg receive no start marker for videos, so we need to put a little delay.
    setTimeout(
      async () => {
        try {
          await plainRtpConsumer.resume()
          await plainRtpConsumer.requestKeyFrame()
        } catch (error) {
          this.logger.error('plainRtpConsumer Resume Error.', { error }).save()
        }
      },
      this.kind === MediaSoupKindEnum.video ? 500 : 0,
    )

    this.producer.observer.on('close', async () => {
      try {
        plainTransport.close()
        // Release Ports if still listening
      } catch (error) {
        this.logger.error('plainTransport close Error.', { error }).save()
      }
    })

    return recordParameters
  }

  public async record() {
    if (!this.room.recording.get(this.producer.appData.branch.hash) || this.closed) {
      this.logger.error('Recording is not started or producer is closed.').save()
      return
    }

    if (this.recording?.process?.isRunning) {
      logger.warning('recordProducer :: recordingInstance is already existed and running.')
      this.recording.process.kill()
    }

    this.recording = {
      parameters: await this.createRecordParameters(),
    }

    if (this.paused) return

    this.recording.process = this.startFFMPEGProcess()

    this.logger.log('Recording started.').save()
  }

  async stopRecord() {
    if (!this.recording) return

    if (this.recording.process?.isRunning) {
      this.recording.process.kill()
    }

    if (!this.recording.parameters.plainTransport.closed) {
      const plainTransport = this.recording.parameters.plainTransport
      setTimeout(() => {
        plainTransport.close()
      }, 500)
    }

    this.recording = null

    this.logger.log('Recording stopped.').save()
  }

  async transcribe() {
    if (!this.room.transcription || this.room.encrypted || this.closed || this.kind !== MediaSoupKindEnum.audio) {
      return
    }

    if (this.transcription?.process?.isRunning) {
      logger.warning('transcribe :: transcriptionInstance is already existed and running.')
      this.transcription.process.kill()
    }

    this.transcription = {
      parameters: await this.createRecordParameters(),
      audioLevelObserver: await this.room.router.createAudioLevelObserver({
        interval: MediasoupAudioLevelObserver.TRANSCRIPTION_INTERVAL,
        threshold: MediasoupAudioLevelObserver.TRANSCRIPTION_THRESHOLD,
        maxEntries: 1,
      }),
      processedFiles: new Set(),
      initialVolumeLevel: null,
      initialVolumeTime: null,
      restartDelaySteps: 0,
      texts: new Map(),
    }

    this.transcription.audioLevelObserver.on('volumes', (volumes) => {
      if (this.transcription && volumes.length) {
        const currentVolume = volumes[0].volume
        const now = new Date()
        this.transcriptionLogDumper.log({ ...this.logger.meta, currentVolume }, 'Audio observer currentVolume received.')

        if (!this.transcription.initialVolumeLevel && Math.abs(currentVolume) <= 35) {
          this.transcription.initialVolumeLevel = currentVolume
          this.transcription.initialVolumeTime = now

          this.transcriptionLogDumper.log(
            { ...this.logger.meta, initialVolumeLevel: currentVolume },
            'Audio observer initialVolumeLevel set.',
          )
        } else if (
          this.transcription.initialVolumeLevel &&
          Math.abs(currentVolume - this.transcription.initialVolumeLevel) >= 15 &&
          this.transcription.initialVolumeTime &&
          now.getTime() - this.transcription.initialVolumeTime?.getTime() > 800
        ) {
          if (this.transcription.restartDelaySteps < 3) {
            this.transcription.restartDelaySteps += 1
            this.transcriptionLogDumper.log(
              { ...this.logger.meta, initialVolumeLevel: this.transcription.restartDelaySteps },
              'Audio observer restartDelaySteps incremented.',
            )
          } else {
            this.transcription.process?.kill()
            this.transcription.process = this.startFFMPEGProcess(true)

            this.transcription.initialVolumeLevel = null
            this.transcription.initialVolumeTime = null
            this.transcription.restartDelaySteps = 0

            this.transcriptionLogDumper.log({ ...this.logger.meta }, 'Audio observer restarted FFMPEG process.')
          }
        }
      }
    })

    await this.transcription.audioLevelObserver.addProducer({ producerId: this.producerId })

    if (this.paused) return

    this.transcription.process = this.startFFMPEGProcess(true)

    this.logger.log('Transcription started.').save()
  }

  async stopTranscribe() {
    if (!this.transcription) return

    if (this.transcription.process?.isRunning) {
      this.transcription.process.kill()
    }

    this.transcription.audioLevelObserver.close()

    if (!this.transcription.parameters.plainTransport.closed) {
      const plainTransport = this.transcription.parameters.plainTransport
      setTimeout(() => {
        plainTransport.close()
      }, 500)
    }

    this.transcription = null

    this.logger.log('Transcription stopped.').save()
  }

  async setPromStats() {
    this.statsInterval = setInterval(async () => {
      if (this.closed) {
        this.unsetPromStats()
        return
      }

      try {
        const producerStats = (await this.getStats())[0]

        promCollector.setGauge(
          getMsCollector<'gauge'>('producer_bitrate')?.instance,
          producerStats.bitrate,
          this.statsLabels,
        )

        promCollector.setGauge(
          getMsCollector<'gauge'>('producer_jitter')?.instance,
          producerStats.jitter,
          this.statsLabels,
        )

        // this is the percentage of packet loss
        promCollector.setGauge(
          getMsCollector<'gauge'>('producer_packet_loss')?.instance,
          (producerStats.packetsLost / producerStats.packetCount) * 100,
          this.statsLabels,
        )
      } catch (error) {
        this.logger.error('producer stats error.', { error }).save()
      }
    }, getConfigs().PROMETHEUS_INTERVAL_MS)
  }

  async unsetPromStats() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval)
      this.statsInterval = null

      promCollector.removeByLabels(getMsCollector<'gauge'>('producer_bitrate')?.instance, this.statsLabels)
      promCollector.removeByLabels(getMsCollector<'gauge'>('producer_jitter')?.instance, this.statsLabels)
      promCollector.removeByLabels(getMsCollector<'gauge'>('producer_packet_loss')?.instance, this.statsLabels)
    }
  }
}
