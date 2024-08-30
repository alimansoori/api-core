import { Prisma } from '@prisma/client'
import moment from 'moment-timezone'

export const timezones = () => {
  const model: Prisma.timezoneCreateArgs['data'][] = []
  const timezones = moment.tz.names()

  for (const name of timezones) {
    model.push({
      name,
      /*       abbr: moment.tz.zone(name).abbrs,
      offset: moment.tz.zone(name).offsets,
 */
    })
  }

  return model
}
