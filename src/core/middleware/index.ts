import { fastifyHelmet } from '@fastify/helmet'
import { resolve } from 'path'
import { FastifyInstance } from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyMultipart from '@fastify/multipart'
import fastifyFormbody from '@fastify/formbody'

import fastifyCors from '@fastify/cors'

import { Integrations } from '@sentry/node'
import { fastifyResponseTime, fastifySentryTracing } from '../plugins/index.js'
import { authorization } from './auth.js'
import { getConfigs } from '@app/lib/config.validator.js'
import Database from '@app/database/index.js'
import { container } from 'tsyringe'
import { IFastifySentryTracingOptions } from '../plugins/sentry/index.js'

export const initialMiddleware = async (fastify: FastifyInstance) => {
  const { NODE_ENV, SENTRY_DSN, APP_VER, BASE_DIR } = getConfigs()
  const db = container.resolve(Database)

  if (NODE_ENV === 'production') {
    fastify.register(fastifyHelmet, { xssFilter: true })
  }

  fastify.register(fastifySentryTracing, {
    dsn: SENTRY_DSN,
    environment: NODE_ENV,
    enabled: true,
    tracesSampleRate: 1.0,
    release: `uni-backend@${APP_VER}`,
    tracing: true,
    integrations: [new Integrations.Prisma({ client: db.getPrisma() })],
  } as IFastifySentryTracingOptions)

  // fastify.register(fastifySentry, {
  //   dsn: SENTRY_DSN,
  //   environment: NODE_ENV,
  //   enabled: !!(NODE_ENV === 'staging' || NODE_ENV === 'production'),
  //   tracesSampleRate: 1.0,
  //   release: `uni-backend@${APP_VER}`,
  //   integrations: [new Integrations.Prisma({ client: db.getPrisma() })],
  //   setErrorHandler: false,
  // });

  fastify.register(fastifyResponseTime)

  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: Number.MAX_SAFE_INTEGER,
    },
  })
  fastify.register(fastifyFormbody)

  fastify.register(fastifyStatic, {
    root: resolve(BASE_DIR, '../', 'public'),
    prefix: '/api/upload',
    cacheControl: false,
  })

  fastify.register((instance, opts, next) => {
    instance.addHook('preValidation', authorization())
    instance.register(fastifyStatic, {
      root: resolve(BASE_DIR, '../', 'public'),
      prefix: '/api/upload/unimedia',
      cacheControl: false,
      decorateReply: false,
    })
    next()
  })

  fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  })

  return true
}
