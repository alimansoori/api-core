import { singleton } from 'tsyringe'
import { LogDumper } from '../index.js'

@singleton()
export class CalendarLogDumper extends LogDumper {
  constructor() {
    super('calendar')
  }
}
