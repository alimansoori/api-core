import { singleton } from 'tsyringe'
import { LogDumper } from '../index.js'

@singleton()
export class TranscriptionLogDumper extends LogDumper {
  constructor() {
    super('transcription')
  }
}
