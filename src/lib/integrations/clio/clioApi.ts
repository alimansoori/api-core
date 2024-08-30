import { singleton } from 'tsyringe'
import { fetchRequestClio } from './clioFetch.js'
import {
  IClioCalEntriesRes,
  IClioCalEntryReqData,
  IClioCalEntryRes,
  IClioContactReqData,
  IClioCreateWebhookReq,
  IClioCreateWebhookRes,
  IClioCredentials,
  IClioGetAccessTokenReq,
  IClioGetAccessTokenRes,
  IClioGetContactRes,
  IClioGetContactsRes,
  IClioGetMatterRes,
  IClioGetMattersRes,
  IClioGetMeRes,
  IClioGetRefreshAccessReq,
  IClioGetRefreshAccessRes,
  IClioMatterReqData,
} from './interfaces/IClioApi.js'
import queryString from 'query-string'

@singleton()
export default class ClioApi {
  // ====================================================================================================================
  // === USER
  // ====================================================================================================================

  public getAccessToken = async (data: IClioGetAccessTokenReq) => {
    const { redirect_uri, grant_type, code, client_secret, client_id } = data
    const query = queryString.stringify({
      client_id,
      client_secret,
      grant_type,
      redirect_uri,
      code,
    })
    const url = `oauth/token?${query}`
    const res = await fetchRequestClio<IClioGetAccessTokenReq, IClioGetAccessTokenRes>('POST', url, null, data)
    return res
  }

  public getRefreshAccess = async (data: IClioGetRefreshAccessReq) => {
    const { grant_type, client_secret, client_id } = data
    const query = queryString.stringify({
      client_id,
      client_secret,
      grant_type,
    })
    const url = `oauth/token?${query}`
    const res = await fetchRequestClio<IClioGetRefreshAccessReq, IClioGetRefreshAccessRes>('POST', url, null, data)
    return res
  }

  public getMe = async (credential: IClioCredentials) => {
    const url = '/api/v4/users/who_am_i?fields=first_name,last_name,email,id'
    const res = await fetchRequestClio<any, IClioGetMeRes>('GET', url, credential, null)
    return res
  }

  // ====================================================================================================================
  // === WEBHOOK
  // ====================================================================================================================

  public createWebhook = async (
    credential: IClioCredentials,
    type: 'contact' | 'matter' | 'calendar_entry',
    base_url: string,
    user_integrated_module_id: number,
  ) => {
    const url = '/api/v4/webhooks?fields=id,etag,shared_secret,events,expires_at,url,status,fields'
    const data: IClioCreateWebhookReq['data'] | undefined =
      type === 'contact'
        ? {
            events: ['created', 'updated', 'deleted'],
            model: 'contact',
            fields:
              'id,etag,first_name,last_name,email_addresses{primary,address},type,title,company,avatar{url},addresses{primary,country,street,city,province,postal_code}',
            url: `${base_url}/api/webhook/clio/${user_integrated_module_id}/contact`,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days
          }
        : type === 'matter'
          ? {
              events: ['created', 'updated', 'deleted', 'matter_opened', 'matter_pended', 'matter_closed'],
              model: 'matter',
              fields: 'user,id,etag,display_number,description,status,created_at,client,relationships',
              url: `${base_url}/api/webhook/clio/${user_integrated_module_id}/matter`,
              expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days
            }
          : type === 'calendar_entry'
            ? {
                events: ['created', 'updated', 'deleted'],
                model: 'calendar_entry',
                fields:
                  'id,etag,summary,description,start_at,end_at,recurrence_rule,created_at,start_at_time_zone,matter,attendees,parent_calendar_entry_id',
                url: `${base_url}/api/webhook/clio/${user_integrated_module_id}/calendar_entry`,
                expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days
              }
            : undefined
    const res = await fetchRequestClio<IClioCreateWebhookReq, IClioCreateWebhookRes>(
      'POST',
      url,
      credential,
      data ? { data } : null,
    )
    return res
  }

  public removeWebhook = async (credential: IClioCredentials, id: number) => {
    const url = `/api/v4/webhooks/${id}`
    const res = await fetchRequestClio<any, any>('DELETE', url, credential)
    return res
  }

  // ====================================================================================================================
  // === CONTACT
  // ====================================================================================================================

