import { IClioWebhookModel, IClioWebhookMatterEvent } from './IClioWebhook.js'

// ====================================================================================================================
// === COMMMON
// ====================================================================================================================

export interface IClioCredentials {
  access_token: string
  refresh_token: string
  user_integrated_module_id: number
}

interface Meta {
  paging: { previous: string; next: string }
  records: number
}

// ====================================================================================================================
// === USER
// ====================================================================================================================

export interface IClioGetMeRes {
  data: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  error?: string
  error_description?: string
}

export interface IClioGetAccessTokenReq {
  client_id: string
  client_secret: string
  code: string
  redirect_uri: string
  grant_type: 'authorization_code'
}
export interface IClioGetAccessTokenRes {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: 'bearer'
  error?: string
  error_description?: string
}

export interface IClioGetRefreshAccessReq {
  client_id: string
  client_secret: string
  refresh_token: string
  grant_type: 'refresh_token'
}
export interface IClioGetRefreshAccessRes {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: 'bearer'
  error?: string
  error_description?: string
}

// ====================================================================================================================
// === WEBHOOK
// ====================================================================================================================

export interface IClioCreateWebhookReq {
  data: {
    model: IClioWebhookModel
    url: string
    events?: IClioWebhookMatterEvent[]
    expires_at?: string
    fields: string
  }
}

export interface IClioCreateWebhookResData {
  id: number
  model: IClioWebhookModel
  url: string
  events: IClioWebhookMatterEvent[]
  expires_at: string
  created_at: string
  fields: string
  status: 'pending' | 'enabled' | 'suspended'
  shared_secret: string
}

export interface IClioCreateWebhookRes {
  data: IClioCreateWebhookResData
  meta: Meta
  error?: string
  error_description?: string
}

// ====================================================================================================================
// === CONTACT
// ====================================================================================================================

export interface IClioContactReqData {
  first_name: string
  last_name: string
  email_addresses?: { id?: number; address: string; default_email: boolean }[]
  type: 'Person'
}

interface IClioContactResData {
  id: number
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
  company?: { id: number }
  avatar?: { url: string }
  addresses?: { primary?: boolean; country: string }[]
  phone_numbers?: { primary: boolean; number: string }[]
}

export interface IClioGetContactsRes {
  data: IClioContactResData[]
  meta: Meta
  error?: string
  error_description?: string
}

export interface IClioGetContactRes {
  data: IClioContactResData
  meta: Meta
  error?: string
  error_description?: string
}

// ====================================================================================================================
// === MATTER
// ====================================================================================================================

export interface IClioMatterReqData {
  description?: string
  display_number?: string
  status?: 'Open' | 'Pending' | 'Closed'
  client?: {
    id: number
  }
  relationships?: {
    description?: string
    id?: number
    contact: {
      id: number
    }
  }[]
}

export interface IClioGetMatterResData {
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

export interface IClioGetMattersRes {
  data: IClioGetMatterResData[]
  meta: Meta
  error?: string
  error_description?: string
}

export interface IClioGetMatterRes {
  data: IClioGetMatterResData
  meta: Meta
  error?: string
  error_description?: string
}

// =======================================================================================================================
// === CALENDAR ENTRY
// =======================================================================================================================

export interface IClioCalEntryReqData {
  summary?: string
  description?: string | null
  start_at?: Date
  end_at?: Date
  recurrence_rule?: string | null
  start_at_time_zone?: string
  send_email_notification?: boolean
  calendar_owner?: {
    id: number
  }
  matter?: {
    id: number
  } | null
  attendees?: {
    id?: number
    type?: 'Contact' | 'Calendar'
  }[]
}

export interface IClioCalEntryResData {
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

export interface IClioCalEntriesRes {
  data: IClioCalEntryResData[]
  meta: Meta
  error?: string
  error_description?: string
}

export interface IClioCalEntryRes {
  data: IClioCalEntryResData
  meta: Meta
  error?: string
  error_description?: string
}
