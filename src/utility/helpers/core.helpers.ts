import { Context, IGenerateES256KeyPair } from '@app/interfaces/index.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { consoleColorize, logger } from '@app/lib/logger.js'
import { regexChecker } from '@app/lib/regexChecker/index.js'
import { IGetProjectByDomainResp, MODULE_KEY, PERMISSION } from '@app/shared-models/index.js'
import { generateRandomNumber } from '@app/utility/common/generateRandomString.js'
import * as base64url from 'base64url'
import { spawnSync } from 'child_process'
import { createHash } from 'crypto'
import { FastifyRequest } from 'fastify'
import lodash from 'lodash'
import { customAlphabet } from 'nanoid'
import path, { join } from 'path'
import { parse } from 'tldts'
import uaParser from 'ua-parser-js'
import { fileURLToPath, URL } from 'url'
import util from 'util'
import { regexPatterns } from '../constants/index.js'
import { combineNameAndPathForImages } from './index.js'
const { isArray } = lodash
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const isIntegrationExist = (
  integrations: IGetProjectByDomainResp['project_modules'],
  key: MODULE_KEY,
): IGetProjectByDomainResp['project_modules'][0] | undefined => {
  const int = integrations.find((item) => item.module.key === key)
  if (int) return int
  else return undefined
}

export const isDevelopment = () => getConfigs().NODE_ENV === 'development'
export const isTest = () => getConfigs().NODE_ENV === 'test'
export const isProduction = () => getConfigs().NODE_ENV === 'production'
export const isStaging = () => getConfigs().NODE_ENV === 'staging'

export const getUniclientDomain = (hostname: string, dev: 'ip' | 'local' = 'ip'): string => {
  const { API_BACKEND_PORT } = getConfigs()
  return isDevelopment()
    ? `${dev === 'ip' ? 'http://127.0.0.1' : 'http://localhost'}:${API_BACKEND_PORT}`
    : `https://${hostname}`
}

export const getHostname = (hostname: string): { domain: string; subdomain?: string } => {
  const reservedHosts = [
    'coffee.xyz',
    'localic.com',
    'goodcoff.ee',
    'alimansoori71.us',
    'alimansoori71.ir',
    'splash.fan',
    'bookdemo.com',
  ]

  if (
    (isDevelopment() || isStaging() || isTest()) &&
    (hostname.startsWith('127.0.0.1') || hostname.startsWith('localhost'))
  ) {
    return { domain: 'staging.alimansoori71.us' }
  }

  const parsedDomain = parse(hostname)
  const subdomains = parsedDomain.subdomain?.split('.').filter((i) => i !== 'www' && i !== 'dev' && i !== 'staging')
  let startSliceIndex = 3

  reservedHosts.some((host) => {
    if (hostname.includes(host) && hostname.split('.').length <= 4) {
      if (!hostname.includes('staging.alimansoori71.us')) {
        startSliceIndex = 2
      }
    }
  })

  return {
    domain: hostname
      .split('.')
      .slice(Math.max(hostname.split('.').length - startSliceIndex, 0))
      .join('.'),
    subdomain: subdomains?.length ? subdomains[0] : undefined,
  }
}

export const getSubdomainFromHostname = (url: string) => {
  let hostname

  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  hostname = hostname.split(':')[0]
  hostname = hostname.split('?')[0]
  const parts = hostname.split('.')

  if (parts.length === 3) {
    return parts[0]
  } else {
    return undefined
  }
}

export const removeSubdomainFromHostname = (url: string): string => {
  let hostname

  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  hostname = hostname.split(':')[0]
  hostname = hostname.split('?')[0]
  const parts = hostname.split('.')

  if (parts.length === 3) {
    parts.shift()
  }

  return url.replace(hostname, parts.join('.'))
}

