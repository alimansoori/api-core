import { ISeedUp } from '@app/interfaces/prisma/seedUpItem.js'
import { PrismaClient } from '@prisma/client'
import { LOCATION_KEY } from '../../../shared-models/index.js'

export default <ISeedUp>{
  up: async (prisma: PrismaClient) => {
    await prisma.location.update({
      where: { key: LOCATION_KEY.google_meet },
      data: {
        name: 'Google Meet',
      },
    })

    await prisma.location.update({
      where: { key: LOCATION_KEY.zoom },
      data: {
        name: 'Zoom meeting',
      },
    })
  },
}
