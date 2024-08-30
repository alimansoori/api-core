import { logger } from '@app/lib/logger.js'
import { exec } from 'child_process'

export function execShellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error: '${error}'`)
        reject(error)
      }

      resolve(stdout || stderr)
    })
  })
}