export const replaceSubdomainInHostname = (origin_url: string, target_subdomain: string, target_server_url: string) => {
  const origin_hostname = removeSubdomainFromHostname(origin_url)
  const target_prefix = getSubdomainFromHostname(target_server_url)
  const final_address = 'https://' + target_subdomain + '.' + target_prefix + '.' + origin_hostname
  return final_address
}

export const generateNanoID = (length = 12, prefix = '', separation_character?: string) => {
  const alphabets = '123456789abcdefghijklmnopqrstuvwxyz'
  let nanoId = customAlphabet(alphabets, length)()

  if (separation_character) {
    nanoId = nanoId.match(/(.{4})/g)?.join(separation_character) || nanoId
  }

  return prefix + nanoId
}

export const getDeviceData = (agent: string) => {
  const ua = uaParser(agent)
  const data = {
    browser_name: ua.browser.name,
    browser_ver: ua.browser.version,
    cpu: ua.cpu.architecture,
    device_model: ua.device.model,
    device_type: ua.device.type,
    device_vendor: ua.device.vendor,
    os_name: ua.os.name,
    os_ver: ua.os.version,
  }
  return data
}

export const getUserAgent = (req: FastifyRequest) => {
  return req.headers['user-agent'] as string
}

export const getIP = (req: FastifyRequest) => {
  return (req.headers['x-forwarded-for'] as string) || req?.socket?.remoteAddress || ''
}

export const createFingerprint = (input: string): string => {
  const hash = createHash('sha256').update(input).digest('base64')
  return base64url.default.fromBase64(hash)
}

export const createCodeChallenge = (code_verifier: string): string => {
  const hash = createHash('sha256').update(code_verifier).digest('base64')
  return base64url.default.fromBase64(hash)
}

// convert redis hashmaps to array of objects
export const convertHashmapToObj = (data: any): any[] | undefined => {
  try {
    const result: any[] = []

    if (!Object.keys(data).length) return result

    for (const key in data) {
      const prop = data[key]
      const parsedProp = JSON.parse(prop)
      result.push(parsedProp)
    }

    return result
  } catch (error) {
    logger.error(error, { msg: 'convertHashmapToObj error' })
  }
}

export const getStaticFilePath = (): string => 'api/upload'

export const getStaticFileUrl = (
  domain: string,
  avatar: { path: string; name: string; file_hash?: string } | null | undefined,
): string => {
  let path = ''

  if (avatar?.path) {
    path = avatar.file_hash
      ? `https://${domain}${
          combineNameAndPathForImages({ ...avatar, file_hash: avatar.file_hash ?? '' })?.full_path ?? ''
        }`
      : `https://${domain}/${getStaticFilePath()}/${avatar.path + avatar.name}`
  }

  return path
}

export const hourToMillisecond = (hour: number) => {
  return Math.floor(hour) * 60 * 60 * 1000
}

export const minuteToMillisecond = (hour: number) => {
  return Math.floor(hour) * 60 * 1000
}

export const enumToArray = (enumeration: any) => {
  if (!enumeration) return []
  return Object.keys(enumeration).map((key) => enumeration[key])
}

export const getFileNameFromUrl = (_url: string) => {
  const parsedUrl = new URL(_url)
  return path.basename(parsedUrl.pathname)
}

export const getPaginationLimit = (limit: number | undefined) => {
  if (!limit || limit < 1) return 30
  if (limit > 50) return 50
  return limit
}

export type IUploadDirType = 'user' | 'workspace'

export const uniIsObject = (input: any) => {
  return Object.prototype.toString.call(input) === '[object Object]'
}

/**
 *
 * @param obj base object that should be transformed
 * @param keys which keys should be proceed
 * @param options
 * @returns transformed object
 */
