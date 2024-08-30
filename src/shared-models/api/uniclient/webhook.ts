import { IFormResponse, RequestHandler } from '../../index.js'

//* **************** stripeWebhook *****************
export interface IStripeWebhookResData {}
export type IStripeWebhookRes = IFormResponse<IStripeWebhookResData>
/**
 * @summary Stripe webhook
 * @statusCode 200
 * @method POST
 * @public true
 * @hide true
 * @route /stripe
 */
export type IStripeWebhookApi = RequestHandler<any, IStripeWebhookRes, Record<string, any>>

//* **************** clioContactWebhook *****************
export interface IClioContactWebhookResData {}
export type IClioContactWebhookRes = IFormResponse<IClioContactWebhookResData>
/**
 * @summary Clio contact webhook
 * @statusCode 204
 * @method POST
 * @public true
 * @hide true
 * @route /clio/:user_id/contact
 */
export type IClioContactWebhookApi = RequestHandler<
  { user_integrated_module_id: number },
  IClioContactWebhookRes,
  Record<string, any>
>

//* **************** clioMatterWebhook *****************
export interface IClioMatterWebhookResData {}
export type IClioMatterWebhookRes = IFormResponse<IClioMatterWebhookResData>
/**
 * @summary Clio matter webhook
 * @statusCode 204
 * @hide true
 * @method POST
 * @public true
 * @route /clio/:user_id/matter
 */
export type IClioMatterWebhookApi = RequestHandler<
  { user_integrated_module_id: number },
  IClioMatterWebhookRes,
  Record<string, any>
>

//* **************** clioCalEntryWebhook *****************
export interface IClioCalEntryWebhookResData {}
export type IClioCalEntryWebhookRes = IFormResponse<IClioCalEntryWebhookResData>
/**
 * @summary Clio calendar entry webhook
 * @statusCode 204
 * @method POST
 * @hide true
 * @public true
 * @route /clio/:user_id/calendar_entry
 */
export type IClioCalEntryWebhookApi = RequestHandler<
  { user_integrated_module_id: number },
  IClioCalEntryWebhookRes,
  Record<string, any>
>

//* **************** waitListWebhook *****************
// export interface IWaitListWebhookResData {}
// export type IWaitListWebhookRes = IFormResponse<IWaitListWebhookResData>;
// /**
//  * @summary waitList webhook
//  * @statusCode 200
//  * @method POST
//  * @public true
//  * @hide true
//  * @route /waitlist
//  */
// export type IWaitListWebhookApi = RequestHandler<any, IWaitListWebhookRes, Record<string, any>>;
