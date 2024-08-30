import { PrismaClient } from '@prisma/client'
import { modules } from './constants/module.js'
import { uniconsoleAccess } from './constants/access.js'
import { location } from './constants/location.js'
import { generalConfig } from './constants/generalConfig.js'
import { actions } from './constants/actions.js'
import { widgets } from './constants/widgets.js'
import { planConfig } from './constants/planConfig.js'
import { currencies } from './constants/currency.js'
import { countries } from './constants/country.js'
import { languages } from './constants/language.js'
import { timezones } from './constants/timezone.js'
import { moduleConfigs } from './constants/moduleConfig.js'
import { documentBlockType } from './constants/documentBlockType.js'
import { ISeedUp } from '@app/interfaces/prisma/seedUpItem.js'
import { virtualBackground } from './constants/virtualBackground.js'
import { twoFactorMethods } from './constants/twoFactorMethods.js'
import { nanoid } from 'nanoid'

export default <ISeedUp>{
  up: async (prisma: PrismaClient) => {
    await prisma.general_config.createMany({
      data: generalConfig,
    })

    await prisma.language.createMany({
      data: languages(),
    })

    await prisma.currency.createMany({
      data: currencies(),
    })

    await prisma.country.createMany({
      data: countries(),
    })

    for (const t of timezones()) {
      await prisma.timezone.create({
        data: t,
      })
    }

    for (const i of modules) {
      await prisma.module.create({
        data: i,
      })
    }

    await prisma.location.createMany({
      data: location,
    })

    for (const p of uniconsoleAccess) {
      await prisma.access.create({
        data: p,
      })
    }

    for (const i of moduleConfigs) {
      await prisma.module_config.create({
        data: i,
      })
    }

    await prisma.action.createMany({
      data: actions,
    })

    await prisma.widget.createMany({
      data: widgets,
    })

    for (const p of planConfig) {
      await prisma.plan_config.create({
        data: p,
      })
    }

    for (const i of documentBlockType) {
      await prisma.document_block_type.create({
        data: i,
      })
    }

    for (const vb of virtualBackground) {
      await prisma.virtual_background.create({
        data: {
          thumbnail: vb.thumbnail_name,
          file: {
            create: {
              name: vb.name,
              path: vb.path,
              is_sys: true,
              mime: 'image/jpg',
              file_hash: nanoid(31),
            },
          },
        },
      })
    }

    await prisma.two_factor_method.createMany({
      data: twoFactorMethods,
    })
  },
}
