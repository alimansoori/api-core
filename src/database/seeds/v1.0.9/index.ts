import { ISeedUp } from '@app/interfaces/prisma/seedUpItem.js'
import { PrismaClient } from '@prisma/client'
import { moduleConfigs } from './constants/index.js'

export default <ISeedUp>{
  up: async (prisma: PrismaClient) => {
    for (const config of moduleConfigs) {
      await prisma.module_config.create({ data: config })
    }
  },
}
