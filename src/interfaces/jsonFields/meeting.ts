import { Prisma } from '@prisma/client'

export interface IMeetingMeta extends Prisma.JsonObject {
  origin?: 'clio'
  clio?: {
    account_id: string
    calendar_entry_id: number
  }[]
  email_domain_whitelist?: string[]
}
