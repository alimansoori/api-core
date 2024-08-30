import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { logger } from '@app/lib/logger.js'
import { existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
/**
 * This is a simple logger to dump custom logs for long-time monitoring
 * of certain issues
 */
export abstract class LogDumper {
  private filePath: string
  constructor(private name: string) {
    const now = new Date().toISOString()
    const logsDir = path.join(__dirname, '../../../logs/')
    const fileName = this.name + '_' + now.slice(0, 10) + '.log'

    if (!existsSync(logsDir)) {
      mkdirSync(logsDir)
    }

    this.filePath = path.join(logsDir, fileName)

    fs.appendFile(this.filePath, 'INITIALIZING LOGS AT ' + now + '\n\n')

    logger.info(`Log file "${this.filePath}" is ready.`)
  }
  public async info(...data: any[]) {
    for (const message in data) {
      await this.log(message, 'INFO')
    }
  }
  public async error(...data: any[]) {
    for (const message in data) {
      await this.log(message, 'ERROR')
    }
  }
  public async log(data: any, prefix?: string) {
    const time = new Date().toISOString()
    const stringified_log_data = JSON.stringify(data, null, 4) + '\n\n'
    const log_prefix = ' ::' + (prefix ? ` ${prefix}` : '') + ' => '
    const log = time + log_prefix + stringified_log_data
    await fs.appendFile(this.filePath, log)
  }
}
