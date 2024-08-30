import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import Sentry from '@sentry/node'
import { handlerOnRequest } from './handlerOnRequest.js'
import { handlerOnResponse } from './handlerOnResponse.js'

export type IFastifySentryTracingOptions = Sentry.NodeOptions

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', handlerOnRequest)
  fastify.addHook('onResponse', handlerOnResponse)
}

export const fastifySentryTracingHandler = fp(plugin)
