import { fetchRequest } from '@app/lib/fetch.js'

import graph from '@microsoft/microsoft-graph-client'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { logger } from '@app/lib/logger.js'
import { getServerAddress } from '@app/utility/helpers/index.js'
import { getConfigs } from '@app/lib/config.validator.js'
import JobQueue from '@app/lib/jobQueue/jobQueue.js'
import { inject, singleton } from 'tsyringe'
import { IGetOutlookAccessTokenConfig, IGetTokenReq, IOutlookCalendarEvent } from './interfaces/index.js'
import { MODULE_CONFIG_KEY } from '@app/shared-models/index.js'
import IntegrationRepository from '@app/database/entities/integration/integration.repo.js'
import { generateError } from '@app/core/error/errorGenerator.js'
import { CalendarLogDumper } from '@app/lib/logDumper/LogCalendar/index.js'
const jobQueue = new JobQueue(500)

@singleton()
export default class GraphApi {
  constructor(
    @inject(IntegrationRepository) private integrationRepository: IntegrationRepository,
    @inject(CalendarLogDumper) private calendarLogDumper: CalendarLogDumper,
  ) {}

  getUserDetails = (accessToken: string | IGetOutlookAccessTokenConfig) => {
    return jobQueue.execute(async () => {
      const client = await this.getClient(accessToken)
      return client.api('/me').get()
    })
  }

  getCalendarView = (
    accessToken: string | IGetOutlookAccessTokenConfig,
    start: string,
    end: string,
    calendarId: string,
  ) => {
    return jobQueue.execute(async () => {
      const client = await this.getClient(accessToken)
      return (
        client
          .api(`/me/calendars/${calendarId}/events`)
          // Add Prefer header to get back times in user's timezone
          .query({ startDateTime: start, endDateTime: end })
          // Get just the properties used by the app
          .select('')
          // Order by start time
          .orderby('start/dateTime')
          // Get at most 50 results
          .top(50)
          .get()
      )
    })
  }

  addEventToCalendar = async (
    accessToken: string | IGetOutlookAccessTokenConfig,
    calendarId: string,
    data: {
      subject: string
      start: string
      end: string
      // id: string;
      transactionId: string
      organizer: {
        emailAddress: {
          address: string
        }
      }
      showAs?: 'free' | 'busy'
      description?: string
      attendees: {
        emailAddress: {
          address: string
          name: string
        }
        type: 'required' | 'optional'
      }[]
      onlineMeeting: {
        conferenceId: string
        joinUrl: string
      }
    },
  ) => {
    const { start, end, description, ...rest } = data
    const event = {
      ...rest,
      start: {
        dateTime: start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: end,
        timeZone: 'UTC',
      },
      body: {
        contentType: 'text',
        content: description,
      },
      bodyPreview: description,
      isOnlineMeeting: true,
    }

    const client = await this.getClient(accessToken)
    return client.api(`/me/calendars/${calendarId}/events`).post(event)
  }

  getCalendar = (accessToken: string) => {
    return jobQueue.execute(async () => {
      const client = await this.getClient(accessToken)
      return client.api('/me/calendar').get()
    })
  }

  updateEvent = async (
    accessToken: string | IGetOutlookAccessTokenConfig,
    id: string,
    data: {
      subject?: string
      start?: string
      end?: string
      showAs?: 'free' | 'busy'
      description?: string
      attendees?: {
        emailAddress: {
          address: string
          name: string
        }
        type: 'required' | 'optional'
      }[]
    },
    calendarId: string,
  ) => {
    const { start, end, description, ...rest } = data

    const event = {
      ...rest,
      start: {
        dateTime: start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: end,
        timeZone: 'UTC',
      },
      body: {
        contentType: 'text',
        content: description,
      },
      bodyPreview: description,
    }

    const client = await this.getClient(accessToken)
    return client.api(`/me/calendars/${calendarId}/events/${id}`).patch(event)
  }

  deleteEvent = async (accessToken: string | IGetOutlookAccessTokenConfig, id: string, calendarId: string) => {
    const client = await this.getClient(accessToken)
    return client.api(`/me/calendars/${calendarId}/events/${id}`).delete()
  }

  getEventById = async (
    accessToken: string | IGetOutlookAccessTokenConfig,
    id: string,
  ): Promise<IOutlookCalendarEvent> => {
    try {
      const client = await this.getClient(accessToken)
      return client.api(`/me/events/${id}`).get()
    } catch (error) {
      throw generateError([{ message: 'Cannot connect to Outlook' }], 'INTERNAL_SERVER_ERROR')
    }
  }
  watch = (accessToken: string | IGetOutlookAccessTokenConfig, user_id: number, calendarId: string) => {
    const { OUTLOOK_CALENDAR_NOTIFICATION_ADDRESS } = getConfigs()
    const today = dayjs()
    const twoDaysLater = today.add(2, 'day')
    const serverAddress = getServerAddress()

    return jobQueue
      .execute(async () => {
        const client = await this.getClient(accessToken)
        return client.api('/subscriptions').post({
          changeType: 'created,updated,deleted',
          clientState: nanoid(30),
          notificationUrl: `${serverAddress}${OUTLOOK_CALENDAR_NOTIFICATION_ADDRESS}${user_id}`,
          resource: `/me/calendars/${calendarId}/events`,
          expirationDateTime: twoDaysLater,
        })
      })
      .catch((err) => {
        this.calendarLogDumper.log({ err }, 'OUTLOOK CALENDAR CALENDAR WATCH')
      })
  }

