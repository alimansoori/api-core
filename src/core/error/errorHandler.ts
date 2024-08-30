import RocketchatApi from '@app/lib/integrations/rocketchat/rocketchatApi.js'
import { IErrorForm, IErrors } from '@app/shared-models/index.js'
import { isProduction, respUnsuccess } from '@app/utility/helpers/index.js'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library.js'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { CustomError, HTTP_STATUS } from './errorGenerator.js'
import { logger } from '@app/lib/logger.js'
import { ErrorDetails } from './errorDetails.js'
const rocketchatApi = container.resolve(RocketchatApi)

export const errorHandler = async (exception: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (reply.rc_user_id) {
    for (const id of reply.rc_user_id) {
      rocketchatApi.removeUserByUserId(id).catch((err) => {
        logger.error(err)
      })
    }
  }

  if (exception instanceof CustomError) {
    logger.log(exception)
    return respUnsuccess(reply, exception.error.errors, exception.error.status)
  }

  if (exception.message.includes('must match format "phone-number"')) {
    return respUnsuccess(
      reply,
      [
        {
          key: IErrors.PHONE_NUMBER_INVALID,
          message: ErrorDetails.PHONE_NUMBER_INVALID.message,
        },
      ],
      'BAD_REQUEST',
    )
  }

  if (!exception.validation?.length) {
    logger.error(exception)
  }

  if (exception instanceof PrismaClientKnownRequestError) {
    if (isProduction()) {
      return respUnsuccess(
        // runtime errors
        reply,
        [{ message: 'Something went wrong!' }],
        'INTERNAL_SERVER_ERROR',
      )
    } else {
      // database errors
      const errors: IErrorForm[] = []
      let status: keyof typeof HTTP_STATUS

      if (exception.code === 'P2002') {
        errors.push({
          message: (exception.meta as any)?.target,
        })
        status = 'BAD_REQUEST'
      } else if (exception.code === 'P2017') {
        errors.push({
          message: `${(exception.meta as any)?.child_name} not found`,
        })
        status = 'NOT_FOUND'
      } else {
        if (isProduction()) {
          errors.push({
            message: 'Something went wrong.',
          })
        } else {
          errors.push({
            message: exception.toString(),
          })
        }

        status = 'INTERNAL_SERVER_ERROR'
      }

      return respUnsuccess(reply, errors, status)
    }
  }

  if (exception instanceof PrismaClientValidationError) {
    const errors: IErrorForm[] = []

    if (isProduction()) {
      errors.push({
        message: 'Something went wrong.',
      })
    } else {
      errors.push({
        message: exception.toString(),
      })
    }

    const status = 'INTERNAL_SERVER_ERROR'
    return respUnsuccess(reply, errors, status)
  }

  if (exception.validation?.length) {
    // validation errors

    const errors: IErrorForm[] = []
    const multiMessage = exception.message.split(', ')

    if (multiMessage.length) {
      multiMessage.forEach((message: string) => {
        errors.push({
          message,
        })
      })
    } else {
      errors.push({
        message: exception.message,
      })
    }

    return respUnsuccess(reply, errors, 'BAD_REQUEST')
  }

  if (reply.statusCode === 429) {
    exception.message = 'Too many requests. Please retry in 5 minutes.'
    reply.send(exception)
  }

  if (isProduction()) {
    return respUnsuccess(
      // runtime errors
      reply,
      [{ message: 'Something went wrong!' }],
      'INTERNAL_SERVER_ERROR',
    )
  } else {
    return respUnsuccess(
      // runtime errors
      reply,
      [{ message: exception.message }],
      'INTERNAL_SERVER_ERROR',
    )
  }
}
