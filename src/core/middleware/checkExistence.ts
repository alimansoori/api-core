import { logger } from '@app/lib/logger.js'
import { respUnsuccess } from '@app/utility/helpers/index.js'
import { FastifyReply } from 'fastify'
import { container } from 'tsyringe'

// this middleware checks if the data that you are looking fot it via param exists or not
// if it finds the data then it put the data in the req.dataFromMiddleware otherwise it sends
// the 404 response to the client
export function checkExistence(
  Repository: any,
  param: string,
  serviceName: string,
  checkUser?: boolean,
  relationModels?: string[] | { [key: string]: any },
  is_string?: boolean,
) {
  return async (req: any, reply: FastifyReply) => {
    const repository: any = container.resolve(Repository)

    if (req.body || req.params) {
      let include: { [key: string]: boolean } = {}

      if (Array.isArray(relationModels)) {
        relationModels?.forEach((relationModel) => {
          include[relationModel] = true
        })
      } else if (relationModels) {
        include = relationModels
      }

      let data

      if (relationModels) {
        data = await repository.findOne({
          where: {
            [param]: req.body?.[param] ? req.body[param] : is_string ? req.params[param] : +req.params[param],
          },
          include,
        })
      } else {
        data = await repository.findOne({
          where: {
            [param]: req.body?.[param] ? req.body[param] : is_string ? req.params[param] : +req.params[param],
          },
        })
      }

      const error = [{ message: `${serviceName} not found` }]

      if (data) {
        if (checkUser && data?.user_id !== req.user.user_id) {
          logger.error(new Error('checkExistence'), { msg: error })
          return respUnsuccess(reply, error, 'NOT_FOUND')
        }

        req.dataFromMiddleware = data
        return
      }

      logger.error(new Error('it may created by user_id or param'), { msg: error })
      return respUnsuccess(reply, error, 'NOT_FOUND')
    }
  }
}
