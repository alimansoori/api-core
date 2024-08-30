import dayjs, { Dayjs } from 'dayjs'
export const week_days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
} as const
export const week_days_indices = [0, 1, 2, 3, 4, 5, 6] as const

/**
 * Used to handle week traversal while creating recurring meetings
 * with a custom first week day
 */
export class WeekHelper {
  private main_date: Dayjs
  private start_date: Dayjs | undefined
  private weekday_index_to_date: Date[] = []
  constructor(
    date: Date | string,
    public readonly first_week_day: (typeof week_days_indices)[number],
  ) {
    this.main_date = dayjs(date)
  }

  /**
   * Used to get the date of the {@link week_day_index} from the week
   *
   * **Bear in mind that  {@link week_day_index} is following the
   * same indices of dayjs weekdays. Meaning the weekday indices are as follows:**
   * - `0` : sunday
   * - `1` : monday
   * - `2` : tuesday
   * - `3` : wednesday
   * - `4` : thursday
   * - `5` : friday
   * - `6` : saturday
   *
   * So if the instance is representing a week which starts with **monday** and ends with **sunday**,
   * `getWeekDayDate(0)` would return the date of last day of the week.
   *
   * @example
   * ```ts
   * const date = new WeekHelper("2023-03-13T12:00:00" , 4);
   * date.getWeekDayDate(3); // 2023-03-15T08:30:00.000Z
   * ```
   */
  public getWeekDayDate(week_day_index: (typeof week_days_indices)[number]) {
    this.setDateForWeekdayIndices()
    return this.weekday_index_to_date[week_day_index]
  }

  /**
   * Used to get the date of first day of the next week respective to {@link first_week_day}
   */
  public getNextWeekDate(steps = 1) {
    return new Date(
      this.getStartDate()
        .add(steps * 7, 'day')
        .format(),
    )
  }

  public sortWeekDays(indices: Array<(typeof week_days_indices)[number]>) {
    this.setDateForWeekdayIndices()
    indices.sort((a, b) => this.weekday_index_to_date[a].getTime() - this.weekday_index_to_date[b].getTime())
  }

  private setDateForWeekdayIndices() {
    const start_date = this.getStartDate()
    if (this.weekday_index_to_date.length > 0) return

    for (let i = 0; i < 7; i++) {
      const new_date = start_date.add(i, 'day')
      this.weekday_index_to_date[new_date.day()] = new Date(new_date.format())
    }
  }

  private getStartDate() {
    if (this.start_date) return this.start_date
    let date = this.main_date

    while (date.day() !== this.first_week_day) {
      date = date.subtract(1, 'day')
    }

    this.start_date = date
    return date
  }
}
