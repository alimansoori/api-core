import { DeLogger } from '@app/lib/de-logger.js'
import TypedEvent from '@app/lib/event/typedEvent.js'
import child_process from 'child_process'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { WhisperModelTypes, WhisperObserverEvents, WhisperObserverEventKeys } from './interfaces/whisper.interface.js'
import { MediaRecordParameters } from '../recording/interfaces/mediaRecordingInterfaces.js'
import { container } from 'tsyringe'
import MediaserverIntegration from '@app/lib/integrations/mediaServer/mediaserver.integration.js'
import MediasoupRoom from '../mediasoup/room/mediasoup-room.js'
import MediasoupProducer from '../mediasoup/producer/mediasoup-producer.js'
import { getConfigs } from '@app/lib/config.validator.js'
import Transcription from '@app/lib/transcription/transcription.js'

const mediaserverIntegration = container.resolve(MediaserverIntegration)
const transcription = container.resolve(Transcription)

export default class Whisper {
  private _process!: child_process.ChildProcess
  private _out!: string
  public readonly observer = new TypedEvent<WhisperObserverEvents, WhisperObserverEventKeys>()
  public readonly logger: DeLogger = new DeLogger({ namespace: 'Whisper', tags: ['transcript', 'whisper'] })

  public static readonly DEFAULT_MODEL: WhisperModelTypes = 'tiny.en'

  constructor(private _inputAudioPath: string) {
    if (!existsSync(_inputAudioPath)) throw new Error('[Whisper] Error: File Not Found !')
  }

  // create convert audio file to text script
  public async createProcess(
    mediaRoom: MediasoupRoom,
    producer: MediasoupProducer,
    _recordParameters: MediaRecordParameters,
    start_at: Date,
  ) {
    const { user_id } = _recordParameters

    this.logger.log('createProcess()', { inputAudioPath: this._inputAudioPath }).save()

    const fileParse = path.parse(this._inputAudioPath)
    const { base: fileNameWithExt } = fileParse

    const file = new Blob([readFileSync(this._inputAudioPath)])

    getConfigs().TRANSCRIPTION_ENGINES.forEach(async (engine) => {
      const texts: { text: string; no_speech_prob?: number }[] = []
      const previousTexts = producer.transcription?.texts.get(engine)
      const initialPrompt = previousTexts?.length ? previousTexts.join(' ') : undefined

      if (engine === 'ctranslate2') {
        const resp = await transcription.transcribeFile(file, fileNameWithExt, initialPrompt)
        if (!resp) throw new Error('[Whisper] [ctranslate2] Transcribing File was unsuccessful.')

        texts.push(...resp.result.map((item) => ({ text: item.text })))
      } else if (engine === 'iotype') {
        const resp = await transcription.transcribeFileIOType(file, fileNameWithExt)
        if (!resp || resp.result === undefined) throw new Error('[Whisper] [iotype] Transcribing File was unsuccessful.')
        if (resp.result === '') return

        texts.push({ text: resp.result })
      } else {
        const resp = await transcription.transcribeFileOpenAI(file, fileNameWithExt, initialPrompt)
        if (!resp) throw new Error('[Whisper] [OpenAI] Transcribing File was unsuccessful.')

        texts.push({ text: resp.text, no_speech_prob: resp.segments[0]?.no_speech_prob })
      }

      // we put a few milliseconds after each text's start time to help to sort them correctly
      let startAtExtensionMs = 0

      for (const textData of texts) {
        const { meeting_id } = mediaRoom
        const { appData } = producer
        const { branch } = appData

        this.logger.log('transcription TEXT', { engine, text: textData })

        mediaserverIntegration.emitMessage(
          'transcription:message',
          {
            meeting_id: branch.id !== 0 ? branch.id : meeting_id,
            text: textData.text,
            no_speech_prob: textData.no_speech_prob,
            user_id,
            start_at: new Date(start_at.getTime() + startAtExtensionMs),
            branch,
            audio_file_name: fileNameWithExt,
            engine,
          },
          mediaRoom,
        )

        if (previousTexts) {
          previousTexts.push(textData.text)
          if (previousTexts.length > 10) previousTexts.shift()
          producer.transcription?.texts.set(engine, previousTexts)
        }

        startAtExtensionMs += 100
      }
    })

    /*
    // spawn the child whisper process
    this._process = child_process.spawn('whisper-ctranslate2', whisperArgs);


    if (this._process.stderr) {
      this._process.stderr.setEncoding('utf-8');

      this._process.stderr.on('data', data => {
        Whisper.logger.log('whisper::process::data [data:%o]', data).done();
      });
    }

    if (this._process.stdout) {
      this._process.stdout.setEncoding('utf-8');

      this._process.stdout.on('data', async (data) => {
        const { mediaRoom, user_id, start, producer } = _recordParameters;
        const { meeting_id } = mediaRoom;
        const { peerId, appData } = producer;
        const { branch } = appData;
        const start_at = new Date(start.getTime() + (fileNumber * 5_000));

        if (data.includes(']  ')) {
          const textPart = data.substring(data.indexOf(']  ') + 3);
          const removeTime = textPart.replace(/\[\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}\.\d{3}\] {2}/g, '').trim();
          const finalText = removeTime.replace('\n', ' ');

          logger.log('   *******   main data   ******* ', data);
          logger.log('   *******   transcription TEXT   ******* ', finalText);

          mediaRoom.sendTranscriptionMessage({
            peer_id: peerId,
            start_at,
            text: finalText,
          });

          await transcriptionRepo.createTranscription({
            meeting_id: branch.id !== 0 ? branch.id : meeting_id,
            user_id,
            text: finalText,
            start_at,
          });
        }

        Whisper.logger.log('out::whisper::process::data [data:%o]', data).done();
      });
    }

    this._process.on('message', message =>
      Whisper.logger.log('whisper::process::message [message:%o]', message).done(),
    );

    this._process.on('error', error =>
      Whisper.logger.log('whisper::process::error [error:%o]', error).done(),
    );

    this._process.once('close', () => {
      Whisper.logger.log('whisper::process::close');

      // this.readFile();
      this.observer.emit('process-close', {});
    });
    */
  }

  public get out() {
    return this._out
  }
}
