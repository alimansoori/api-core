export interface IGetMapAutoComplete {
  predictions: {
    description: string
    matched_substrings: {
      length: number
      offset: number
    }[]
    place_id: string
    reference: string
    structured_formatting: {
      main_text: string
      main_text_matched_substrings: {
        length: number
        offset: number
      }[]
      secondary_text: string
    }
    terms: {
      offset: number
      value: string
    }[]

    types: string[]
  }[]
  status: 'OK' | 'INVALID_REQUEST' | 'REQUEST_DENIED' | 'UNKNOWN_ERROR' | 'ZERO_RESULTS'
}
export interface IGetPlaceDetail {
  result: {
    geometry: { location: { lat: number; lng: number } }
  }
}
