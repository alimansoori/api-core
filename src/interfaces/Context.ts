import { PrismaTransaction } from './index.js'

export type Context = {
  prisma: PrismaTransaction

  onSuccess: (() => (() => any) | Promise<any> | void)[]

  onFailure: (() => (() => any) | Promise<any> | void)[]
}
