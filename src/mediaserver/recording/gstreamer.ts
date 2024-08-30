import child_process from 'child_process'
import path from 'path'
import {
  FfmpegObserverEvents,
  FfmpegObserverEventsKeys,
  MediaRecordParameters,
} from './interfaces/mediaRecordingInterfaces.js'
import MediasoupRoom from '../mediasoup/room/mediasoup-room.js'
import MediasoupProducer from '../mediasoup/producer/mediasoup-producer.js'
import TypedEvent from '@app/lib/event/typedEvent.js'
import { DeLogger } from '@app/lib/de-logger.js'
import { getCodecInfoFromRtpParameters } from './sdp.js'
import { DefaultMediasoupBranch, MediaSoupKindEnum } from '@app/shared-models/index.js'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GSTREAMER_COMMAND = 'gst-launch-1.0'
const GSTREAMER_OPTIONS = '-v -e'

export enum ExtensionFormat {
  'video' = 'webm',
  'audio' = 'ogg',
}

export class GStreamer {
  public static readonly RECORD_FILE_LOCATION_PATH = path.join(__dirname, '../../../public/records')
  // empty audios are 4.22kb in ogg format.
  public static readonly EMPTY_AUDIO_SIZE_BYTES = 4330

  private readonly _fileName = `${this.producer.peer.id}_${new Date().getTime()}`
  private readonly _fileExtension: `${ExtensionFormat}` =
    this._recordParameters.kind === 'video' ? ExtensionFormat.video : ExtensionFormat.audio
  private readonly _fileDir = `${GStreamer.RECORD_FILE_LOCATION_PATH}/${this.mediaRoom.meeting_hash}/${this.producer.peerId}`
  private readonly _fullPath = path.join(this._fileDir, `/${this._fileName}.${this._fileExtension}`)

  private _process!: child_process.ChildProcess
  private _stopped = false
  private _start_time!: Date
  // its null for transcription instance
  private readonly recordingData =
    this.mediaRoom.recording.get(this.producer.appData.branch.hash || DefaultMediasoupBranch.hash) || null

  public readonly observer = new TypedEvent<FfmpegObserverEvents, FfmpegObserverEventsKeys>()
  private logger: DeLogger = new DeLogger({ namespace: 'GStreamer', tags: ['gstreamer', 'record', 'transcript'] })

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

