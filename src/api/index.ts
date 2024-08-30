import { FastifyInstance } from 'fastify/types/instance.js'
import { V1Router } from './v1/index.js'
import { FastifyPluginCallback } from 'fastify'

/**
 * Registers the main router for the API.
 *
 * @param fastify - The Fastify instance.
 * @param options - The options object.
 * @param done - The callback function to be called when the registration is complete.
 */
export const mainRouter: FastifyPluginCallback = (fastify: FastifyInstance, options, done) => {
  fastify.register(V1Router, { prefix: '/v1' })
  done()
}
