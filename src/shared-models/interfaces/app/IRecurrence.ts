import { DATE_INTERVAL, RECURRENCE_RECUR_TYPE, MONTHLY_RECURRENCE_TYPE } from '../backend.js'
import { IDay } from './IDay.js'
export type CustomRecurrence = {
  /**
   * @example daily
   */
  type: RECURRENCE_RECUR_TYPE
  /**
   * @example 1
   */
  repeat_every: number
  /**
   * @example 10
   */
  repeat_interval?: number | null
  /**
   * @description Determines which terminator should be used to limit the number of events
   * @example end_date
   */
  terminator_type: 'end_date' | 'repeat_interval'
  /**
   * @example true
   */
  monthlyAtSameWeekAndDay?: boolean
  /**
   * @example [0, 2, 4]
   * @description Day indices starting from `sunday` as `0`
   */
  weekly_days?: IDay[]
  /**
   * @format date-time
   */
  end_date?: string | Date
}
export interface IRecurrence {
  /**
   * @example weekly
   */
  option: DATE_INTERVAL
  /**
   * @description Cases where this field can be defined and will be considered:
   *
   * 1) If the **option** is specified to `monthly`
   * 2) If the **option** is specified to `custom` and **custom.type** is `month`
   *
   * ### Values
   * #### NTH_WEEKDAY
   * Creates the event on the nth occurrence of a weekday in the month.
   * For example: **Second Sunday**, **First Monday**, **Fourth Friday**, ...
   *
   * - Notice that a case like **Fifth Friday** might happen in a month but it won't
   * be accepted here since it's not possible to implement it in each month as not
   * every month will have a fifth Friday
   *
   * #### LAST_WEEKDAY
   * Creates the event on the last occurrence of a weekday in the month.
   * For Example: **Last Monday**, **Last Sunday**, ...
   *
   * - It can be useful if we want to have an event for example on the last Friday of each month,
   * But the last Friday could be either the fourth or fifth friday respective to its month.
   *
   * #### *Undefined*
   * Simply ignores weekdays and just considers the date in the month.
   * For example: **7th day of the month**. Notice that if the date is special like **31st** which does not exist
   * in some months, the event **will not** be created in the months which do not have 31 days
   * @example NTH_WEEKDAY
   */
  monthly_type?: MONTHLY_RECURRENCE_TYPE
  /**
   * Will be ignored if `option` is not set to `custom`
   */
  custom?: Partial<CustomRecurrence>
}
// Note: the Partial<CustomRecurrence> type which is
// considered in custom object is related to an issue
// in frontend where they might send wrong custom
// type when `option` field is not set to `custom`.
// the problem was never solved so we have to manually
// validate the custom object. Meaning if the `option`
// is `custom`, we check the required types and if not,
// we ignore it. (This must be resolved in frontend later
// since we might have other applications using our api
// and updating fields won't be as cheap as it is right
// now)
