export type IClioWebhookModel = 'activity' | 'bill' | 'calendar_entry' | 'communication' | 'contact' | 'matter' | 'task'
export type IClioWebhookEvent = 'created' | 'updated' | 'deleted'
export type IClioWebhookMatterEvent = IClioWebhookEvent | 'matter_opened' | 'matter_pended' | 'matter_closed'

// ====================================================================================================================
// === CONTACT
// ====================================================================================================================

export interface IContactWebhookBody {
  data: {
    id: number
    etag: string
    first_name: string
    last_name: string
    email_addresses?: {
      id: number
      primary: boolean
      address: string
      name: 'Work' | 'Home' | 'Other'
    }[]
    type: 'Person' | 'Company'
    title?: string
    company?: {
      id: number
    }
    avatar?: {
      url: string
    }
    addresses?: {
      primary?: boolean
      country: string
    }[]
  }
  meta: {
    event: IClioWebhookEvent
  }
}

// ====================================================================================================================
// === MATTER
// ====================================================================================================================

export interface IMatterWebhookBody {
  data: {
    id: number
    user: {
      id: number
      etag: string
      name: string
    }
    etag: string
    display_number: string
    description: string
    status: 'Open' | 'Pending' | 'Closed'
    created_at: Date
    relationships: {
      id: number
      etag: string
      contact: {
        id: number
        name: string
        initials: string
        type: 'Person' | 'Company'
        etag: string
      }
    }[]
  }
  meta: {
    event: IClioWebhookMatterEvent
  }
}

// ====================================================================================================================
// === CALENDAR ENTRY
// ====================================================================================================================

export interface ICalEntryWebhookBody {
  data: {
    id: string
    etag: string
    summary: string
    description: string
    start_at: Date
    end_at: Date
    recurrence_rule: string
    start_at_time_zone: string
    created_at: Date
    matter: {
      id: number
      etag: string
      display_number: string
    } | null
    attendees: {
      id: number
      etag: string
      type: 'Contact' | 'Calendar'
    }[]
  }
  meta: {
    event: IClioWebhookEvent
  }
}
