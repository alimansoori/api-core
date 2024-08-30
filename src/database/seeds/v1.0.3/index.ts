import { ISeedUp } from '@app/interfaces/prisma/seedUpItem.js'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'
import { MODULE_KEY } from '../../../shared-models/index.js'

export default <ISeedUp>{
  up: async (prisma: PrismaClient) => {
    await prisma.module.update({
      where: { key: MODULE_KEY.google_calendar },
      data: {
        logo: {
          create: {
            name: 'google_calendar.svg',
            path: 'icons/',
            is_sys: true,
            file_hash: nanoid(31),
            mime: 'image/svg+xml',
          },
        },
      },
    })

    await prisma.module.update({
      where: { key: MODULE_KEY.google_contacts },
      data: {
        logo: {
          create: {
            name: 'google_contacts.svg',
            path: 'icons/',
            is_sys: true,
            file_hash: nanoid(31),
            mime: 'image/svg+xml',
          },
        },
      },
    })

    await prisma.module.update({
      where: { key: MODULE_KEY.slack },
      data: {
        logo: {
          create: { name: 'slack.svg', path: 'icons/', is_sys: true, file_hash: nanoid(31), mime: 'image/svg+xml' },
        },
      },
    })

    await prisma.module.update({
      where: { key: MODULE_KEY.zapier },
      data: {
        logo: {
          create: { name: 'zapier.svg', path: 'icons/', is_sys: true, file_hash: nanoid(31), mime: 'image/svg+xml' },
        },
      },
    })

    await prisma.module.update({
      where: { key: MODULE_KEY.clio },
      data: {
        logo: { create: { name: 'clio.svg', path: 'icons/', is_sys: true, file_hash: nanoid(31), mime: 'image/svg+xml' } },
      },
    })

    await prisma.module.update({
      where: { key: MODULE_KEY.stripe },
      data: {
        logo: {
          create: { name: 'stripe.svg', path: 'icons/', is_sys: true, file_hash: nanoid(31), mime: 'image/svg+xml' },
        },
      },
    })

    await prisma.module.update({
      where: { key: MODULE_KEY.outlook_calendar },
      data: {
        logo: {
          create: { name: 'outlook.svg', path: 'icons/', is_sys: true, file_hash: nanoid(31), mime: 'image/svg+xml' },
        },
      },
    })
  },
}
