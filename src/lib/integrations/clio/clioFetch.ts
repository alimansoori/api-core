import { generateError } from '@app/core/error/errorGenerator.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { fetchRequest } from '@app/lib/fetch.js'
import { logger } from '@app/lib/logger.js'
import { MODULE_CONFIG_KEY, MODULE_KEY } from '@app/shared-models/index.js'
import { stringify } from 'querystring'
import { IClioCredentials, IClioGetRefreshAccessReq, IClioGetRefreshAccessRes } from './interfaces/IClioApi.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'

interface IClioHeaders {
  Authorization?: string
  'X-BULK'?: boolean
}

const getRefreshAccess = async (data: IClioGetRefreshAccessReq) => {
  const { grant_type, client_secret, client_id, refresh_token } = data
  const query = stringify({
    client_id,
    client_secret,
    grant_type,
    refresh_token,
  } satisfies IClioGetRefreshAccessReq)
  const url = `oauth/token?${query}`
  // eslint-disable-next-line no-use-before-define
  const res = await fetchRequestClio<any, IClioGetRefreshAccessRes>('POST', url, null, {})
  return res
}

const handleRefreshAccessToken = async (credential: IClioCredentials): Promise<IClioCredentials | undefined> => {
  const { CLIO_APP_KEY, CLIO_APP_SECRET } = getConfigs()

  // getting new access token from clio api
  const newAccessToken = await getRefreshAccess({
    refresh_token: credential.refresh_token,
    client_id: CLIO_APP_KEY,
    client_secret: CLIO_APP_SECRET,
    grant_type: 'refresh_token',
  })

  if (newAccessToken?.body) {
    if (newAccessToken.status !== 200 || newAccessToken.body.error) {
      throw new Error('error in geting refresh access token from clio')
    }

    // update integration data with new access_token
    const repo = getRepo()
    const clio = await repo.integration.getUserIntegrationById(credential.user_integrated_module_id, MODULE_KEY.clio)
    if (!clio) return generateError([{ message: 'You are not connected to Clio.' }], 'BAD_REQUEST')

    const access = clio.user_module_config.find((i) => i.module_config.name === MODULE_CONFIG_KEY.clio.access_token)
    const refresh = clio.user_module_config.find((i) => i.module_config.name === MODULE_CONFIG_KEY.clio.refresh_token)

    repo.integration.updateUserIntegrationById(credential.user_integrated_module_id, {
      user_module_config: {
        update: [
          {
            where: { user_module_config_id: access!.user_module_config_id },
            data: { value: newAccessToken.body.access_token },
          },
          {
            where: { user_module_config_id: refresh!.user_module_config_id },
            data: { value: newAccessToken.body.refresh_token },
          },
        ],
      },
    })
    // TODO: clio
    /*
  await repo.integration.updateUserIntegrationByType(credential.user_id, 'clio', {
    meta: { access_token: newAccessToken.body.access_token, refresh_token: newAccessToken.body.refresh_token },
  });
  */

    return {
      access_token: newAccessToken.body.access_token,
      refresh_token: newAccessToken.body.refresh_token,
      user_integrated_module_id: credential.user_integrated_module_id,
    }
  }
}

export const fetchRequestClio = async <T, R>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  credential: IClioCredentials | null,
  data: T | null = null,
  headers?: IClioHeaders,
) => {
  try {
    // make request headers
    const headersRequest: IClioHeaders = { ...headers }
    if (credential?.access_token) headersRequest.Authorization = `Bearer ${credential.access_token}`

    let result = await fetchRequest<T, R>(method, 'https://app.clio.com/' + url, data, headersRequest)

    // handle expired clio access_token and get new access_token
    if (result) {
      if (result.status === 401 && credential) {
        const newCredential = await handleRefreshAccessToken(credential)

        // make request with new access_token
        if (newCredential) {
          headersRequest.Authorization = `Bearer ${newCredential.access_token}`
        }

        result = await fetchRequest<T, R>(method, 'https://app.clio.com/' + url, data, headersRequest)
      }
    }

    return result
  } catch (err) {
    logger.error(err)
    throw err
  }
}
