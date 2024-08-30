import { onRequestHookHandler } from 'fastify'
import { parseRequest } from '../lib/index.js'
import { getCurrentHub, runWithAsyncContext } from '@sentry/node'

export const handlerOnRequest: onRequestHookHandler = (req, reply, done) => {
  runWithAsyncContext(() => {
    const currentHub = getCurrentHub()
    // Initialise an instance of SessionFlusher on the client when `autoSessionTracking` is enabled and the
    // `requestHandler` middleware is used indicating that we are running in SessionAggregates mode
    currentHub.configureScope((scope) => {
      //  if (!(scope as any)?._eventProcessors.length) {
      scope.addEventProcessor((event) => parseRequest(event, req))
      //   }
    })

    done()
  })
}
