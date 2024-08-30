import { module_config, user_integrated_module, user_module_config } from '@prisma/client'
import * as msal from '@azure/msal-node'

export interface IGetOutlookAccessTokenConfig {
  msalClient: msal.ConfidentialClientApplication
  user_integrated_module: user_integrated_module & {
    user_module_config: (user_module_config & {
      module_config: module_config | null
    })[]
  }
}

export interface IGetTokenReq {
  code: string
  client_id: string
  redirect_uri: string
  client_secret: string
  grant_type: string
}

export interface IOutlookCalendarEvent {
  id: string
  showAs: 'busy' | 'free' | 'away' | 'tentative' | 'working elsewhere'
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  subject: string
  seriesMasterId?: string
  attendees?: {
    type: string
    status: { response: string; time: string }
    emailAddress: {
      name: string
      address: string
    }
  }[]
  organizer?: {
    emailAddress: {
      name: string
      address: string
    }
  }
  location?: {
    displayName: string
    locationUri?: string
    locationType?: string
    uniqueId?: string
    uniqueIdType?: string
    address?: {
      street?: string
      city?: string
      state?: string
      countryOrRegion?: string
      postalCode?: string
    }
    coordinates: { latitude: number; longitude: number }
  }
  onlineMeetingUrl?: string
  bodyPreview?: string
}
