import { getUniclientGoogleOAuth } from '../../oauth/google.js'
import { people_v1, google } from 'googleapis'
import { injectable } from 'tsyringe'
import { logger } from '@app/lib/logger.js'

@injectable()
export default class GoogleContactsApi {
  private oauth: ReturnType<typeof getUniclientGoogleOAuth>
  constructor() {
    this.oauth = getUniclientGoogleOAuth()
  }

  public getContacts = async (refresh_token: string, personFields: string, pageSize: number) => {
    this.oauth.setCredentials({ refresh_token })
    const peopleApi = google.people({ version: 'v1', auth: this.oauth })

    const contacts: Partial<people_v1.Schema$Person[]> = []
    let contactsResp = await peopleApi.people.connections
      .list({ auth: this.oauth, resourceName: 'people/me', personFields, pageSize })
      .catch((err) => {
        logger.error(err)
        throw err
      })
    contactsResp?.data?.connections?.forEach((connection) => {
      contacts.push(connection)
    })
    let nextPageToken = contactsResp.data.nextPageToken

    while (nextPageToken) {
      contactsResp = await peopleApi.people.connections
        .list({
          auth: this.oauth,
          resourceName: 'people/me',
          personFields,
          pageSize,
          pageToken: nextPageToken,
        })
        .catch((err) => {
          logger.error(err)
          throw err
        })
      contactsResp?.data?.connections?.forEach((connection) => {
        contacts.push(connection)
      })
      nextPageToken = contactsResp.data.nextPageToken
    }

    return contacts
  }

  public getOneContact = async (refresh_token: string, resourceName: string, personFields: string) => {
    this.oauth.setCredentials({ refresh_token })
    const peopleApi = google.people({ version: 'v1', auth: this.oauth })

    const contactsResp = await peopleApi.people.get({ auth: this.oauth, resourceName, personFields }).catch((err) => {
      logger.error(err)
      throw err
    })

    return contactsResp
  }

  public editContact = (
    refresh_token: string,
    resourceName: string,
    updatePersonFields: string,
    requestBody: people_v1.Schema$Person,
  ) => {
    this.oauth.setCredentials({ refresh_token })
    const peopleApi = google.people({ version: 'v1', auth: this.oauth })

    // let contactsResp = await peopleApi.people.connections.list({ auth: this.oauth, resourceName: 'people/me', personFields, pageSize }).catch((err) => {
    //   logger.error(err);
    //   throw err;
    // });

    return peopleApi.people
      .updateContact({ auth: this.oauth, resourceName, updatePersonFields, requestBody })
      .catch((err) => {
        logger.error(err)
        throw err
      })
  }

  public deleteContact = (refresh_token: string, resourceName: string) => {
    this.oauth.setCredentials({ refresh_token })
    const peopleApi = google.people({ version: 'v1', auth: this.oauth })

    return peopleApi.people.deleteContact({ auth: this.oauth, resourceName }).catch((err) => {
      logger.error(err)
      throw err
    })
  }

  // public syncContacts = async (refresh_token: string, personFields: string, pageSize: number) => {
  //   this.oauth.setCredentials({ refresh_token });
  //   const people = google.people({ version: 'v1', auth: this.oauth });

  //   return people.people.connections.list({ auth: this.oauth, resourceName: 'people/me', personFields, pageSize, requestSyncToken: true }).catch((err) => {
  //     logger.error(err);
  //     throw err;
  //   });
  // };

  getUserProfile = async (refresh_token: string) => {
    this.oauth.setCredentials({ refresh_token })
    google.options({ auth: this.oauth })
    const requiredFields =
      'names,nicknames,organizations,emailAddresses,addresses,sipAddresses,userDefined,birthdays,urls,relations,imClients,phoneNumbers'
    return google
      .people('v1')
      .people.get({ resourceName: 'people/me', personFields: requiredFields })
      .catch((err) => {
        logger.log(err)
        return undefined
      })
  }
}