export const transformArrayToKeyValue = (
  obj: { [key: string]: any },
  keys: string[],
  options?: {
    exploreArrays?: boolean
    exploreObjects?: boolean
  },
): any => {
  if (!uniIsObject(obj) || obj === null) return obj
  const transforms: { [key: string]: any } = {}

  for (const key in obj) {
    const value = obj[key]

    if (isArray(value) && keys.includes(key)) {
      transforms[key] = value[0]
    } else if (uniIsObject(value) && options?.exploreObjects) {
      transforms[key] = transformArrayToKeyValue(value, keys)
    } else if (isArray(value) && options?.exploreArrays) {
      transforms[key] = value.map((i) => transformArrayToKeyValue(i, keys))
    } else {
      transforms[key] = value
    }
  }

  return transforms
}

export const getMeetingRoleTile = (t: PERMISSION) => {
  switch (t) {
    case PERMISSION.Admin:
      return 'Admin'
    case PERMISSION.Collaborator:
      return 'Collaborator'
    case PERMISSION.Owner:
      return 'Owner'
    case PERMISSION.Viewer:
      return 'Viewer'

    default:
      return 'Viewer'
  }
}

export const generateES256KeyPair = (options?: IGenerateES256KeyPair) => {
  if (options) {
    const { path, name } = options
    const fullPath = join(path, name)
    spawnSync(`openssl ecparam -name prime256v1 -genkey -noout -out ${fullPath + '.private.key'}`, { shell: false })
    spawnSync(`openssl ec -in ${fullPath + '.private.key'} -pubout > ${fullPath + '.public.pem'}`, { shell: false })
  }
}

export const getServerAddress = () => {
  const { API_BACKEND_SERVER_ADDRESS, API_BACKEND_PORT } = getConfigs()

  if (isDevelopment() || isTest()) {
    return `https://${API_BACKEND_SERVER_ADDRESS}:${API_BACKEND_PORT}`
  }

  return 'https://' + API_BACKEND_SERVER_ADDRESS
}

export const isArrayEmpty = (arr: any): boolean => Array.isArray(arr) && !arr.length

export const isObjectEmpty = (obj: any): boolean => {
  if (obj && Object.keys(obj).length === 0) {
    return true
  }

  return false
}

export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

export const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export const randomNumber = (len: number) =>
  Math.floor(Math.pow(10, len - 1) + generateRandomNumber() * 9 * Math.pow(10, len - 1))

export const isObject = (i: any): boolean => {
  if ((typeof i === 'object' || typeof i === 'function') && i !== null) return true
  else return false
}

/**
 * Checks the regular expressions defined in `regexPatterns` and logs the result.
 *
 * @author Ali Mansoori
 */
export const checkRegExs = () => {
  const safeRegex: boolean[] = Object.entries(regexPatterns).map(([regex, pattern]) => regexChecker(regex, pattern))

  if (safeRegex.every((safe) => safe)) {
    logger.info(`All Regexes are ${consoleColorize('safe', 'green')}. 👌`)
  }
}

export const stringifyObject = (object: any, options?: { singleLine?: boolean }) => {
  const utilOptions: util.InspectOptions = { showHidden: false, compact: false, depth: null, maxArrayLength: null }

  if (options?.singleLine) {
    utilOptions.compact = true
    utilOptions.breakLength = Infinity
  }

  return util.inspect(object, utilOptions)
}


/**
 * Simply calls a promise but retries if it failed.
 */
export const retry = async <T>(fn: Promise<T>, maxRetries = 2, err = null): Promise<T> => {
  if (!maxRetries) return Promise.reject(err)

  return fn.catch((err) => {
    if (err?.response?.data) {
      logger.warning(err.response.data)
    }

    logger.warning(err + '\n' + 'Promise failed. Retrying...')
    return retry(fn, maxRetries - 1, err)
  })
}

export const onSuccessChecker = <T extends Context['onSuccess'][0]>(ctx: Context | undefined, fn: T): void => {
  if (ctx) {
    ctx.onSuccess.push(fn)
    return
  }

  fn()
}

export const onFailureChecker = <T extends Context['onFailure'][0]>(ctx: Context | undefined, fn: T): void => {
  if (ctx) {
    ctx.onFailure.push(fn)
  }
}
