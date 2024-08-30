import { DeLogger } from '@app/lib/de-logger.js'
import TypedEvent from '@app/lib/event/typedEvent.js'
import {
  MediaSoupKindEnum,
  FOLDER_MODULE,
  PERMISSION,
  MODULE_KEY,
  DefaultMediasoupBranch,
} from '@app/shared-models/index.js'
import child_process from 'child_process'
import { existsSync, mkdirSync, statSync } from 'fs'
import path from 'path'
import { container } from 'tsyringe'
import Whisper from '../transcription/whisper.js'
import {
  FfmpegObserverEvents,
  FfmpegObserverEventsKeys,
  MediaRecordParameters,
} from './interfaces/mediaRecordingInterfaces.js'
import { convertSdpToStream, createSdpCommand, getCodecInfoFromRtpParameters } from './sdp.js'
import { StorageService } from '@app/lib/storage/storage.service.js'
import { createModuleHistoryRecord } from '@app/lib/history/moduleHistory.js'
import { stat } from 'fs/promises'
import { Transaction } from '@app/database/transaction.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import dayjs from 'dayjs'
import pidusage from 'pidusage'
import MediasoupRoom from '../mediasoup/room/mediasoup-room.js'
import MediasoupProducer from '../mediasoup/producer/mediasoup-producer.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'
import { fileURLToPath } from 'url'
import { FFMPEGLogDumper } from '@app/lib/logDumper/LogFFMPEG/index.js'
import MediaserverRepository from '@app/database/entities/mediaserver/mediaserver.repo.js'
import { getConfigs } from '@app/lib/config.validator.js'
import MediaserverIntegration from '@app/lib/integrations/mediaServer/mediaserver.integration.js'
import PrometheusCollector from '@app/lib/promCollectors/prometheus.collector.js'
import { getMsCollector } from '@app/lib/promCollectors/mediaserver.prom.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export enum ExtensionFormat {
  'video' = 'webm',
  'audio' = 'ogg',
}

export default class FFMPEG {
  public static readonly RECORD_FILE_LOCATION_PATH = path.join(__dirname, '../../../public/records')
  // empty audios are 3.92kb in ogg format.
  public static readonly EMPTY_AUDIO_SIZE_BYTES = 4024
  public static readonly LEAST_SIZE_TO_TRANSCRIBE_BYTES = 7168

  private readonly _fileExtension: `${ExtensionFormat}` =
    this._recordParameters.kind === 'video' ? ExtensionFormat.video : ExtensionFormat.audio
  private readonly _fileName =
    `${this.producer.peer.id}_${new Date().getTime()}${this.transcription ? '-t' : ''}` + `.${this._fileExtension}`
  private readonly _fileDir = `${FFMPEG.RECORD_FILE_LOCATION_PATH}/${this.mediaRoom.meeting_hash}/${this.producer.peerId}`
  private _fullPath = path.join(this._fileDir, `/${this._fileName}`)

  private _process!: child_process.ChildProcess
  private _stopped = false
  private _start_time: Date | null = null
  private _end_time: Date | null = null
  private _branch_hash = this.producer.appData.branch.hash || DefaultMediasoupBranch.hash
  // its null for transcription instance
  private readonly recordingData = this.mediaRoom.recording.get(this._branch_hash) || null

  private static whisperResetState = {
    isStarted: false,
    instance: null,
    nextSegment: null,
    nextSegmentNumber: 0,
  }
  private _whisper: {
    instance: Whisper | null
    nextSegment: string | null
    nextSegmentNumber: number
  } = FFMPEG.whisperResetState

  statsLabels: Record<string, string> = {}
  statsInterval: NodeJS.Timeout | null = null

  public readonly observer = new TypedEvent<FfmpegObserverEvents, FfmpegObserverEventsKeys>()
  private logger: DeLogger = new DeLogger({ namespace: 'FFMPEG', tags: ['ffmpeg', 'record', 'transcript'] })
  private ffmpegLogDumper = container.resolve(FFMPEGLogDumper)

  constructor(
    public mediaRoom: MediasoupRoom,
    private producer: MediasoupProducer,
    private _recordParameters: MediaRecordParameters,
    private transcription = false,
  ) {
    this.logger.meta = {
      meeting_hash: mediaRoom.meeting_hash,
      type: _recordParameters.type,
    }
    if (transcription) this.logger.meta = { ...this.logger.meta, transcription }
  }

