import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { IDiarizationResult } from '@app/interfaces/IDiarizationResult.js'
import { Queue } from '@app/lib/queue/index.js'
import { exec, execSync } from 'child_process'
import dayjs from 'dayjs'
import { inject, injectable } from 'tsyringe'
import path from 'path'
import { fileURLToPath } from 'url'
import { logger } from '@app/lib/logger.js'
import { regexPatterns } from '@app/utility/constants/index.js'
import { readdir } from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

@injectable()
export class Diarization {
  constructor(@inject(Queue) private queue: Queue) {}

  repo = getRepo()

  handleMeetingDiarization = async (meeting_id: number, pastMeeting_id: number) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const fileDir = path.join(__dirname, '../../../../public/transcriptions')
    const audioOutput = `${fileDir}/${meeting_id}.mp3`
    const diarizationOutput = `${fileDir}/${meeting_id}.json`

    const files = (await readdir(fileDir).catch(() => [] satisfies string[])).filter(
      (file) => file.startsWith(`${meeting_id}_`) && file.endsWith('.mp3'),
    )
    if (!files.length) return

    // Find the file with the smallest time
    let firstAudioTime = Infinity

    for (const file of files) {
      const match = file.match(regexPatterns.isoStringDateTime)

      if (match) {
        const fileTime = new Date(match[1]).getTime()

        if (fileTime < firstAudioTime) {
          firstAudioTime = fileTime
        }
      } else {
        logger.warning(`Invalid file "${file}" found at "${fileDir}".`)
      }
    }

    const inputCommand = files.map((file) => `-i "${fileDir}/${file}"`).join(' ')

    // eslint-disable-next-line max-len
    const command = `ffmpeg -y -loglevel "error" ${inputCommand} -filter_complex "concat=n=${files.length}:v=0:a=1" -c:a libmp3lame -q:a 2 ${audioOutput}`

    logger.log('FFMPEG command executed: ' + command)
    execSync(command)

    await this.createFileDiarization(
      pastMeeting_id,
      audioOutput,
      diarizationOutput,
      new Date(firstAudioTime).toISOString(),
    )
  }

  createFileDiarization = async (
    meeting_id: number,
    src_file_path: string, // Audio file Absolute path
    result_file_path: string, // Diarization JSON file Absolute path to create in
    baseTime: string, // timestamp with ms
  ) => {
    const fiveMinutes = 300000
    const pythonFileAddress = path.join(__dirname, './diarization.py')
    const res = exec(`diarization ${pythonFileAddress} ${src_file_path} ${result_file_path}`)
    res.stderr?.on('data', (data) => {
      logger.log(data)
    })

    res.stdout?.on('data', (data) => {
      logger.log(data)
    })

    await this.queue.addRepeatableJob(
      'repeatedSpeakerDiarizationQueue',
      `Speaker diarization for file ${result_file_path} and meeting ${meeting_id}`,
      {
        every: fiveMinutes,
      },
      {
        meeting_id,
        result_file_path,
        baseTime,
        src_file_path,
      },
    )
  }

  processResults = async (data: IDiarizationResult[], baseTime: string, meeting_id: number) => {
    const transactionStartTime = dayjs.utc(baseTime)

    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const start_item = i - 11
      const end_item = i

      let hasOverlap = data
        .slice(start_item < 0 ? 0 : start_item, end_item < 0 ? 0 : end_item)
        .find((item2) => item.start < item2.end)

      if (hasOverlap) {
        item.hasOverlap = true
        continue
      }

      hasOverlap = data.slice(i + 1, i + 12).find((item2) => item.end > item2.start)

      if (hasOverlap) {
        item.hasOverlap = true
        continue
      }

      const start_time = transactionStartTime.add(item.start, 'milliseconds').toISOString()
      const end_time = transactionStartTime.add(item.end, 'milliseconds').toISOString()
      await this.repo.transcription
        .updateAllMeetingTranscriptionByQuery(
          {
            meeting_id,
            start_at: {
              gte: start_time,
              lte: end_time,
            },
          },
          {
            speaker_name: item.speaker,
          },
        )
        .catch((err) => {
          logger.log(err)
        })
    }

    const transcribesWithOutSpeakerName = await this.repo.transcription.getAllMeetingTranscriptionByQuery({
      meeting_id,
      speaker_name: null,
    })

    for (const transaction of transcribesWithOutSpeakerName) {
      // console.log(transaction);

      const started_at = dayjs.utc(transaction.start_at).toISOString()
      let nearestRecord: IDiarizationResult = data[0]
      const start_time = transactionStartTime.add(nearestRecord.start, 'milliseconds').toISOString()
      const end_time = transactionStartTime.add(nearestRecord.end, 'milliseconds').toISOString()

      const start_diff = Math.abs(dayjs.utc(start_time).diff(started_at, 'milliseconds'))
      const end_diff = Math.abs(dayjs.utc(end_time).diff(started_at, 'milliseconds'))

      let nearestDiff = start_diff < end_diff ? start_diff : end_diff

      for (const item of data) {
        const start_time = transactionStartTime.add(item.start, 'milliseconds').toISOString()
        const end_time = transactionStartTime.add(item.end, 'milliseconds').toISOString()

        const start_time_diff = Math.abs(dayjs.utc(start_time).diff(started_at, 'milliseconds'))
        const end_time_diff = Math.abs(dayjs.utc(end_time).diff(started_at, 'milliseconds'))

        if (start_time_diff < nearestDiff) {
          nearestDiff = start_time_diff
          nearestRecord = item
        }

        if (end_time_diff < nearestDiff) {
          nearestDiff = end_time_diff
          nearestRecord = item
        }
      }

      if (!nearestRecord.hasOverlap) {
        await this.repo.transcription.updateAllMeetingTranscriptionByQuery(
          {
            meeting_transcription_id: transaction.meeting_transcription_id,
          },
          {
            speaker_name: nearestRecord.speaker,
          },
        )
      }
    }

    return true
  }
}
