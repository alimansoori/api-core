import { getConfigs } from '@app/lib/config.validator.js'
import { respSuccess, respUnsuccess } from '@app/utility/helpers/index.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CustomError } from '../error/errorGenerator.js'
import { errorHandler } from '../error/errorHandler.js'
import { RequestHandler } from '@app/shared-models/index.js'

interface IBulkData<T extends RequestHandler['fastify']> {
  params?: T['Params']
  body?: T['Body']
  query?: T['Querystring']
}

export const bulkRequestHandler = async <T extends RequestHandler['fastify']>(
  request: {
    req: FastifyRequest<{ Querystring: Record<string, any>; Body: Record<string, any>; Params: Record<string, any> }>
    reply: FastifyReply
  },
  api: any,
  apiData: IBulkData<T>[],
) => {
  const { req, reply } = request
  const { BULK_REQUEST_LIMIT } = getConfigs()

  if (apiData.length > +BULK_REQUEST_LIMIT) {
    return respUnsuccess(reply, [{ message: `Data exceeds the maximum ${BULK_REQUEST_LIMIT} limit.` }], 'FORBIDDEN')
  }

  reply._bulk = { isInProgress: true, result: [] }

  for (const itm of apiData) {
    if (itm.params) req.params = itm.params
    if (itm.body) req.body = itm.body
    if (itm.query) req.query = itm.query

    await api(req, reply).catch((err: CustomError) => errorHandler(err as any, req, reply))
  }

  reply._bulk.isInProgress = false
  return respSuccess(reply, reply._bulk.result, 'SUCCESS')
}
