export interface ICalendarsData {
  calendarName?: string | null
  description?: string | null
  calendarId: string
  role?: string | null // 'reader' | 'owner' | 'freeBusyReader' | 'writer';
  can_write: boolean
  timezone?: string | null
  primary: boolean
  is_connected: boolean
  check_for_conflicts?: boolean
  push_events?: boolean
  is_two_way?: boolean
}
