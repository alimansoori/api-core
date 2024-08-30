import { singleton } from 'tsyringe'
import { LogDumper } from '../index.js'
@singleton()
export class FFMPEGLogDumper extends LogDumper {
  constructor() {
    super('ffmpeg')
  }
}