    if (!existsSync(this._fileDir)) mkdir(this._fileDir, { recursive: true })
  }

  public process() {
    // Use the commented out exe to create gstreamer dot file
    // const exe = `GST_DEBUG=${GSTREAMER_DEBUG_LEVEL} GST_DEBUG_DUMP_DOT_DIR=./dump ${GSTREAMER_COMMAND} ${GSTREAMER_OPTIONS}`;
    const exe = `GST_DEBUG=3 ${GSTREAMER_COMMAND} ${GSTREAMER_OPTIONS}`

    this.logger.log('process()', { processArgs: this._commandArgs, command: `${exe} ${this._commandArgs.join(' ')}` })

    /* 
    this._process = child_process.spawn(exe, this._commandArgs, {
      shell: true,
    });

    this.logger.meta = { ...this.logger.meta, pid: this._process.pid };

    if (this._process.stderr) {
      this._process.stderr.setEncoding('utf-8');
    }

    if (this._process.stdout) {
      this._process.stdout.setEncoding('utf-8');
    }

    this._process.on('message', (message) =>
      this.logger.log('gstreamer::process::message', { message }),
    );

    this._process.on('error', (error) =>
      this.logger.error('gstreamer::process::error', { error }),
    );

    this._process.stderr?.on('data', (data) => this.logger.log('gstreamer::process::stderr::data', { data }));

    this._process.stdout?.on('data', (data) => this.logger.log('gstreamer::process::stdout::data', { data }));

    this._process.once('close', () => {
      this.logger.log('gstreamer::process::close');
    });

    this._process.once('exit', () => {
      this.logger.log('GSTREAMER MAIN PROCESS ENDED').save();

      if (!this.transcription) {
        // const { size: fileSizeInBytes } = statSync(this._fullPath);
        // if (this._recordParameters.kind === 'audio' && fileSizeInBytes < GSTREAMER.EMPTY_AUDIO_SIZE_BYTES) return;

        if (!this._recordParameters.plainTransport.closed) {
          this._recordParameters.plainTransport.close();
        }

        const { kind, user_id: record_user_id } = this._recordParameters;
        this.minioUploadAction({
          mime: kind === MediaSoupKindEnum.video ? `video/${ExtensionFormat.video}` : `audio/${ExtensionFormat.audio}`,
          record_user_id,
        });
      }
    });
    */
  }

  public kill() {
    /*
    if (this._stopped) return;

    this.logger.log('kill()').save();
    this._stopped = true;

    if (this._process.killed) return;

    this._process.kill('SIGINT');
    */
  }

  // Build the gstreamer child process args
  get _commandArgs() {
    let commandArgs = [
      // eslint-disable-next-line max-len
      `rtpbin name=rtpbin latency=50 buffer-mode=0 sdes="application/x-rtp-source-sdes, cname=(string)${this._recordParameters.plainRtpConsumer.rtpParameters.rtcp?.cname}"`,
      '!',
    ]

    commandArgs = commandArgs.concat(this._videoArgs)
    commandArgs = commandArgs.concat(this._audioArgs)
    commandArgs = commandArgs.concat(this._sinkArgs)
    commandArgs = commandArgs.concat(this._rtcpVideoArgs)
    commandArgs = commandArgs.concat(this._rtcpAudioArgs)

    return commandArgs
  }

  get _videoArgs() {
    // Get video codec info
    const videoCodecInfo = getCodecInfoFromRtpParameters(
      MediaSoupKindEnum.video,
      this._recordParameters.plainRtpConsumer.rtpParameters,
    )

    const VIDEO_CAPS = `application/x-rtp,media=(string)video,clock-rate=(int)${videoCodecInfo.clockRate},payload=(int)${
      videoCodecInfo.payloadType
    },encoding-name=(string)${videoCodecInfo.codecName.toUpperCase()},ssrc=(uint)${
      this._recordParameters.plainRtpConsumer.rtpParameters.encodings?.[0].ssrc
    }`

    return [
      `udpsrc port=${this._recordParameters.remoteRtpPort} caps="${VIDEO_CAPS}"`,
      '!',
      'rtpbin.recv_rtp_sink_0 rtpbin.',
      '!',
      'queue',
      '!',
      'rtpvp8depay',
      '!',
      'mux.',
    ]
  }

  get _audioArgs() {
    // Get audio codec info
    const audioCodecInfo = getCodecInfoFromRtpParameters(
      MediaSoupKindEnum.audio,
      this._recordParameters.plainRtpConsumer.rtpParameters,
    )

    const AUDIO_CAPS = `application/x-rtp,media=(string)audio,clock-rate=(int)${audioCodecInfo.clockRate},payload=(int)${
      audioCodecInfo.payloadType
    },encoding-name=(string)${audioCodecInfo.codecName.toUpperCase()},ssrc=(uint)${
      this._recordParameters.plainRtpConsumer.rtpParameters.encodings?.[0].ssrc
    }`

    return [
      `udpsrc port=${this._recordParameters.remoteRtpPort} caps="${AUDIO_CAPS}"`,
      '!',
      'rtpbin.recv_rtp_sink_1 rtpbin.',
      '!',
      'queue',
      '!',
      'rtpopusdepay',
      '!',
      'opusdec',
      '!',
      'opusenc',
      '!',
      'mux.',
    ]
  }

  get _rtcpVideoArgs() {
    return [
      `udpsrc address=127.0.0.1 port=${this._recordParameters.remoteRtcpPort}`,
      '!',
      'rtpbin.recv_rtcp_sink_0 rtpbin.send_rtcp_src_0',
      '!',
      // eslint-disable-next-line max-len
      `udpsink host=127.0.0.1 port=${this._recordParameters.localRtcpPort} bind-address=127.0.0.1 bind-port=${this._recordParameters.remoteRtcpPort} sync=false async=false`,
    ]
  }

  get _rtcpAudioArgs() {
    return [
      `udpsrc address=127.0.0.1 port=${this._recordParameters.remoteRtcpPort}`,
      '!',
      'rtpbin.recv_rtcp_sink_1 rtpbin.send_rtcp_src_1',
      '!',
      // eslint-disable-next-line max-len
      `udpsink host=127.0.0.1 port=${this._recordParameters.localRtcpPort} bind-address=127.0.0.1 bind-port=${this._recordParameters.remoteRtcpPort} sync=false async=false`,
    ]
  }

  get _sinkArgs() {
    return ['webmmux name=mux', '!', `filesink location=${this._fullPath}`]
  }

  public get fileName() {
    return this._fileName
  }
  public get isRunning() {
    return !this._stopped
  }

  // public minioUploadAction = async () => {
  //   const { mime, record_user_id } = data;

  //   const storageService = container.resolve(StorageService);
  //   const repo = getRepo();
  //   const helper = getHelper();

  //   const meeting = await repo.meeting.getUniqueMeetingByHash(this.mediaRoom.meeting_hash);

  //   if (!meeting) {
  //     this.logger.error('meeting not found in recording').save();
  //     return;
  //   }

  //   const user_id = meeting.user_id;
  //   const workspace_id = meeting.workspace_id;

  //   const newFolder = await helper.file.createFolderForModules({
  //     folder_module: FOLDER_MODULE.Recordings,
  //     folder_name: this.mediaRoom.name,
  //     user_id,
  //     workspace_id,
  //     fileData: {
  //       fileName: `${this._recordParameters.name}.${this._fileExtension}`,
  //       mime,
  //     },
  //   });

  //   const { workspaceStorage, user_storage_usage } = await helper.file.checkUserAndWorkspaceStorage(workspace_id, user_id);

  //   const module = await repo.module.getModuleByKey(MODULE_KEY.private_file);

  //   if (!existsSync(this._fullPath)) {
  //     logger.error('File ' + this._fullPath + ' not found');
  //     return;
  //   }

  //   const fileStat = await stat(this._fullPath);

  //   const used_size = {
  //     increment: fileStat.size,
  //   };

  //   const uploadedFile = await storageService.ReadAndUpload(
  //     workspaceStorage.name,
  //     newFolder.fileData?.minio_path as string,
  //     this._fullPath,
  //   );

  //   if (uploadedFile && newFolder.child_folder !== null) {
  //     const transaction = container.resolve(Transaction);
  //     await transaction.start(async (ctx) => {
  //       await repo.workspace.updateWorkspaceUserStorageUsage(
  //         user_storage_usage.workspace_user_id,
  //         used_size,
  //         workspaceStorage.storage_bucket_id,
  //         ctx,
  //       );
  //       const difference = dayjs.utc(this._start_time).diff(dayjs.utc(this.recordingData!.startedAt));
  //       const hours = Math.floor(difference / (60 * 60 * 1000));
  //       const minutes = Math.floor(difference / (60 * 1000) - hours * 60);
  //       const seconds = Math.floor(difference / 1000 - (hours * 60 + minutes) * 60);

  //       const file = await repo.privateFile.create(
  //         {
  //           name: newFolder.fileData?.name as string,
  //           path: newFolder.fileData?.path as string,
  //           folder_id: newFolder.child_folder?.folder_id,
  //           size: fileStat.size,
  //           private_file_hash: newFolder.fileData?.hash as string,
  //           mime: newFolder.fileData?.MIME as string,
  //           meeting_recording_file: {
  //             create: {
  //               peer_id: this._recordParameters.producer.peerId,
  //               kind: this._recordParameters.type,
  //               start_time:
  //                 `${dayjs.utc().format('YYYY-MM-DD')}T` +
  //                 (hours ? (hours < 10 ? '0' + hours.toString() + ':' : hours.toString() + ':') : '00:') +
  //                 (minutes ? (minutes < 10 ? '0' + minutes.toString() + ':' : minutes.toString() + ':') : '00:') +
  //                 (seconds ? (seconds < 10 ? +'0' + seconds.toString() + 'Z' : seconds.toString() + 'Z') : '00Z'),
  //               user: {
  //                 connect: {
  //                   user_id: record_user_id,
  //                 },
  //               },
  //               meeting_recording: {
  //                 connect: {
  //                   meeting_recording_hash: this.recordingData!.hash,
  //                 },
  //               },
  //             },
  //           },
  //           storage_bucket_id: workspaceStorage.storage_bucket_id,
  //           user_id,
  //           private_file_share: {
  //             create: {
  //               share: {
  //                 create: {
  //                   permission: PERMISSION.Owner,
  //                   dst_user_id: user_id,
  //                   src_user_id: user_id,
  //                   module_id: module.module_id,
  //                   workspace_id,
  //                   type: 'child',
  //                 },
  //               },
  //             },
  //           },
  //           private_file_user: {
  //             create: {
  //               calc_permission: PERMISSION.Owner,
  //               user_id,
  //             },
  //           },
  //         },
  //         ctx,
  //       );

  //       this.logger.log('Uploaded to minio.').save();

  //       createModuleHistoryRecord({
  //         user_id,
  //         module: 'file',
  //         entity_id: file.private_file_id,
  //         action: 'create',
  //         workspace_id,
  //         meta: file,
  //         ctx,
  //       });
  //     });
  //   }
  // };
}
