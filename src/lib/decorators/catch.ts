/* eslint-disable no-useless-call */

import { Prisma } from '@prisma/client'

type HandlerFunction = (error: Error, ctx: any) => void

function _handleError(ctx: any, handler: HandlerFunction, error: Error) {
  // Check if error is instance of given error type
  if (typeof handler === 'function') {
    // Run handler with error object and class context
    handler.call(null, error, ctx)
  } else {
    // Throw error further
    // Next decorator in chain can catch it
    throw error
  }
}

export const Catch = (param: { handler: HandlerFunction }): MethodDecorator => {
  return (target: Object, key: string | symbol, descriptor: PropertyDescriptor) => {
    const fn = descriptor.value

    descriptor.value = (...args: any[]) => {
      try {
        const result = fn.apply(this, args)

        // Check if method is asynchronous
        if (result && result instanceof Promise) {
          // Return promise
          return result.catch((error: any) => {
            _handleError(this, param?.handler, error)
          })
        }

        // Return actual result
        return result
      } catch (error: any) {
        _handleError(this, param?.handler, error)
      }
    }
  }
}

export const RepoErrorHandler = <T extends { new (...args: any[]): {} }>(constructor: T) => {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)
      const methodNames = Object.getOwnPropertyNames(constructor.prototype).filter((name) => name !== 'constructor')

      methodNames.forEach((methodName) => {
        const originalMethod = (this as any)[methodName]

        ;(this as any)[methodName] = async function (...methodArgs: any[]) {
          try {
            return await originalMethod.apply(this, methodArgs)
          } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              Error.captureStackTrace(error, this)
            }

            throw error
          }
        }
      })
    }
  }
}
