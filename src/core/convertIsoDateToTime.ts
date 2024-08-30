import dayjs from 'dayjs'

export function convertIsoDateToTime(iso: Date | string) {
  return dayjs.utc(iso).format('HH:mm:ss')
}

export function convertTimeToDate(time: Date) {
  return dayjs().utc().set('hour', time.getHours()).set('minute', time.getMinutes()).set('second', time.getSeconds())
}
