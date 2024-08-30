/**
 * This file serves as the main entry point for the backend API server.
 * @module server
 * @author Ali Mansoori
 */

import AppTerminator from '@app/core/appTerminator.js'
import { createApp } from '@app/core/bootApplication.js'
import { postApplicationRun } from '@app/core/postApplicationRun.js'
import { seedBoringAvatar } from '@app/lib/boringAvatar/createBoringAvatarForUser.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { logger } from '@app/lib/logger.js'
import { seedWorkspaceTask } from '@app/utility/task/index.js'

/**
 * This class represents the server for the API backend.
 */
export default class Server {
  private PORT: number

  constructor() {
    const { API_BACKEND_PORT } = getConfigs()
    this.PORT = API_BACKEND_PORT || 3002
  }

  /**
   * Starts the server.
   * @public
   */
  public async start() {
    try {
      const { app } = await createApp()
      const { API_BACKEND_SERVER_ADDRESS, SEED_BORING_AVATAR, SEED_TASK } = getConfigs()

      await app.listen({
        port: this.PORT,
        host: '0.0.0.0',
      })

      await postApplicationRun()

      const terminator = new AppTerminator(app)
      terminator.terminate()

      app.swagger()

      if (SEED_BORING_AVATAR) {
        seedBoringAvatar()
      }

      if (SEED_TASK) {
        seedWorkspaceTask()
      }

      logger.info(`📄 Swagger is up in https://${API_BACKEND_SERVER_ADDRESS}:${this.PORT}/docs`)
      logger.info(`🚀 Application server listening on port ${this.PORT}`)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  }
}
