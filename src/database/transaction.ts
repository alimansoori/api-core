import { Context, PrismaTransaction } from '@app/interfaces/index.js'
import { PrismaClient } from '@prisma/client'
import { injectable, inject } from 'tsyringe'
import Database from './index.js'
import { logger } from '@app/lib/logger.js'

@injectable()
export class Transaction {
  constructor(@inject(Database) private db: Database) {}
  public start = async <R>(
    fn: (context: Context) => Promise<R>,
    opt?: Parameters<PrismaClient['$transaction']>[1],
  ): Promise<R> => {
    const context: Context = { onFailure: [], onSuccess: [], prisma: undefined as unknown as PrismaTransaction }

    const prismaFn = async (prisma: PrismaTransaction): Promise<R> => {
      context.prisma = prisma
      return fn(context)
    }

    return this.db
      .getPrisma()
      .$transaction(prismaFn, opt)
      .then(async (result) => {
        for (const item of context.onSuccess) {
          try {
            const result = item() as any

            if (result instanceof Promise) {
              await result
            }
          } catch (err) {
            logger.error(err)
          }
        }

        return result
      })
      .catch(async (err) => {
        for (const item of context.onFailure) {
          try {
            const result = item() as any

            if (result instanceof Promise) {
              await result
            }
          } catch (err) {
            logger.error(err)
          }
        }

        throw err
      })
  }
}
