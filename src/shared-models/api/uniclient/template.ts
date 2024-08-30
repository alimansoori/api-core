import { IFormResponse, RequestHandler } from '../../interfaces/index.js'

//* **************** getAll *****************
export type IGetAllIntegrationTemplateResData = {}
export type IGetAllIntegrationTemplateRes = IFormResponse<IGetAllIntegrationTemplateResData>
/**
 * @summary List all integration templates
 * @deprecated true
 */
export type IGetAllIntegrationTemplateApi = RequestHandler<any, IGetAllIntegrationTemplateRes, any>
