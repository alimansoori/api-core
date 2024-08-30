// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const symbolRequestTime = Symbol('RequestTimer')
const HEADER_NAME = 'X-Response-Time'

const plugin: FastifyPluginAsync = async (fastify) => {
  // Hook to be triggered on request (start time)
  fastify.addHook('onRequest', (req, reply, done) => {
    // Store the start timer in nanoseconds resolution

    req[symbolRequestTime] = process.hrtime()
    done()
  })

  // Hook to be triggered just before response to be send
  fastify.addHook('onSend', (request, reply, payload, done) => {
    // Calculate the duration, in nanoseconds …
    const hrDuration = process.hrtime(request[symbolRequestTime])
    // … convert it to milliseconds …
    const duration = (hrDuration[0] * 1e3 + hrDuration[1] / 1e6).toFixed(2)
    // … add the header to the response
    reply.header(HEADER_NAME, duration)
    done()
  })
}

export const fastifyResponseTime = fp(plugin)
