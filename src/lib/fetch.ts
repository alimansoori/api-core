import { retry, stringifyObject } from '@app/utility/helpers/index.js'
import axios, { AxiosRequestConfig } from 'axios'
import { logger } from './logger.js'

export const fetchRequest = async <T, R>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  url: string,
  data: T | null,
  headers?: any,
  dontLogError?: boolean,
) => {
  const config: AxiosRequestConfig = {
    validateStatus: () => true,
    method,
    url,
  }

  if (method === 'GET' || method === 'DELETE') {
    config.params = data
  } else {
    config.data = data
  }

  if (headers) {
    config.headers = headers
  }

  const result = await retry(axios(config), 2)

  if (result.status >= 400 && dontLogError !== true) {
    const { request: _request, ...restResult } = result
    logger.error(stringifyObject(restResult))
  }

  return {
    body: [200, 201, 400, 401, 403, 404].includes(result.status) ? (result.data as R) : null,
    status: result.status,
    headers: result.headers,
  }
}

export const formDataRequest = async <T>(
  url: string,
  formData: { fieldName: string; data: Blob | string; fileName?: string }[],
  headers?: any,
) => {
  const config: AxiosRequestConfig = {
    validateStatus: () => true,
  }

  const form = new FormData()

  for (const field of formData) {
    if (field.data instanceof Blob) form.append(field.fieldName, field.data, field.fileName)
    else form.append(field.fieldName, field.data)
  }

  if (headers) {
    config.headers = headers
  }

  const result = await retry(axios.post(url, form, config), 2)

  if (result.status >= 400) {
    const { request: _request, ...restResult } = result
    logger.error(stringifyObject(restResult))
  }

  return {
    body: [200, 201, 400, 401, 403, 404].includes(result.status) ? (result.data as T) : null,
    status: result.status,
    headers: result.headers,
  }
}
