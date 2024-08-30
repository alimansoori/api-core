import { timezone } from '@prisma/client'
import dayjs from 'dayjs'

export const convertUserTimeToUTC = (timezone: timezone, time: Date | string, date: string) => {
  const targetTime = dayjs.utc(time).format('HH:mm:ss')

  const convertedTime = `${date}T${targetTime}`

  return dayjs.tz(dayjs.utc(convertedTime).format(), timezone.name).utc().toDate()
}
