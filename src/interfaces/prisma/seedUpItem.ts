import { PrismaClient } from '@prisma/client'

export interface ISeedUp {
  up: (prisma: PrismaClient) => Promise<void>
}

export interface ISeedUpItem extends ISeedUp {
  version: string
}
