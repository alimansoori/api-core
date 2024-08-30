import { IGetMeetingDetailForNotifyQueryResult } from './index.js'

export type IGetBookingAndMeetingByIdQueryResult = {
  service_id: number
  meeting: IGetMeetingDetailForNotifyQueryResult
}
