import { getUniclientGoogleOAuth } from '../../oauth/google.js'
import { google } from 'googleapis'
import { inject, injectable } from 'tsyringe'
import { logger } from '@app/lib/logger.js'
import { nanoid } from 'nanoid'
import { getServerAddress } from '@app/utility/helpers/index.js'
import { getConfigs } from '@app/lib/config.validator.js'
import JobQueue from '@app/lib/jobQueue/jobQueue.js'
import dayjs from 'dayjs'
import { CalendarLogDumper } from '@app/lib/logDumper/LogCalendar/index.js'
const jobQueue = new JobQueue(500)

@injectable()
export default class GoogleCalendarApi {
  private oauth: ReturnType<typeof getUniclientGoogleOAuth>
  constructor(@inject(CalendarLogDumper) private calendarLogDumper: CalendarLogDumper) {
    this.oauth = getUniclientGoogleOAuth()
  }

  public getEvents = async (refresh_token: string, timeMin: string, timeMax: string) => {
    this.oauth.setCredentials({ refresh_token })
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })

    // const primaryCalendar = await calendar.calendars.get({ calendarId: 'primary', auth: this.oauth });

    // const timeZone = primaryCalendar.data.timeZone;
    return calendar.events.list({ auth: this.oauth, calendarId: 'primary', timeMin, timeMax }).catch((err) => {
      this.calendarLogDumper.log({ err }, 'GOOGLE CALENDAR CALENDAR GET EVENTS')
      return false
    })
  }

  getUserProfile = async (refresh_token: string) => {
    this.oauth.setCredentials({ refresh_token })
    return google.calendar('v3').calendars.get({ auth: this.oauth, calendarId: 'primary' })
  }

  getCalendarList = async (refresh_token: string, syncToken?: string) => {
    this.oauth.setCredentials({ refresh_token })
    return google
      .calendar('v3')
      .calendarList.list({
        syncToken,
        auth: this.oauth,
        maxResults: 250,
      })
      .catch((err) => {
        this.calendarLogDumper.log({ err }, 'GOOGLE CALENDAR CALENDAR LIST')
        return false
      })
  }

  getEventById = async (refresh_token: string, eventId: string, calendarId: string) => {
    this.oauth.setCredentials({ refresh_token })
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })
    return calendar.events.get({ auth: this.oauth, calendarId, eventId })
  }

  addEventToCalendar = async (
    refresh_token: string,
    data: {
      summary: string
      description?: string
      start: string
      end: string
      transparency: 'opaque' | 'transparent'
      locked: boolean
      id: string
      extendedProperties: any
      attendees: { email: string; organizer?: boolean; responseStatus?: 'accepted' | 'needsAction' }[]
      location: string
      organizer?: {
        email: string
      }
    },
    calendarId: string,
  ) => {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })

    this.oauth.setCredentials({ refresh_token })

    const { start, end, ...rest } = data
    const event = {
      ...rest,
      start: {
        dateTime: start,
      },
      end: {
        dateTime: end,
      },
    }

    return calendar.events
      .insert({
        auth: this.oauth,
        calendarId,
        requestBody: event,
      })
      .catch((err) => {
        if (err.code !== 409) logger.error(err)
      })
  }

  deleteEvent = async (refresh_token: string, eventId: string, calendarId: string) => {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })

    this.oauth.setCredentials({ refresh_token })

    return calendar.events.delete({
      auth: this.oauth,
      calendarId,
      eventId,
    })
  }

  enableWatchCalendar = (refresh_token: string, calendarId: string) => {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })
    const { GOOGLE_CALENDAR_NOTIFICATION_ADDRESS } = getConfigs()

    this.oauth.setCredentials({ refresh_token })

    const serverAddress = getServerAddress()

    const body = {
      id: nanoid(30),
      type: 'web_hook',
      address: `${serverAddress}${GOOGLE_CALENDAR_NOTIFICATION_ADDRESS}`, // Your receiving URL.

      // token: "target=myApp-myCalendarChannelDest", // (Optional) Your channel token.
      // expiration": 1426325213000 // (Optional) Your requested channel expiration time.
    }

    return jobQueue
      .execute(() =>
        calendar.events.watch({
          calendarId,
          requestBody: body,
          auth: this.oauth,
        }),
      )
      .catch((err) => {
        this.calendarLogDumper.log({ err }, 'GOOGLE CALENDAR CALENDAR WATCH')
        return false
      })
  }

  enableWatchCalendarList = (refresh_token: string) => {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })
    const { GOOGLE_CALENDAR_list_NOTIFICATION_ADDRESS } = getConfigs()

    this.oauth.setCredentials({ refresh_token })

    const serverAddress = getServerAddress()

    const body = {
      id: nanoid(30),
      type: 'web_hook',
      address: `${serverAddress}${GOOGLE_CALENDAR_list_NOTIFICATION_ADDRESS}`, // Your receiving URL.

      // token: "target=myApp-myCalendarChannelDest", // (Optional) Your channel token.
      // expiration": 1426325213000 // (Optional) Your requested channel expiration time.
    }

    return jobQueue
      .execute(() =>
        calendar.calendarList.watch({
          requestBody: body,
          auth: this.oauth,
        }),
      )
      .catch((err) => {
        this.calendarLogDumper.log({ err }, 'GOOGLE CALENDAR CALENDAR WATCH CALENDAR LIST')
        return false
      })
  }

  disableWatchCalendar = (refresh_token: string, id: string, resourceId: string) => {
    this.oauth.setCredentials({ refresh_token })

    const calendar = google.calendar({ version: 'v3', auth: this.oauth })

    return jobQueue
      .execute(() =>
        calendar.channels.stop({
          auth: this.oauth,
          requestBody: {
            id,
            resourceId,
          },
        }),
      )
      .catch((err) => {
        if (err.code !== 404) {
          throw err
        }
      })
  }

  disableWatchCalendarList = (refresh_token: string, id: string, resourceId: string) => {
    this.oauth.setCredentials({ refresh_token })

    const calendar = google.calendar({ version: 'v3', auth: this.oauth })

    return jobQueue
      .execute(() =>
        calendar.channels.stop({
          auth: this.oauth,
          requestBody: {
            id,
            resourceId,
          },
        }),
      )
      .catch((err) => {
        if (err.code !== 404) {
          throw err
        }
      })
  }
  sync = (refresh_token: string, calendarId: string, syncToken?: string, pageToken?: string, maxResults?: number) => {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })

    this.oauth.setCredentials({ refresh_token })

    if (pageToken) {
      return jobQueue
        .execute(() =>
          calendar.events.list({
            calendarId,
            auth: this.oauth,
            timeMin: !syncToken ? dayjs.utc().subtract(1, 'month').format() : undefined,
            pageToken,
            maxResults,
          }),
        )
        .catch((err) => {
          this.calendarLogDumper.log({ err }, 'GOOGLE CALENDAR CALENDAR SYNC')
        })
    } else {
      return jobQueue
        .execute(() =>
          calendar.events.list({
            calendarId,
            auth: this.oauth,
            timeMin: !syncToken ? dayjs.utc().subtract(1, 'month').format() : undefined,
            syncToken: !syncToken ? undefined : syncToken,
            maxResults,
          }),
        )
        .catch((err) => {
          this.calendarLogDumper.log({ err }, 'GOOGLE CALENDAR CALENDAR SYNC')
        })
    }
  }

  getInstances = (refresh_token: string, eventId: string, calendarId: string, maxResults?: number) => {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })

    this.oauth.setCredentials({ refresh_token })

    return jobQueue
      .execute(() =>
        calendar.events.instances({
          auth: this.oauth,
          calendarId,
          eventId,
          maxResults: maxResults ?? 250,
        }),
      )
      .catch((err) => {
        this.calendarLogDumper.log({ err }, 'GOOGLE CALENDAR CALENDAR INSTANCES')
      })
  }

  updateEvent = (
    refresh_token: string,
    eventId: string,
    data: {
      summary: string
      description?: string
      start: string
      end: string
      transparency?: 'opaque' | 'transparent'
      extendedProperties?: any
      attendees?: { email: string }[]
      sendNotifications?: boolean
    },
    calendarId: string,
  ) => {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth })

    this.oauth.setCredentials({ refresh_token })

    const { start, end, ...rest } = data

    const event = {
      ...rest,
      reminders: {
        useDefault: !!rest.sendNotifications,
      },
      start: {
        dateTime: start,
      },
      end: {
        dateTime: end,
      },
    }

    return calendar.events
      .update({
        calendarId,
        auth: this.oauth,
        eventId,
        requestBody: event,
      })
      .catch((err) => [this.calendarLogDumper.log({ err }, 'GOOGLE CALENDAR CALENDAR UPDATE EVENT')])
  }
}