  public process() {
    const codecInfo = getCodecInfoFromRtpParameters(
      this._recordParameters.kind,
      this._recordParameters.plainRtpConsumer.rtpParameters,
    )

    if (this._recordParameters.kind === MediaSoupKindEnum.video && this.producer.codec === 'vp9') {
      this.logger.error('Videos with VP9 codec cannot be recorded.')
    }

    this._stopped = false
    const _sdpCommand = createSdpCommand(this._recordParameters, codecInfo)
    const _sdpStream = convertSdpToStream(_sdpCommand)
    const processArgs = this.generateProcessArgs()

    // spawn the child ffmpeg process
    this._process = child_process.spawn('ffmpeg', processArgs)

    this.logger.meta = { ...this.logger.meta, pid: this._process.pid }
    this.logger.log('process()', { sdpCommand: _sdpCommand, processArgs }).save()
    this.ffmpegLogDumper.log({ ...this.logger.meta, sdpCommand: _sdpCommand, processArgs }, 'process()')

    if (this._process.pid) {
      this.statsLabels = {
        meetingHash: this.mediaRoom.meeting_hash,
        peerId: this.producer.peerId,
        producerId: this.producer.producerId,
        type: this.producer.appData.type,
        pid: this._process.pid.toString(),
      }
    }

    if (this._process.stderr) {
      this._process.stderr.setEncoding('utf-8')
      this._process.stderr.on('data', async (data) => {
        this.ffmpegLogDumper.log({ ...this.logger.meta, data }, 'ffmpeg::process::data')

        const msg: string = data.toString()

        if (this.transcription && msg.indexOf('Opening ') !== -1 && !msg.startsWith('Input ')) {
          this.observer.emit('segment:creating', msg)
        }

        // sometimes videos freeze and packets haven't been received in ffmpeg, so:
        // https://mediasoup.discourse.group/t/recording-not-so-good-as-stream-in-browser/1086/6
        if (this._recordParameters.kind === MediaSoupKindEnum.video && msg.includes('max delay reached')) {
          await this._recordParameters.plainRtpConsumer.requestKeyFrame()
        }

        // sometimes port is already in use
        if (msg.includes('bind failed')) {
          if (this.transcription) {
            if (this.producer.transcription?.process) {
              this.producer.transcription.process.kill()
              this.producer.transcription.process = this.producer.startFFMPEGProcess(true)
            }
          } else {
            if (this.producer.recording?.process) {
              this.producer.recording.process.kill()
              this.producer.recording.process = this.producer.startFFMPEGProcess()
            }
          }
        }
      })
    }

    if (this._process.stdout) {
      this._process.stdout.setEncoding('utf-8')
      this._process.stdout.on('data', (data) => {
        this.ffmpegLogDumper.log({ ...this.logger.meta, data }, 'ffmpeg::process::stdout::data')
      })
    }

    this._process.on('message', (message) => {
      this.ffmpegLogDumper.log({ ...this.logger.meta, message }, 'ffmpeg::process::message')
    })

    this._process.on('error', (error) => this.logger.error('ffmpeg::process::error', { error }).save())

    this._process.once('close', () => {
      this.ffmpegLogDumper.log({ ...this.logger.meta }, 'ffmpeg::process::close')

      if (!this.transcription) {
        try {
          const stat = statSync(this._fullPath, { throwIfNoEntry: false })
          if (this._recordParameters.kind === 'audio' && (!stat || stat.size < FFMPEG.EMPTY_AUDIO_SIZE_BYTES)) return

          this.uploadToSave()
        } catch (error) {
          this.logger.error('ffmpeg::process::close error', { error }).save()
        }
      }

      this.unsetPromStats()
    })

    this._process.once('exit', () => {
      this.logger.log('FFMPEG MAIN PROCESS ENDED').save()
    })

    if (this.transcription) this.initWhisper()
    this.setPromStats()

    _sdpStream.on('error', (error) => this.logger.log('sdpStream::error', { error }).save())

    // Pipe sdp stream to the ffmpeg process
    _sdpStream.resume()
    this._start_time = dayjs.utc().toDate()
    this._process.stdin && _sdpStream.pipe(this._process.stdin)
  }

