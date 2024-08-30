import { IFormResponse } from '../../index.js'
import { INotification, IPaginationReq, IPaginationRes, RequestHandler } from '../../interfaces/index.js'

export type INotificationStatus = 'read' | 'unread' | 'unseen' | 'seen' | 'all'

//* **************** getAllNotifications *****************
export interface IGetAllNotificationsQuery extends IPaginationReq {
  type?: INotificationStatus
}
export interface IGetAllNotificationsResData extends IPaginationRes {
  result: INotification[]
  read_count: number
  seen_count: number
}
export type IGetAllNotificationsRes = IFormResponse<IGetAllNotificationsResData>
/**
 * @summary List all notifications
 * @statusCode 200
 * @method GET
 * @route /user/notification
 */
export type IGetAllNotificationsApi = RequestHandler<any, IGetAllNotificationsRes, any, IGetAllNotificationsQuery>

//* **************** bulkReadNotifications *****************
export type IBulkNotificationsActionApiReq = {
  /**
   * @example [1,6,8]
   * @minItems 1
   * @maxItems 200
   */
  notification_ids?: number[]
  /**
   * @example seen
   */
  action: 'seen' | 'read' | 'unread' | 'clear'
  /**
   * @description The action will have effect on all notifications that are past this time.
   * If `notification_ids` is passed, this will be applied as a filter to them.
   * @format date-time
   * @example 2020-10-10T10:00:00
   */
  from_date?: Date
  /**
   * The action will have effect on all notifications that are before this time.
   * If `notification_ids` is passed, this will be applied as a filter to them.
   * @format date-time
   * @example 2021-10-10T10:00:00
   */
  to_date?: Date
}
export type IBulkNotificationsActionResData = {
  successIds: number[]
  failedIds: number[]
}
export type IBulkNotificationsActionRes = IFormResponse<IBulkNotificationsActionResData>
/**
 * @summary Bulk notifications action
 * @statusCode 200
 * @method POST
 * @route /user/notification/status/bulk-action
 */
export type IBulkNotificationsActionApi = RequestHandler<any, IBulkNotificationsActionRes, IBulkNotificationsActionApiReq>

//* **************** updateNotificationStatus *****************
export interface IUpdateNotificationStatusParam {
  /**
   * @example 10
   */
  notification_id: number
}
export interface IUpdateNotificationStatusReq {
  /**
   * @example is_read
   */
  action: 'is_read' | 'is_seen'
}
export type IUpdateNotificationStatusResData = {}
export type IUpdateNotificationStatusRes = IFormResponse<IUpdateNotificationStatusResData>
/**
 * @summary Update notification status
 * @statusCode 201
 * @method PUT
 * @route /user/notification/status/:notification_id
 */
export type IUpdateNotificationStatusApi = RequestHandler<
  IUpdateNotificationStatusParam,
  IUpdateNotificationStatusRes,
  IUpdateNotificationStatusReq
>

//* **************** testNotification *****************
export type ITestNotificationResData = {}
export type ITestNotificationRes = IFormResponse<ITestNotificationResData>
/**
 * @summary Test notification
 * @statusCode 200
 * @method GET
 * @route /user/notification/test
 */
export type ITestNotificationApi = RequestHandler<any, ITestNotificationRes>
