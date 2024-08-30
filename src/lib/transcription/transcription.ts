import ServerRepository from '@app/database/entities/server/server.repo.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { formDataRequest } from '@app/lib/fetch.js'
import { IMeetingStatus, ITranscribeFileApi } from '@app/shared-models/index.js'
import { container, inject, singleton } from 'tsyringe'
import { logger } from '@app/lib/logger.js'
import dayjs from 'dayjs'
import { MEETING_TYPE, meeting } from '@prisma/client'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { IMessagingEvents } from '@app/interfaces/messaging/IMessagingEvents.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'
import { WsHandler } from '@app/ws/helpers/wsHandler.js'
import { stringifyObject } from '@app/utility/helpers/index.js'

const API_PREFIX = '/api/v1'

const { API_BACKEND_SERVER_ADDRESS, API_BACKEND_PORT, NO_SPEECH_TRESHOLD } = getConfigs()

@singleton()
export default class Transcription {
  constructor(@inject(ServerRepository) private serverRepo: ServerRepository) {}
  private MS_SECRET_TOKEN = getConfigs().MS_SECRET
  private localAddress = `http://127.0.0.1:${API_BACKEND_PORT}`

  public getAddressFromServer = async (sid: number): Promise<{ host: string; isLocal: boolean }> => {
    const server = await this.serverRepo.getUrlAddressById(sid)
    if (!server) return { host: this.localAddress, isLocal: true }

    const serverUrl = 'https://' + server.url
    if (serverUrl === 'https://' + API_BACKEND_SERVER_ADDRESS) return { host: this.localAddress, isLocal: true }

    return { host: serverUrl, isLocal: false }
  }

  private getHeader = () => {
    return {
      'x-media-server-secret': this.MS_SECRET_TOKEN,
    }
  }

  public async transcribeFile(
    file: Blob,
    fileName: string,
    initialPrompt?: string,
  ): Promise<ITranscribeFileApi['Schema']['response']['200'] | null> {
    const { WHISPER_SERVER_ADDRESS } = getConfigs()
    let url = WHISPER_SERVER_ADDRESS + API_PREFIX + '/transcribe'
    if (initialPrompt) url = url + '?initialPrompt=' + initialPrompt

    const res = await formDataRequest<{
      success: boolean
      data: ITranscribeFileApi['Schema']['response']['200']
    }>(url, [{ fieldName: 'file', data: file, fileName }], this.getHeader())

    logger.log(
      'Http request sent.' + stringifyObject({ url, body: { url, fileName }, res: res.body }, { singleLine: true }),
    )

    if (res && res.status === 200 && res.body) {
      return res.body.data
    }

    return null
  }

  public async transcribeFileOpenAI(file: Blob, fileName: string, initialPrompt?: string) {
    const url = 'https://api.openai.com/v1/audio/transcriptions'
    const formData = [
      { fieldName: 'file', data: file, fileName },
      { fieldName: 'model', data: 'whisper-1' },
      { fieldName: 'language', data: 'en' },
      { fieldName: 'response_format', data: 'verbose_json' },
    ]
    if (initialPrompt) formData.push({ fieldName: 'prompt', data: initialPrompt })

    const res = await formDataRequest<{ text: string; segments: { no_speech_prob: number }[] }>(url, formData, {
      Authorization: 'Bearer ' + getConfigs().OPENAI_API_KEY,
    })

    logger.log(
      'Http request sent.' + stringifyObject({ url, body: { url, fileName }, res: res.body }, { singleLine: true }),
    )

    if (res && res.status === 200 && res.body) {
      const body = res.body

      // if (
      //   body.segments &&
      //   body.segments.length === 1 &&
      //   body.segments[0].no_speech_prob &&
      //   body.segments[0].no_speech_prob > 0.35
      // ) {
      //   res.body.text = '-_-';
      // }

      return res.body
    }

    return null
  }

