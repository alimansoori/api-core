import { logger } from '@app/lib/logger.js'
import { getConfigs } from '@app/lib/config.validator.js'
import Database from '@app/database/index.js'
import { container } from 'tsyringe'

export default async () => {
  const { CLEAR_SOCKET_DATA_ON_START_APP } = getConfigs()

  const db = container.resolve(Database)
  logger.log('SOCKET DATA ' + CLEAR_SOCKET_DATA_ON_START_APP)

  if (CLEAR_SOCKET_DATA_ON_START_APP) {
    try {
      const pipeline = db.getRedis().pipeline()

      const subsIndex = await db.getRedis().keys('*:subs')
      const subscribesInfo = await db.getRedis().keys('sub:*')
      pipeline.del([...subsIndex, ...subscribesInfo])
      await pipeline.exec()
      logger.info('UNUSED SOCKET DATA SUCCESSFULLY REMOVED FROM REDIS')
    } catch (e: any) {
      logger.error('FAILED TO REMOVE SOCKET DATA FROM REDIS', e)
    }
  }
}
