import { IFormResponse } from './IFormResponse.js'

/**
 * Swiss army Request Handler. ⚔️⚔️
 */
export type RequestHandler<TParam = any, TRes extends IFormResponse<any> = any, TReq = any, TQuery = any> = {
  fastify: { Body: TReq; Params: TParam; Querystring: TQuery }
  Axios: { params: TParam; body: TReq; query: TQuery; response: TRes['App'] }
  Schema: { body: TReq; params: TParam; querystring: TQuery; response: TRes['Schema'] }
}
