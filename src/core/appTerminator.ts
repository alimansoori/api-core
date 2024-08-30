/**
 * @fileoverview This module provides the AppTerminator class for gracefully terminating a Fastify application.
 * @author Ali Mansoori
 */

import { logger } from '@app/lib/logger.js'
import { FastifyInstance } from 'fastify'
import { getConfigs } from '@app/lib/config.validator.js'

/**
 * Class responsible for gracefully terminating the application.
 * @class
 */
export default class AppTerminator {
  private fastify: FastifyInstance
  private signals = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGTERM: 15,
  }

  /**
   * Constructs an instance of AppTerminator.
   * @param {FastifyInstance} fastify - The FastifyInstance to be terminated.
   */
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  /**
   * Shuts down the application.
   * @param {string} signal - The signal received.
   * @param {number} value - The value associated with the signal.
   */
  private shutdown(signal: string, value: number) {
    logger.info('shutdown!')
    this.fastify.close(() => {
      // in production, the application must run with node. just node not npm.
      logger.info(`server stopped by ${signal} with value ${value}`)
      const env = getConfigs().NODE_ENV
      if (env === 'clinicjs') return
      process.exit(128 + value)
    })
  }

  /**
   * Sets up signal handlers to terminate the application.
   * @public
   */
  public terminate() {
    Object.keys(this.signals).forEach((signal) => {
      process.on(signal, () => {
        logger.info(`process received a ${signal} signal`)
        this.shutdown(signal, this.signals[signal as keyof typeof this.signals])
      })
    })
  }
}
