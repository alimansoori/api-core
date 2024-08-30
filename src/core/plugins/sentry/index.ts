import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import Sentry from '@sentry/node'
import { fastifySentryRequestHandler } from './requestHandler/index.js'
import { fastifySentryTracingHandler } from './tracingHandler/index.js'
import { REQ_SENTRY_TX } from './lib/index.js'

export type IFastifySentryTracingOptions = Sentry.NodeOptions

const plugin: FastifyPluginAsync = async (fastify, opts: IFastifySentryTracingOptions) => {
  fastify.decorateRequest(REQ_SENTRY_TX, null)
  opts.integrations = [new Sentry.Integrations.Http({ tracing: true })]
  Sentry.init(opts)
  fastify.register(fastifySentryRequestHandler)
  fastify.register(fastifySentryTracingHandler)
}

export const fastifySentryTracing = fp(plugin)
