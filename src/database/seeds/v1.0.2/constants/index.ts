import { PrismaClient } from '@prisma/client'

export const upsertModulesForUsertype = async (prisma: PrismaClient) => {
  const usertype = await prisma.usertype.findFirst()
  if (!usertype) return

  const modules = await prisma.module.findMany()
  await prisma.usertype_module.createMany({
    data: modules.map((i) => ({
      console_project_id: 1,
      module_id: i.module_id,
      usertype_id: 2,
    })),
  })
}
