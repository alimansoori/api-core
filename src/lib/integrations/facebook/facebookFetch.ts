import { fetchRequest } from '@app/lib/fetch.js'
import { logger } from '@app/lib/logger.js'

export const fetchRequestClio = async <T, R>(
  method: 'GET' | 'POST',
  url: string,
  data: T | null = null,
  headers?: any,
) => {
  try {
    // make headers
    const headersRequest = { ...headers }

    const result = await fetchRequest<T, R>(method, 'https://graph.facebook.com/' + url, data, headersRequest)
    return result
  } catch (err) {
    logger.error(err)
    throw err
  }
}
