import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { logger } from '@app/lib/logger.js'
import { container, singleton } from 'tsyringe'
import MediasoupRoom from '../mediasoup/room/mediasoup-room.js'
import MediaserverRepository from '@app/database/entities/mediaserver/mediaserver.repo.js'

const mediaserverRepo = container.resolve(MediaserverRepository)
const { DISABLE_MEDIASERVER_TRACKER } = getConfigs()
@singleton()
export default class MediaserverTracker {
  private excludeTypes = ['--heartbeat--', 'ping', 'pong']
  private repo = getRepo()

  async track(
    params: {
      type: string
      meeting_id: number
      fired_by?: string
      fired_target?: string
      extra?: Record<string, any> | null
    },
    mediaRoom?: MediasoupRoom,
  ) {
    if (DISABLE_MEDIASERVER_TRACKER) return false

    try {
      const { type, meeting_id, fired_by, fired_target, extra } = params
      if (this.excludeTypes.includes(type)) return false

      const firedByFirstPart = fired_by?.split('_')[0]
      const user_id = firedByFirstPart ? +firedByFirstPart : undefined

      return mediaserverRepo.createMeetingLog(
        {
          meeting: { connect: { meeting_id } },
          type: { connectOrCreate: { where: { name: type }, create: { name: type } } },
          user: user_id && !isNaN(user_id) ? { connect: { user_id: user_id } } : undefined,
          fired_by,
          fired_target,
          extra: extra ?? undefined,
          happened_at: new Date(),
        },
        mediaRoom,
      )
    } catch (err) {
      logger.error(err)
    }
  }
}
