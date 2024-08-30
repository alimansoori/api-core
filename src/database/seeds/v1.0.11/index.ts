import { ISeedUp } from '@app/interfaces/prisma/seedUpItem.js'
import {
  BACKEND_SIGNAL_WS,
  CORE_V2_SIGNAL_MESSAGING,
  CORE_V2_SIGNAL_NOTIFICATIONS,
  CORE_V2_SIGNAL_WS,
  MediaSoupShareableType,
} from '../../../shared-models/index.js'
import { PrismaClient } from '@prisma/client'

export default <ISeedUp>{
  up: async (prisma: PrismaClient) => {
    const signalLogTypes = Object.keys(CORE_V2_SIGNAL_WS)
    const messagingLogTypes = Object.keys(CORE_V2_SIGNAL_MESSAGING)
    const notificationLogTypes = Object.keys(CORE_V2_SIGNAL_NOTIFICATIONS)
    const backendLogTypes = Object.keys(BACKEND_SIGNAL_WS)
    const recordLogTypes = Object.keys(MediaSoupShareableType)

    const allTypes = new Set([
      ...signalLogTypes,
      ...messagingLogTypes,
      ...notificationLogTypes,
      ...recordLogTypes,
      ...backendLogTypes,
    ])

    await prisma.meeting_log_type.createMany({
      data: [...allTypes].map((name) => ({ name })),
    })
  },
}