  public getContacts = async (credential: IClioCredentials, page_token?: string) => {
    let url = `/api/v4/contacts?fields=id,first_name,last_name,email_addresses{id,primary,address,name},
		type,title,company,avatar{url},addresses{primary,country,street,city,province,postal_code}
		,phone_numbers{primary,number}`
    if (page_token) url += `&page_token=${page_token}`
    const res = await fetchRequestClio<any, IClioGetContactsRes>('GET', url, credential, null)
    return res
  }

  public createContact = async (credential: IClioCredentials, data: IClioContactReqData) => {
    const url = '/api/v4/contacts?fields=id,first_name,last_name,email_addresses{id,primary,address,name}'
    const res = await fetchRequestClio<any, IClioGetContactRes>('POST', url, credential, { data })
    return res
  }

  public createBulkContacts = async (credential: IClioCredentials, data: IClioContactReqData[]) => {
    const url = '/api/v4/contacts'
    const res = await fetchRequestClio<any, any>(
      'POST',
      url,
      credential,
      { data },
      {
        'X-BULK': true,
      },
    )
    return res
  }

  public editContact = async (credential: IClioCredentials, id: number, data: IClioContactReqData) => {
    const url = `/api/v4/contacts/${id}?fields=id,first_name,last_name,email_addresses{id,primary,address,name}`
    const res = await fetchRequestClio<any, IClioGetContactRes>('PATCH', url, credential, { data })
    return res
  }

  public removeContact = async (credential: IClioCredentials, id: number) => {
    const url = `/api/v4/contacts/${id}`
    const res = await fetchRequestClio<any, any>('DELETE', url, credential, null)
    return res
  }

  // ====================================================================================================================
  // === MATTER
  // ====================================================================================================================

  public getMatters = async (credential: IClioCredentials, page_token?: string) => {
    let url = '/api/v4/matters?fields=user,id,etag,display_number,description,status,created_at,client,relationships'
    if (page_token) url += `&page_token=${page_token}`
    const res = await fetchRequestClio<any, IClioGetMattersRes>('GET', url, null, credential)
    return res
  }

  public createMatter = async (credential: IClioCredentials, data: IClioMatterReqData) => {
    const url = '/api/v4/matters'
    const res = await fetchRequestClio<any, IClioGetMatterRes>('POST', url, credential, { data })
    return res
  }

  public editMatter = async (credential: IClioCredentials, id: number, data: IClioMatterReqData) => {
    const url = `/api/v4/matters/${id}`
    const res = await fetchRequestClio<any, any>('PATCH', url, credential, { data })
    return res
  }

  public removeMatter = async (credential: IClioCredentials, id: number) => {
    const url = `/api/v4/matters/${id}`
    const res = await fetchRequestClio<any, any>('DELETE', url, credential, null)
    return res
  }

  // =======================================================================================================================
  // === CALENDAR ENTRY
  // =======================================================================================================================

  public getCalEntries = async (credential: IClioCredentials, id?: number | null, date?: string, page_token?: string) => {
    let url =
      id && date
        ? `/api/v4/calendar_entries?ids[]=${id}&expanded=true&from=${date}&fields=id,etag,summary,
			description,start_at,end_at,recurrence_rule,created_at,start_at_time_zone,matter,attendees`
        : `/api/v4/calendar_entries?fields=id,etag,summary,description,start_at,end_at,
			recurrence_rule,created_at,start_at_time_zone,matter,attendees`
    if (page_token) url += `&page_token=${page_token}`
    const res = await fetchRequestClio<any, IClioCalEntriesRes>('GET', url, credential, null)
    return res
  }

  public createCalEntry = async (credential: IClioCredentials, data: IClioCalEntryReqData) => {
    const url = '/api/v4/calendar_entries'
    const res = await fetchRequestClio<any, IClioCalEntryRes>('POST', url, credential, { data })
    return res
  }

  public editCalEntry = async (credential: IClioCredentials, id: number, data: IClioCalEntryReqData) => {
    const url = `/api/v4/calendar_entries/${id}`
    const res = await fetchRequestClio<any, IClioCalEntryRes>('PATCH', url, credential, { data })
    return res
  }

  public removeCalEntry = async (credential: IClioCredentials, id: number) => {
    const url = `/api/v4/calendar_entries/${id}`
    const res = await fetchRequestClio<any, any>('DELETE', url, credential, null)
    return res
  }

  // =======================================================================================================================
  // === CALENDAR
  // =======================================================================================================================

  public getCalendars = async (credential: IClioCredentials) => {
    const url = '/api/v4/calendars?owner=true&type=UserCalendar'
    const res = await fetchRequestClio<any, { data: { id: number }[] }>('GET', url, credential, null)
    return res
  }
}
