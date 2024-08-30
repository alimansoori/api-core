import { singleton } from 'tsyringe'
import { fetchRequestClio } from './facebookFetch.js'
import { IFacebookGetAccessTokenReq, IFacebookGetAccessTokenRes } from './interfaces/IFacebookGetAccessToken.js'
import { IFacebookGetMeRes, IFacebookGetMeReq } from './interfaces/IFacebookGetMe.js'

@singleton()
export default class FacebookApi {
  public getAccessToken = async (data: IFacebookGetAccessTokenReq) => {
    const url = 'v4.0/oauth/access_token'
    const res = await fetchRequestClio<IFacebookGetAccessTokenReq, IFacebookGetAccessTokenRes>('GET', url, data)
    return res
  }

  public getMe = async (access_token: string) => {
    const url = 'me'
    const data: IFacebookGetMeReq = {
      fields: 'email,first_name,last_name,picture',
      access_token,
    }
    const res = await fetchRequestClio<any, IFacebookGetMeRes>('GET', url, data)
    return res
  }
}
