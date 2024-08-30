import { IErrorForm, IErrors } from '@app/shared-models/index.js'
import { ErrorDetails } from './errorDetails.js'

export enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  FOUND = 302,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  RANGE_NOT_SATISFiABLE = 416,
}

const HTTP_STATUS_TO_ERROR_KEY: { [key: number]: keyof typeof IErrors } = {
  400: IErrors.VALIDATION_ERROR,
  401: IErrors.UNAUTHORIZED,
  403: IErrors.FORBIDDEN_ACCESS,
  404: IErrors.NOT_FOUND,
  429: IErrors.MAX_RATE_LIMIT,
  500: IErrors.INTERNAL_SERVER_ERROR,
}

export class CustomError {
  constructor(public error: { errors: IErrorForm[]; status: keyof typeof HTTP_STATUS }) {
    if (error.status === 'INTERNAL_SERVER_ERROR') {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(error.errors))
    }
  }
}

const getErrorDetailsForHTTPStatus = (status: keyof typeof HTTP_STATUS) => {
  const default_error_key = HTTP_STATUS_TO_ERROR_KEY[HTTP_STATUS[status]]
  const default_error_message = ErrorDetails[default_error_key].message
  return {
    key: default_error_key,
    message: default_error_message,
  }
}

export const generateError = (messages: IErrorForm[], status: keyof typeof HTTP_STATUS) => {
  const error = getErrorDetailsForHTTPStatus(status)

  if (messages.length === 0) messages.push(error)

  for (const message of messages) {
    if (!message.key) message.key = error.key
  }

  throw new CustomError({ errors: messages, status })
}
