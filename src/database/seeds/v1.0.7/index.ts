import { ISeedUp } from '@app/interfaces/prisma/seedUpItem.js'
import { PrismaClient } from '@prisma/client'

export default <ISeedUp>{
  up: async (prisma: PrismaClient) => {
    const servers = await prisma.server.findMany()

    if (servers.some((i) => i.server_id === 1)) {
      await prisma.server.update({
        where: { server_id: 1 },
        data: {
          core_api_address: 'https://staging.alimansoori71.us',
          core_ws_address: 'wss://staging.alimansoori71.us',
        },
      })
    }

    if (servers.some((i) => i.server_id === 2)) {
      await prisma.server.update({
        where: { server_id: 2 },
        data: {
          core_api_address: 'wss://coffee.xyz',
          core_ws_address: 'https://coffee.xyz',
        },
      })
    }

    if (servers.some((i) => i.server_id === 3)) {
      await prisma.server.update({
        where: { server_id: 3 },
        data: {
          core_api_address: 'wss://localic.com',
          core_ws_address: 'https://localic.com',
        },
      })
    }
  },
}
