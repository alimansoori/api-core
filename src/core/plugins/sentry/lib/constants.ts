export const REQ_SENTRY_TX = '__sentry_transaction'
declare const __SENTRY_DEBUG__: boolean
export const IS_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === 'undefined' ? true : __SENTRY_DEBUG__
