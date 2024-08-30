import dayjs, { Dayjs } from 'dayjs'

export const getFutureDate = (minute = 30): Date => {
  return new Date(new Date().setMinutes(new Date().getMinutes() + minute))
}

export const isDateExpired = (date: Date): boolean => {
  if (date < new Date()) return false
  return true
}

export const convertDateToDbDate = (date: Date): string => {
  return date.toJSON().slice(0, 19).replace('T', ' ')
}

export const isPast = (date: Date | string): boolean => {
  if (typeof date === 'string') date = new Date(date)
  let past = false
  if (date < new Date()) past = true
  return past
}

/**
 * Shows how many times the week day pointed by {@link date} has occurred
 * in the month until {@link date}
 *
 * *e.g.* If {@link date} points to **2nd Tuesday of the month**, then the
 * returned value will be `2`
 *
 * @example
 * ```
 * const date = new Date("2023-05-17");
 * getWeekDayOccurrencesInMonthUntil(date) // 3
 * ```
 */
export const getWeekDayOccurrencesInMonthUntil = (date: Date) => {
  const dayjsDate = dayjs(date)
  const weekDay = dayjsDate.day()
  const firstDayOfMonth = dayjsDate.date(1)
  let weekDayOccurrences = 0
  if (firstDayOfMonth.day() <= weekDay) weekDayOccurrences++

  let currentStep = firstDayOfMonth.add(1, 'week').day(weekDay)

  while (currentStep.toDate() <= dayjsDate.toDate()) {
    weekDayOccurrences++
    currentStep = currentStep.add(1, 'week')
  }

  return weekDayOccurrences
}

/**
 * Returns the date of the Nth occurrence of {@link weekday} in the month represented in {@link date}
 *
 * - **Example:** if {@link n} is `2` and {@link weekDay} is `0`, the returned value would be a date pointing at
 * the **second sunday** of the month
 * @example
 * ```
 * goToNthOccurrenceOfWeekDayInMonth(new Date() , 2 , 3)
 * // Returns the date of the Third Tuesday of the current month
 * ```
 */
export const goToNthOccurrenceOfWeekDayInMonth = (date: Date, weekDay: number, n: number) => {
  const dayjsDate = dayjs(date)
  const firstDayOfMonth = dayjsDate.date(1)
  let weekDayOccurrences = 0
  if (firstDayOfMonth.day() <= weekDay) weekDayOccurrences++

  let currentStep = firstDayOfMonth.add(1, 'week').day(weekDay)

  for (; weekDayOccurrences < n - 1; weekDayOccurrences++) {
    currentStep = currentStep.add(1, 'week')
  }

  return currentStep.toDate()
}

/**
 * Returns the date of the last occurrence of {@link weekDay} in the month represented in {@link date}
 *
 * @example
 * ```
 * goToLastOccurrenceOfWeekDayInMonth(new Date() , 0)
 * // Returns the date of the Last Sunday of the current month
 * ```
 */
export const goToLastOccurrenceOfWeekDayInMonth = (date: Date, weekDay: number) => {
  const dayjsDate = dayjs(date)
  const firstDayOfMonth = dayjsDate.date(1)
  let currentStep = firstDayOfMonth.add(1, 'week').day(weekDay)
  let last_occurrence = currentStep.toDate()

  while (currentStep.month() === dayjsDate.month()) {
    last_occurrence = currentStep.toDate()
    currentStep = currentStep.add(1, 'week')
  }

  return last_occurrence
}

/**
 * Checks if the day represented in {@link date} is the last WEEKDAY occurrence
 * in the month.
 *
 * *e.g* If the {@link date} points to the **last Tuesday of month**, the returned value will be `true`
 */
export const isLastOccurrenceOfWeekDay = (date: Date) => {
  const lastOccurrence = goToLastOccurrenceOfWeekDayInMonth(date, dayjs(date).day())
  return lastOccurrence.getTime() === date.getTime()
}

export const differenceInMilliseconds = (baseDate: Date | string, date: Date | string): number => {
  if (baseDate === 'string') baseDate = new Date(baseDate)
  if (typeof date === 'string') date = new Date(date)
  return +baseDate - +date
}

export const startOfMonth = (date: Date | string): Date => {
  if (typeof date === 'string') date = new Date(date)
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const getDay = (date: Date | string): number => {
  if (typeof date === 'string') date = new Date(date)
  return dayjs(date).day()
}

/**
 *
 * @param day dayjs instance
 * @param weekday number from 0 to 6
 * @returns
 */
export const nextWeekday = (day: Dayjs, weekday: number): string => {
  const current = day.day()
  const days = (7 + weekday - current) % 7
  return day.clone().add(days, 'd').format()
}
