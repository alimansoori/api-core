/* eslint-disable no-process-env */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const { NODE_ENV } = process.env
  const seedClass = await import(`./${NODE_ENV === 'development' ? 'src' : 'dist'}/database/seeds/index.js`)

  const seedManager = new seedClass.SeedManager(prisma)
  await seedManager.run()
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
