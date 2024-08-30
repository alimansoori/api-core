import { onResponseHookHandler } from 'fastify'
import { addReqDataToTransaction, REQ_SENTRY_TX } from '../lib/index.js'

export const handlerOnResponse: onResponseHookHandler = (req, reply, done) => {
  setImmediate(() => {
    const transaction = req[REQ_SENTRY_TX as keyof typeof req]
    addReqDataToTransaction(transaction, req)
    transaction.setHttpStatus(reply.statusCode)
    transaction.finish()
  })
  done()
}
