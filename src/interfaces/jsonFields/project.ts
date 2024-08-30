import { Prisma } from '@prisma/client'

export interface IProjectMeta extends Prisma.JsonObject {
  origin?: 'clio'
  clio?: {
    account_id: string
    matter_id: number
  }[]
  email_domain_whitelist?: string[]
}
