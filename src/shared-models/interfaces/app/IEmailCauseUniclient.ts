export const emailCousesInput = [
  'addEmail',
  'again',
  'anonymousUserAddEmail',
  'changeEmail',
  'changePassword',
  'changePrimaryEmail',
  'changeUsername',
  'deleteAccount',
  'deleteWorkspace',
  'forgot',
  'login',
  'signUp',
  'verifyForAddEmail',
] as const

export type IEmailCauseUniclient = (typeof emailCousesInput)[number]
