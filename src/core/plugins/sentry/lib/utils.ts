import { Event, ExtractedNodeRequestData } from '@sentry/types'
import { FastifyRequest } from 'fastify'
import { hostname } from 'os'
// eslint-disable-next-line no-restricted-imports
import { getCurrentHub, NodeClient, NodeOptions, Transaction } from '@sentry/node'
import { IS_DEBUG_BUILD } from './constants.js'
import { logger } from '@app/lib/logger.js'

import { stringifyObject } from '@app/utility/helpers/index.js'

export const parseRequest = (event: Event, req: FastifyRequest): Event => {
  event.contexts = {
    ...event.contexts,
    runtime: {
      name: 'node',
      version: global.process.version,
    },
  }

  const extractedRequestData = extractRequestData(req)
  event.request = {
    ...event.request,
    ...extractedRequestData,
  }

  event.server_name = global.process.env.SENTRY_NAME ?? hostname()

  const extractedUser = req?.user && typeof req?.user === 'object' ? req.user : {}
  event.user = {
    ...event.user,
    ...extractedUser,
  }

  const ip = req.ip || req?.socket.remoteAddress

  if (ip) {
    event.user = {
      ...event.user,
      ip_address: ip,
    }
  }

  return event
}

type TRequestKeys = 'headers' | 'method' | 'query_string' | 'url' | 'body' | 'cookies'

/**
 * Function copied from
 * https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts
 * and modified for Fastify
 *731611
 *753532
 *754759
 * Data (req.body) isn't available in onRequest hook,
 * as it is parsed later in the fastify lifecycle
 * https://www.fastify.io/docs/latest/Hooks/#onrequest
 */
export function extractRequestData(req: FastifyRequest, keys?: TRequestKeys[]) {
  const DEFAULT_REQUEST_KEYS: TRequestKeys[] = ['headers', 'method', 'query_string', 'url', 'body', 'cookies']

  if (!keys || keys.length <= 0 || typeof keys !== 'object') {
    keys = DEFAULT_REQUEST_KEYS
  }

  const requestData: ExtractedNodeRequestData = {}
  const headers = (req.headers as {}) || {}
  const method = req?.method || ''
  const host = req?.hostname || ''
  const protocol = req?.protocol || 'http'
  const originalUrl = req?.url || ''
  const absoluteUrl = protocol + '://' + host + originalUrl
  keys.forEach((key) => {
    switch (key) {
      case 'headers':
        requestData.headers = headers
        break
      case 'method':
        requestData.method = method
        break
      case 'url':
        requestData.url = absoluteUrl
        break
      case 'query_string':
        requestData.query_string = Object.assign({}, req.query)
        break
      case 'body':
        if (req?.body) JSON.stringify(req.body)
        break
      case 'cookies':
        if (req?.cookies) Object.assign({}, req.cookies)
        break

      default:
        break
    }
  })
  return requestData
}

export function isAutoSessionTrackingEnabled(client?: NodeClient): boolean {
  if (client === undefined) {
    return false
  }

  const clientOptions: NodeOptions = client?.getOptions()

  if (clientOptions?.autoSessionTracking !== undefined) {
    return clientOptions.autoSessionTracking
  }

  return false
}

export async function flush(timeout?: number): Promise<boolean> {
  const client = getCurrentHub().getClient<NodeClient>()

  if (client) {
    return client.flush(timeout)
  }

  IS_DEBUG_BUILD && logger.warning('Cannot flush events. No client defined.')
  return Promise.resolve(false)
}

export function addReqDataToTransaction(transaction: Transaction, req: FastifyRequest) {
  if (!transaction) return
  const host = req?.hostname || ''
  const protocol = req?.protocol || 'http'
  const originalUrl = req?.url || ''
  const absoluteUrl = protocol + '://' + host + originalUrl

  transaction.name = `${req.method.toUpperCase()} ${req.url}`
  transaction.setData('url', originalUrl)
  transaction.setData('baseUrl', absoluteUrl)
  transaction.setData('query', req.query || '')
  transaction.setData('body', stringifyObject(req.body) || '')
  transaction.setData('user_id', req.user?.user_id || '')
  transaction.setData('workspace_id', req.workspace?.workspace_id || '')
}
