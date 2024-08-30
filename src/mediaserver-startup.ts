import 'reflect-metadata'
import 'isomorphic-fetch'
import moduleAlias from 'module-alias'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

moduleAlias.addAliases({
  '@app': __dirname,
  '@mediaserver': __dirname + '/mediaserver',
})
import { runtimeEnvs } from '@app/core/runtimeEnvs.js'

runtimeEnvs()

import { logger } from '@app/lib/logger.js'
import { createMediaserverApp } from '@mediaserver/mediaserver-application.js'
import { getConfigs } from './lib/config.validator.js'

/**
 * Starts the media server application.
 *
 * @returns {Promise<void>} A promise that resolves when the media server is started successfully.
 */
const start = async () => {
  try {
    const { MS_PORT, MS_WS_PORT } = getConfigs()
    await createMediaserverApp()

    logger.info('🚀 Mediaserver Started :')
    logger.info({
      CorePort: MS_PORT,
      WebSocketPort: MS_WS_PORT,
    })
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()
