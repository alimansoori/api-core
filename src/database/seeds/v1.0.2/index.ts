import { ISeedUp } from '@app/interfaces/prisma/seedUpItem.js'
import { PrismaClient } from '@prisma/client'
import { upsertModulesForUsertype } from './constants/index.js'

export default <ISeedUp>{
  up: async (prisma: PrismaClient) => {
    await upsertModulesForUsertype(prisma)
  },
}