  public kill() {
    this.logger.log('kill()').save()

    // emitting kill process may fail and needs to be in a try catch
    try {
      if (this._stopped || this._process.killed) {
        if (!this._stopped) this._stopped = true
        return
      }

      this._stopped = true

      // Send the SIGINT signal to terminate the process gracefully.
      this._process.kill('SIGINT')

      if (this.transcription) setTimeout(() => this.observer.emit('segment:last', {}), 300)

      this._end_time = dayjs.utc().toDate()
    } catch (error) {
      this.logger.error('kill process error', { error }).save()
    }
  }

  private initWhisper() {
    this.observer.on('segment:creating', (s: string) => {
      const pathMatch = /'([^']+)'/.exec(s)
      if (!pathMatch || pathMatch.length < 2) return
      const filePath = pathMatch[1]
      // use the path for get previous file path ...
      // hint : the last file will generate after ffmpeg process closes ...
      const { dir, name, ext } = path.parse(filePath)
      const segmentNumber = Number(name.slice(-4))

      const targetSegmentNumber = segmentNumber - 1
      this._whisper.nextSegment = filePath
      this._whisper.nextSegmentNumber = targetSegmentNumber

      if (targetSegmentNumber < 0 || isNaN(targetSegmentNumber)) {
        return // skip 0000 segment
      }

      const previousFilePath = path.join(dir, `${name.slice(0, -4)}${('000' + targetSegmentNumber).slice(-4)}${ext}`)

      this.voice2Text(previousFilePath)
    })

    this.observer.once('segment:last', () => {
      this.voice2Text(this._whisper.nextSegment || this._fullPath)
    })
  }

  private async voice2Text(filePath: string) {
    this.logger.log('voice2Text', { filePath })

    try {
      const stat = statSync(filePath, { throwIfNoEntry: false })

      if (!stat) return
      if (stat.size < FFMPEG.LEAST_SIZE_TO_TRANSCRIBE_BYTES) return
      if (this.producer.transcription?.processedFiles.has(filePath)) return

      this.producer.transcription?.processedFiles.add(filePath)
      this._whisper.instance = new Whisper(filePath)
      await this._whisper.instance.createProcess(this.mediaRoom, this.producer, this._recordParameters, new Date())
    } catch (error) {
      this.logger.error('Whisper error', { error })
    }
  }

  private generateProcessArgs() {
    let commandArgs: string[] = [
      // '-loglevel',
      // 'debug',
      '-protocol_whitelist',
      'pipe,udp,rtp',
      '-fflags',
      '+genpts',
      '-f',
      'sdp',
      '-i',
      'pipe:0',
      '-err_detect',
      'careful',
      '-max_delay',
      '10000000',
      // '-bufsize',
      // '4M',
      '-reorder_queue_size',
      '4000',
      '-muxdelay',
      '0',
      '-max_muxing_queue_size',
      '4000',
      '-flush_packets',
      '1',
    ]

    const { kind } = this._recordParameters
    const isVideo = kind === MediaSoupKindEnum.video

    const extraCommandArgs = isVideo ? this.videoArgs : this.transcription ? this.audioArgsForWhisper : this.audioArgs

    // make sure there is exists folder
    mkdirSync(this._fileDir, { recursive: true })

    commandArgs = [
      ...commandArgs,
      ...extraCommandArgs,
      '-vf',
      'setpts=PTS-STARTPTS',
      '-af',
      'asetpts=PTS-STARTPTS',
      this._fullPath,
    ]
    return commandArgs
  }

  public get fileName() {
    return this._fileName
  }
  public get isRunning() {
    if (this._process.killed) {
      if (!this._stopped) this._stopped = true
      return false
    }

    return !this._stopped
  }

  private get videoArgs() {
    return ['-movflags', '+faststart', '-map', '0:v:0'] // removed temporarily: , '-c:v', 'copy'
    // return [
    //   '-map',
    //   '0:v:0',
    //   '-c:v',
    //   'libvpx-vp9',
    //   '-tile-columns',
    //   '4',
    //   '-tile-rows',
    //   '2',
    //   '-threads',
    //   '4',
    //   '-quality',
    //   'good',
    //   '-b:v',
    //   '1000k',
    //   '-deadline',
    //   'realtime',
    // ];
  }

  private get audioArgs() {
    return ['-movflags', '+faststart', '-map', '0:a:0'] // removed temporarily: , '-c:a', 'copy'
  }

  private get audioArgsForWhisper() {
    return [
      '-map',
      '0:a:0',
      '-c:a',
      'libvorbis',
      '-af',
      'silenceremove=start_periods=1:stop_periods=0:start_threshold=-35dB',
      '-tune',
      'zerolatency',
    ]
  }

  private async uploadToSave() {
    const mime =
      this._recordParameters.kind === MediaSoupKindEnum.video
        ? `video/${ExtensionFormat.video}`
        : `audio/${ExtensionFormat.audio}`

    const record_user_id = this._recordParameters.user_id
    const storageService = container.resolve(StorageService)
    const mediaserverRepo = container.resolve(MediaserverRepository)
    const mediaserverIntegration = container.resolve(MediaserverIntegration)
    const repo = getRepo()
    const helper = getHelper()
    const fileStat = await stat(this._fullPath)

    const used_size = !isNaN(Number(fileStat.size))
      ? {
          increment: fileStat.size,
        }
      : {}

    const meeting = await mediaserverRepo.getMeetingByHash(
      this._branch_hash === DefaultMediasoupBranch.hash ? this.mediaRoom.meeting_hash : this._branch_hash,
      [],
      this.mediaRoom,
    )

    if (!meeting) {
      this.logger.error('meeting not found in recording').save()
      return
    }

    if (this.mediaRoom.isLocal) {
      const user_id = meeting.user_id
      const workspace_id = meeting.workspace_id
      const newFolder = await helper.file.createFolderForModules({
        folder_module: FOLDER_MODULE.Recordings,
        folder_name: this.mediaRoom.name,
        user_id,
        workspace_id,
        fileData: {
          fileName: this._fileName,
          mime,
        },
      })

      const { workspaceStorage, user_storage_usage } = await helper.file.checkUserAndWorkspaceStorage(
        workspace_id,
        user_id,
      )

      if (!existsSync(this._fullPath)) {
        this.logger.error('File to upload not found', { fullPath: this._fullPath })
        return
      }

      // if (this._recordParameters.kind === MediaSoupKindEnum.audio) {
      //   const newPath = `${this._fileDir}/encoded_${this._fileName}`;
      //   child_process.execSync(`ffmpeg -i ${this._fullPath} -c:a copy ${newPath}`);
      //   this._fullPath = newPath;
      // }

      const uploadedFile = await storageService.ReadAndUpload(
        workspaceStorage.name,
        newFolder.fileData?.minio_path as string,
        this._fullPath,
      )
      const module = await repo.module.getModuleByKey(MODULE_KEY.private_file)

      if (uploadedFile && newFolder.child_folder !== null) {
        const startDifference = dayjs.utc(this._start_time).diff(dayjs.utc(this.recordingData!.startedAt))
        const startHours = Math.floor(startDifference / (60 * 60 * 1000))
        const startMinutes = Math.floor(startDifference / (60 * 1000) - startHours * 60)
        const startSeconds = Math.floor(startDifference / 1000 - (startHours * 60 + startMinutes) * 60)
        const startTime =
          `${dayjs.utc().format('YYYY-MM-DD')}T` +
          (startHours ? (startHours < 10 ? '0' + startHours.toString() + ':' : startHours.toString() + ':') : '00:') +
          (startMinutes
            ? startMinutes < 10
              ? '0' + startMinutes.toString() + ':'
              : startMinutes.toString() + ':'
            : '00:') +
          (startSeconds
            ? startSeconds < 10
              ? +'0' + startSeconds.toString() + 'Z'
              : startSeconds.toString() + 'Z'
            : '00Z')

        const endDifference = dayjs.utc(this._end_time).diff(dayjs.utc(this.recordingData!.startedAt))
        const endHours = Math.floor(endDifference / (60 * 60 * 1000))
        const endMinutes = Math.floor(endDifference / (60 * 1000) - endHours * 60)
        const endSeconds = Math.floor(endDifference / 1000 - (endHours * 60 + endMinutes) * 60)
        const endTime =
          `${dayjs.utc().format('YYYY-MM-DD')}T` +
          (endHours ? (endHours < 10 ? '0' + endHours.toString() + ':' : endHours.toString() + ':') : '00:') +
          (endMinutes ? (endMinutes < 10 ? '0' + endMinutes.toString() + ':' : endMinutes.toString() + ':') : '00:') +
          (endSeconds ? (endSeconds < 10 ? +'0' + endSeconds.toString() + 'Z' : endSeconds.toString() + 'Z') : '00Z')

        const transaction = container.resolve(Transaction)
        await transaction.start(async (ctx) => {
          await repo.workspace.updateWorkspaceUserStorageUsage(user_storage_usage, workspaceStorage, used_size, ctx)

          const file = await repo.privateFile.create(
            {
              name: newFolder.fileData?.name as string,
              path: newFolder.fileData?.path as string,
              folder_id: newFolder.child_folder?.folder_id,
              size: fileStat.size,
              private_file_hash: newFolder.fileData?.hash as string,
              mime: newFolder.fileData?.MIME as string,
              meeting_recording_file: {
                create: {
                  peer_id: this.producer.peerId,
                  kind: this._recordParameters.type,
                  start_time: startTime,
                  end_time: endTime,
                  user: {
                    connect: {
                      user_id: record_user_id,
                    },
                  },
                  meeting_recording: {
                    connect: {
                      meeting_recording_hash: this.recordingData!.hash,
                    },
                  },
                },
              },
              private_file_share: {
                create: {
                  share: {
                    create: {
                      permission: PERMISSION.Owner,
                      dst_user_id: user_id,
                      src_user_id: user_id,
                      module_id: module.module_id,
                      workspace_id,
                      type: 'child',
                    },
                  },
                },
              },
              private_file_user: {
                create: {
                  calc_permission: PERMISSION.Owner,
                  user_id,
                },
              },
              storage_bucket_id: workspaceStorage.storage_bucket_id,
              user_id,
            },
            ctx,
          )

          this.logger.log('Uploaded to minio.').save()

          createModuleHistoryRecord({
            user_id,
            module: 'file',
            entity_id: file.private_file_id,
            entity_name: file.name,
            action: 'create',
            workspace_id,
            meta: file,
            ctx,
          })
        })
      }
    } else {
      const { PUBLIC_STORAGE_NAME } = getConfigs()

      const user_id = meeting.user_id
      const fileData = helper.file.createUserFileData(
        user_id,
        this._fileName,
        mime,
        fileStat.size,
        false,
        'public_recording/',
      )

      await storageService.ReadAndUpload(PUBLIC_STORAGE_NAME, fileData.minio_path, this._fullPath)

      mediaserverIntegration.emitMessage(
        'recording:file-uploaded',
        {
          end_time: this._end_time as Date,
          file_size: fileStat.size,
          fileData,
          folder_name: this.mediaRoom.name,
          meeting_id: meeting.meeting_id,
          peerId: this.producer.peerId,
          type: this._recordParameters.type,
          record_user_id: record_user_id,
          recordingData: this.recordingData!,
          start_time: this._start_time as Date,
        },
        this.mediaRoom,
      )
    }

    const endedRecording = this.mediaRoom.endedRecordings.get(this._branch_hash)

    if (endedRecording) {
      if (endedRecording.pendingUploads.has(this.fileName)) {
        endedRecording.pendingUploads.delete(this.fileName)
      }

      // check if all pending uploads are finished...
      if (!endedRecording.pendingUploads.size) {
        this.mediaRoom.endedRecordings.delete(this._branch_hash)
        mediaserverIntegration.emitMessage(
          'recording:all-files-uploaded',
          {
            meeting_hash: meeting.meeting_hash,
            recordingData: this.recordingData!,
          },
          this.mediaRoom,
        )
      }
    }
  }
  async setPromStats() {
    const promCollector = container.resolve(PrometheusCollector)

    this.statsInterval = setInterval(async () => {
      if (!this.isRunning) {
        this.unsetPromStats()
        return
      }

      try {
        const pidStats = await pidusage(this._process.pid!)

        promCollector.setGauge(getMsCollector<'gauge'>('ffmpeg_process_cpu')?.instance, pidStats.cpu, this.statsLabels)
      } catch (error) {
        this.logger.error('ffmpeg pidusage error.', { error }).save()
      }
    }, getConfigs().PROMETHEUS_INTERVAL_MS)
  }

  async unsetPromStats() {
    const promCollector = container.resolve(PrometheusCollector)

    if (this.statsInterval) {
      clearInterval(this.statsInterval)
      this.statsInterval = null

      promCollector.removeByLabels(getMsCollector<'gauge'>('ffmpeg_process_cpu')?.instance, this.statsLabels)
    }
  }
}
