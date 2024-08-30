import { ResponseSchemas } from './api/json-schema/defaults.schema.js'
import { IFormResponse, RequestHandler } from './interfaces/index.js'

export * from './interfaces/index.js'
export * from './routes/index.js'
export * from './api/uniclient/index.js'
export * from './api/json-schema/index.js'
export * from './mediasoup-shared-types.js'

export enum ICancellationType {
  cancel = '1',
  decline = '2',
}

// OAuth
export const IHandleClioOAuthCallbackApiSchema = {
  tags: ['Oauth'],
  summary: 'Handle clio OAuth callback' as const,
  method: 'GET' as const,
  route: '/clio/callback' as const,

  hide: true as const,

  querystring: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
      },
      error: {
        type: 'string',
      },
      state: {
        type: 'string',
      },
    },
    additionalProperties: false,
  },
  response: {
    '302': ResponseSchemas[302](),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
    '403': ResponseSchemas[403](),
  },
}

/* ////////////////////////////////////////////// get file ////////////////////////////////////////////////////// */
// file
export interface IGetFileReqQuery {
  /**
   * @maxLength 31
   * @example test
   */
  file_hash: string
}
export interface IGetFileParam {
  /**
   * @minLength 1
   * @example test
   */
  file_name: string
}
export type IGetFileRes = IFormResponse<any>

/**
 * @summary Get file
 * @statusCode 404,200,403
 * @method GET
 * @route /:file_name
 */
export type IGetFileApi = RequestHandler<IGetFileParam, IGetFileRes, any, IGetFileReqQuery>
