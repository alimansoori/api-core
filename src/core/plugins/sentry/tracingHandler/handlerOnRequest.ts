import { onRequestHookHandler } from 'fastify'
import { REQ_SENTRY_TX } from '../lib/index.js'
import { getCurrentHub, startTransaction, extractTraceparentData } from '@sentry/node'

export const handlerOnRequest: onRequestHookHandler = (req, reply, done) => {
  let traceparentData = {}

  if (req.headers && typeof req.headers['sentry-trace'] === 'string') {
    const sentryTrace = extractTraceparentData(req.headers['sentry-trace'])

    if (sentryTrace) {
      traceparentData = sentryTrace
    }
  }

  const transaction = startTransaction(
    {
      op: 'http.server',
      name: `${req.method.toUpperCase()} ${req.routeOptions.url ?? req.url}`,
      ...traceparentData,
    },
    // { request: extractRequestData(req) },
  )

  getCurrentHub().configureScope((scope) => {
    scope.setSpan(transaction)
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req[REQ_SENTRY_TX] = transaction

  done()
}