  public async transcribeFileIOType(
    file: Blob,
    fileName: string,
  ): Promise<{ status: 0 | 100; message: 'transcribed' | string; result?: string } | null> {
    const url = 'https://www.iotype.com/developer/transcription'
    const formData = [
      { fieldName: 'type', data: 'file' },
      { fieldName: 'file', data: file, fileName },
    ]

    const res = await formDataRequest<{ status: 0 | 100; message: 'transcribed' | string; result?: string }>(
      url,
      formData,
      {
        Authorization: getConfigs().IOTYPE_TOKEN,
      },
    )

    logger.log(
      'Http request sent.' + stringifyObject({ url, body: { url, fileName }, res: res.body }, { singleLine: true }),
    )

    if (res && res.body) {
      return res.body
    }

    return null
  }

  public async createTranscription(data: IMessagingEvents['transcription:message']) {
    const { meeting_id, text, no_speech_prob, user_id, start_at, audio_file_name, engine, branch } = data
    const repo = getRepo()
    const helper = getHelper()
    const ws = container.resolve(WsHandler)

    let meeting: meeting | null = await repo.meeting.getUniqueMeetingByQuery({ meeting_id }, [])
    if (!meeting) throw new Error('Meeting not found.')

    // sometimes transcription texts arrives when MR has been closed
    if (meeting.status !== IMeetingStatus.LIVE && meeting.type === 'room') {
      // get last past meeting
      meeting = (
        await repo.meeting.getMeetingsByQuery(
          {
            main_room_id: meeting_id,
            type: MEETING_TYPE.meeting,
            ended_at: { not: null },
          },
          undefined,
          1,
          'ended_at.desc',
        )
      )[0]
      if (!meeting) throw new Error('Past meeting not found.')
    }

    const { channel, detailPageSocketAddress } = await helper.root.getDetailPageSocketAddress(
      meeting.type === 'room' ? 'room' : 'meeting',
      null,
      null,
      meeting.url,
    )

    const difference = dayjs.utc(start_at).diff(meeting.started_at || new Date())
    const hours = Math.floor(difference / (60 * 60 * 1000))
    const minutes = Math.floor(difference / (60 * 1000) - hours * 60)
    const seconds = Math.floor(difference / 1000 - (hours * 60 + minutes) * 60)

    /*
    if later we needed the time when background noise happens we can use following function

    function formatTime (seconds: number) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      const formattedTime = [
        ...(hours === 0 ? [] : [String(hours).padStart(2, '0')]),
        String(minutes).padStart(2, '0'),
        String(secs).padStart(2, '0'),
      ].join(':');

      return formattedTime;
    }
    */
    const threshold = NO_SPEECH_TRESHOLD ? Number(NO_SPEECH_TRESHOLD) : 0.35
    let textToSend = text

    if (no_speech_prob && no_speech_prob > threshold) {
      textToSend = '[background noise]'
    }

    ws.emitForOnlineModuleUsers(
      'transcription:message',
      detailPageSocketAddress,
      {
        text: textToSend,
        user_id,
        start_at:
          `${dayjs.utc().format('YYYY-MM-DD')}T` +
          (hours ? (hours < 10 ? '0' + hours.toString() + ':' : hours.toString() + ':') : '00:') +
          (minutes ? (minutes < 10 ? '0' + minutes.toString() + ':' : minutes.toString() + ':') : '00:') +
          (seconds ? (seconds < 10 ? +'0' + seconds.toString() + 'Z' : seconds.toString() + 'Z') : '00Z'),
        absolute_start_at: start_at,
        engine,
        branch,
      },
      channel,
      meeting.workspace_id,
      undefined,
      meeting.view_transcription_permit,
    )

    await repo.transcription.createTranscription({
      meeting_id: meeting.meeting_id,
      text,
      no_speech_prob,
      user_id,
      start_at,
      audio_file_name: audio_file_name!,
      engine,
    })
  }
}
