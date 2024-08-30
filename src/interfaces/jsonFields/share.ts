import { Prisma } from '@prisma/client'

export interface IShareMeta extends Prisma.JsonObject {
  label?: string | null
}
