import { getConfigs } from '@app/lib/config.validator.js'
import { fetchRequest } from '@app/lib/fetch.js'
import { IGetMapAutoComplete, IGetPlaceDetail } from '@app/shared-models'
import { injectable } from 'tsyringe'

@injectable()
export class MapApi {
  constructor() {}

  getAutoComplete = async (text: string, type: string = 'address') => {
    const key = getConfigs().GOOGLE_MAP_API_KEY
    const res = await fetchRequest<{}, IGetMapAutoComplete>(
      'GET',
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=${type}&key=${key}`,
      {},
    )
    return res
  }

  getPlaceDetail = async (place_id: string) => {
    const key = getConfigs().GOOGLE_MAP_API_KEY
    const res = await fetchRequest<{}, IGetPlaceDetail>(
      'GET',
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${key}`,
      {},
    )
    return res
  }
}