  renewWatch = (accessToken: string | IGetOutlookAccessTokenConfig, watch_id: string) => {
    const today = dayjs()
    const twoDaysLater = today.add(2, 'day')
    return jobQueue.execute(async () => {
      const client = await this.getClient(accessToken)
      return client.api(`/subscriptions/${watch_id}`).patch({
        expirationDateTime: twoDaysLater,
      })
    })
  }

  sync = (
    accessToken: string | IGetOutlookAccessTokenConfig,
    nextLink?: string,
    sync_token?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    const today = dayjs()
    const fifteenDaysAgo = today.subtract(15, 'day').toISOString()
    const fifteenDaysLater = today.add(15, 'day').toISOString()

    if (nextLink) {
      return jobQueue
        .execute(async () => {
          const client = await this.getClient(accessToken)
          return client.api(nextLink).get()
        })
        .catch((err) => {
          logger.error(err)
        })
    } else if (sync_token) {
      return jobQueue
        .execute(async () => {
          const client = await this.getClient(accessToken)
          return client.api(sync_token).get()
        })
        .catch((err) => {
          logger.error(err)
        })
    }

    return jobQueue
      .execute(async () => {
        const client = await this.getClient(accessToken)
        return client
          .api('/me/calendarView/delta')
          .query({ startDateTime: startDate ?? fifteenDaysAgo, endDateTime: endDate ?? fifteenDaysLater })
          .get()
      })
      .catch((err) => {
        this.calendarLogDumper.log({ err }, 'OUTLOOK CALENDAR CALENDAR SYNC')
      })
  }

  getClient = async (token: string | IGetOutlookAccessTokenConfig) => {
    const accessToken = await this.getStringAccessToken(token)
    return getAuthenticatedClient(accessToken)
  }

  getStringAccessToken = async (token: string | IGetOutlookAccessTokenConfig) => {
    const accessToken: string | undefined = typeof token === 'string' ? token : await this.getAccessTokenViaMsal(token)
    if (!accessToken) throw new Error('Outlook access token not found')
    return accessToken
  }

  getAccessTokenViaMsal = async (config: IGetOutlookAccessTokenConfig) => {
    const { user_integrated_module, msalClient } = config
    const refresh_token = user_integrated_module.user_module_config.find((config) => {
      if (config.module_config) {
        return config.module_config.name === MODULE_CONFIG_KEY.outlook_calendar.refresh_token
      }
    })

    const { OUTLOOK_CALENDAR_SCOPES } = getConfigs()

    if (refresh_token) {
      const response = await msalClient
        .acquireTokenByRefreshToken({
          refreshToken: refresh_token.value as string,
          scopes: OUTLOOK_CALENDAR_SCOPES.split(','),
        })
        .catch((err: any) => {
          logger.log(err)

          if (err?.errorCode === 'invalid_grant') {
            this.integrationRepository.deleteUserIntegrationById(user_integrated_module.user_integrated_module_id)
          }
        })

      if (response) {
        return response.accessToken
      }
    }
  }

  getAuthTokens = (code: string, client_id: string, redirect_uri: string, client_secret: string) => {
    return fetchRequest<IGetTokenReq, { access_token: string; refresh_token: string }>(
      'POST',
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      {
        code,
        client_id,
        redirect_uri,
        client_secret,
        grant_type: 'authorization_code',
      },
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        Connection: 'keep-alive',
      },
    )
  }

  getSchedule = (
    startTime: {
      dateTime: string
      timeZone: string
    },
    endTime: {
      dateTime: string
      timeZone: string
    },
    SMTP: string,
    accessToken: string | IGetOutlookAccessTokenConfig,
  ) => {
    return jobQueue.execute(async () => {
      const client = await this.getClient(accessToken)
      return client.api('/me/calendar/getschedule').post({
        startTime,
        endTime,
        schedules: [SMTP],
      })
    })
  }

  disableWatchCalendar = (accessToken: string | IGetOutlookAccessTokenConfig, watch_id: string) => {
    return jobQueue.execute(async () => {
      const client = await this.getClient(accessToken)
      return client.api(`/subscriptions/${watch_id}`).delete()
    })
  }

  getRecurrenceData = (
    accessToken: string | IGetOutlookAccessTokenConfig,
    event_id: string,
    start: string,
    end: string,
  ): Promise<{ value: IOutlookCalendarEvent[] }> => {
    const startDateTime = dayjs.utc(start).format()
    let endDateTime = dayjs.utc(end).add(1, 'days').format()

    if (startDateTime > endDateTime) {
      endDateTime = dayjs.utc(startDateTime).add(1, 'days').format()
    }

    return jobQueue
      .execute(async () => {
        const client = await this.getClient(accessToken)
        return client.api(`/me/events/${event_id}/instances`).query({ startDateTime, endDateTime }).get()
      })
      .catch((err) => {
        logger.error(err)
      })
  }

  getCalendarList = (
    accessToken: string | IGetOutlookAccessTokenConfig,
  ): Promise<{
    value?: {
      id: string
      name: string
      canEdit: boolean
      isDefaultCalendar: boolean
      owner?: {
        name: string
      }
    }[]
  }> => {
    return jobQueue
      .execute(async () => {
        const client = await this.getClient(accessToken)
        return client
          .api('/me/calendars')
          .query({
            $top: 250,
          })
          .get()
      })
      .catch((err) => {
        this.calendarLogDumper.log({ err }, 'OUTLOOK CALENDAR CALENDAR LIST')
      })
  }
}

function getAuthenticatedClient(accessToken: string) {
  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken)
    },
  })

  return client
}
