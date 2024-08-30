import { IErrors } from '@app/shared-models/index.js'

export const ErrorDetails: { [key in IErrors]: { message: string } } = {
  ACCESS_TOKEN_EXPIRED: {
    message: 'Access token has expired, please get a new one',
  },
  ACCESS_TOKEN_INVALID: {
    message: 'Access token is invalid',
  },
  ALREADY_JOINED: {
    message: 'You have joined before',
  },
  CONSUME_ERROR: {
    message: 'There was a problem while consuming the stream',
  },
  DEADLINE_PASSED_FOR_ACCESS: {
    message: 'Deadline for accessing this section has been reached',
  },
  DISABLED_PRIVACY: {
    message: 'You may not access this section due to its privacy setting',
  },
  DUPLICATE: {
    message: 'Duplication detected',
  },
  DUPLICATE_JOIN_REQUEST: {
    message: 'You have sent a request to join before',
  },
  EXISTED: {
    message: 'Already exists',
  },
  FORBIDDEN_ACCESS: {
    message: "You don't have access to this section",
  },
  BAD_REQUEST: {
    message: 'Bad request error encountered, please revise',
  },
  HAS_PENDING_REQUEST_PRIVACY: {
    message: 'You have sent a request to join before',
  },
  HOLD_STATUS: {
    message: 'The status is on hold',
  },
  MAX_ATTENDEE_LIMIT: {
    message: 'Meeting has reached its maximum attendee capacity',
  },
  MAX_RATE_LIMIT: {
    message: 'You have reached the rate limitation, please halt for some time before making any new requests',
  },
  MEETING_MIGRATED: {
    message: 'Meeting room has been migrated to another server',
  },
  MEETING_NOT_FOUND: {
    message: 'Meeting was not found',
  },
  MODULE_DISABLED: {
    message: 'The module you are trying to access is not enabled',
  },
  NEED_ASK_PERMISSION_PRIVACY: {
    message: 'You have to request permission to join this section',
  },
  NEED_PASSWORD_TO_ACCESS: {
    message: 'You need password to access this section',
  },
  NEED_REQUIRED_QUERY_FIELDS: {
    message: 'Required query fields are missing',
  },
  NOT_ATTENDEE: {
    message: 'You are not an attendee',
  },
  NOT_FOUND: {
    message: 'Record not found',
  },
  NOT_LIVE: {
    message: 'The room/meeting is not live',
  },
  ON_PROGRESS: {
    message: 'Your intended service is already running',
  },
  PAST_MEETING_NOT_FOUND: {
    message: 'Past meeting was not found',
  },
  PLAN_UPGRADE_REQUIRED: {
    message: 'You need to upgrade your plan for this action',
  },
  PRODUCE_ERROR: {
    message: 'There was an error while producing the stream',
  },
  PRODUCE_EXISTS: {
    message: 'A producer with this type exists',
  },
  INVALID_CODEC: {
    message: 'Invalid codec is selected',
  },
  PRODUCE_LOCKED: {
    message: 'Producer is locked',
  },
  REFRESH_TOKEN_BLACKLIST: {
    message: 'Refresh token is on the blacklist',
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh token has expired',
  },
  REFRESH_TOKEN_INVALID: {
    message: 'Refresh token is invalid',
  },
  REFRESH_TOKEN_NOT_DEFINED: {
    message: 'No refresh token found',
  },
  SERVER_NOT_FOUND: {
    message: 'Workspace server not found',
  },
  SIGNIN_REQUIRED: {
    message: 'You need to be signed in to perform this action',
  },
  UNAUTHORIZED: {
    message: 'You are not authorized',
  },
  VALIDATION_ERROR: {
    message: 'There was an error while validating the data',
  },
  INTERNAL_SERVER_ERROR: {
    message: 'There was problem in our server',
  },
  RECEIVER_NOT_FOUND: {
    message: 'Receiver user was not found',
  },
  SENDER_NOT_FOUND: {
    message: 'Sender user was not found',
  },
  PHONE_NUMBER_INVALID: {
    message: 'Phone number is invalid',
  },
  MISSING_END_DATE: {
    message: 'You must send "end_date" if you set "terminator_type" to "end_date"',
  },
  MISSING_REPEAT_INTERVAL: {
    message: 'You must send "repeat_interval" if you set "terminator_type" to "repeat_interval"',
  },
  SENDER_RECEIVER_WORKSPACE_NOT_MATCHED: {
    message: 'Sender and receiver users are not in the same workspace',
  },
  NO_ACCESS_TO_BREAKOUTROOM: {
    message: "You don't have access to this breakoutroom",
  },
}
