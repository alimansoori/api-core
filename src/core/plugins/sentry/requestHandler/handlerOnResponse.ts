import { getCurrentHub, NodeClient } from '@sentry/node'
import { onResponseHookHandler } from 'fastify'
import { isAutoSessionTrackingEnabled } from '../lib/index.js'

export const handlerOnResponse: onResponseHookHandler = (req, reply, done) => {
  const client = getCurrentHub().getClient<NodeClient>()

  if (isAutoSessionTrackingEnabled(client)) {
    setImmediate(() => {
      if (client && (client as any)._captureRequestSession) {
        // Calling _captureRequestSession to capture request session at the end of the request by incrementing
        // the correct SessionAggregates bucket i.e. crashed, errored or exited
        ;(client as any)._captureRequestSession()
      }
    })
  }

  done()
}
