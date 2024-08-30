import { IFormResponse, RequestHandler } from '../../index.js'
import { widget, user_widget } from '../../interfaces/backend.js'

/// //////////////////////////// get all widgets //////////////////////////////////////////////////////////
export type IGetAllWidgetsReqParam = {
  workspace_id: number
}
export type IGetAllWidgetsResData = widget[]
export type IGetAllWidgetsRes = IFormResponse<IGetAllWidgetsResData>
/**
 * @summary List all widgets
 * @statusCode 200
 * @method GET
 * @route /workspace/:workspace_id/dashboard/widgets/all
 */
export type IGetAllWidgetsApi = RequestHandler<IGetAllWidgetsReqParam, IGetAllWidgetsRes, {}>

/// //////////////////////////// manage use widget list //////////////////////////////////////////////////////////
export type IGetManageUserWidgetListReqParam = {
  workspace_id: number
}

export type IGetManageUserWidgetListReqData = {
  widget_keys: {
    name: string
    is_selected: boolean
  }[]
}
export type IGetManageUserWidgetListResData = {}
export type IGetManageUserWidgetListRes = IFormResponse<IGetManageUserWidgetListResData>
/**
 * @summary Manage use widget list
 * @statusCode 204,403
 * @method POST
 * @route /workspace/:workspace_id/dashboard/widgets
 */
export type IGetManageUserWidgetListApi = RequestHandler<
  IGetManageUserWidgetListReqParam,
  IGetManageUserWidgetListRes,
  IGetManageUserWidgetListReqData
>

/// //////////////////////////// get All user Widgets //////////////////////////////////////////////////////////
export type IGetAllUserWidgetsReqParam = {
  workspace_id: number
}
export type IGetAllUserWidgetsResData = user_widget[]
export type IGetAllUserWidgetsRes = IFormResponse<IGetAllUserWidgetsResData>
/**
 * @summary List All user Widgets
 * @statusCode 200
 * @method GET
 * @route /workspace/:workspace_id/dashboard/widgets
 */
export type IGetAllUserWidgetsApi = RequestHandler<IGetAllUserWidgetsReqParam, IGetAllUserWidgetsRes>
