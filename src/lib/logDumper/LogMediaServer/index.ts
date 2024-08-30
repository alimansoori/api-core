import { singleton } from 'tsyringe'
import { LogDumper } from '../index.js'
@singleton()
export class MediaServerLogDumper extends LogDumper {
  constructor() {
    super('mediaserver')
  }
}
