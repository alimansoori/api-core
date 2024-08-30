import { Prisma } from '@prisma/client'

export interface IContactMeta extends Prisma.JsonObject {
  origin?: 'clio' | 'google'
  clio?: {
    account_id: string
    contact_id: number
  }[]
  google?: {
    gmail: string
    resource_name: string
  }[]
}

export interface IContactIdentityMeta extends Prisma.JsonObject {
  origin?: 'clio'
  clio?: {
    account_id: string
    email_id?: number
    phone_id?: number
  }[]
}
