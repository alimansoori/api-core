export enum IErrors {
  ACCESS_TOKEN_EXPIRED = 'ACCESS_TOKEN_EXPIRED',
  ACCESS_TOKEN_INVALID = 'ACCESS_TOKEN_INVALID',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  REFRESH_TOKEN_NOT_DEFINED = 'REFRESH_TOKEN_NOT_DEFINED',
  REFRESH_TOKEN_BLACKLIST = 'REFRESH_TOKEN_BLACKLIST',
  SIGNIN_REQUIRED = 'SIGNIN_REQUIRED',
  NEED_ASK_PERMISSION_PRIVACY = 'NEED_ASK_PERMISSION_PRIVACY',
  NEED_PASSWORD_TO_ACCESS = 'NEED_PASSWORD_TO_ACCESS',
  DEADLINE_PASSED_FOR_ACCESS = 'DEADLINE_PASSED_FOR_ACCESS',
  DISABLED_PRIVACY = 'DISABLED_PRIVACY',
  FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_ATTENDEE = 'NOT_ATTENDEE',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  EXISTED = 'EXISTED',
  ALREADY_JOINED = 'ALREADY_JOINED',
  DUPLICATE_JOIN_REQUEST = 'DUPLICATE_JOIN_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MAX_ATTENDEE_LIMIT = 'MAX_ATTENDEE_LIMIT',
  HAS_PENDING_REQUEST_PRIVACY = 'HAS_PENDING_REQUEST_PRIVACY',
  DUPLICATE = 'DUPLICATE',
  NEED_REQUIRED_QUERY_FIELDS = 'NEED_REQUIRED_QUERY_FIELDS',
  MAX_RATE_LIMIT = 'MAX_RATE_LIMIT',
  MODULE_DISABLED = 'MODULE_DISABLED',
  NOT_LIVE = 'NOT_LIVE',
  PRODUCE_ERROR = 'PRODUCE_ERROR',
  PRODUCE_EXISTS = 'PRODUCE_EXISTS',
  PRODUCE_LOCKED = 'PRODUCE_LOCKED',
  CONSUME_ERROR = 'CONSUME_ERROR',
  ON_PROGRESS = 'ON_PROGRESS',
  INVALID_CODEC = 'INVALID_CODEC',
  PLAN_UPGRADE_REQUIRED = 'PLAN_UPGRADE_REQUIRED',
  MEETING_NOT_FOUND = 'MEETING_NOT_FOUND',
  PAST_MEETING_NOT_FOUND = 'PAST_MEETING_NOT_FOUND',
  SERVER_NOT_FOUND = 'SERVER_NOT_FOUND',
  MEETING_MIGRATED = 'MEETING_MIGRATED',
  HOLD_STATUS = 'HOLD_STATUS',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  RECEIVER_NOT_FOUND = 'RECEIVER_NOT_FOUND',
  SENDER_NOT_FOUND = 'SENDER_NOT_FOUND',
  PHONE_NUMBER_INVALID = 'PHONE_NUMBER_INVALID',
  MISSING_END_DATE = 'MISSING_END_DATE',
  MISSING_REPEAT_INTERVAL = 'MISSING_REPEAT_INTERVAL',
  SENDER_RECEIVER_WORKSPACE_NOT_MATCHED = 'SENDER_RECEIVER_WORKSPACE_NOT_MATCHED',
  NO_ACCESS_TO_BREAKOUTROOM = 'NO_ACCESS_TO_BREAKOUTROOM',
}
