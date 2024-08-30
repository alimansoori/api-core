export enum LOCATION_KEY {
  uni_meet_video = 'uni_meet_video',
  uni_meet_webinar = 'uni_meet_webinar',
  uni_meet_audio = 'uni_meet_audio',
  zoom = 'zoom',
  google_meet = 'google_meet',
  skype = 'skype',
  cisco = 'cisco',
  phone = 'phone',
  location = 'location',
}
export type ILocationKeyType = keyof typeof LOCATION_KEY

export enum SELECT_MODULE_IMAGE_TYPE {
  cover = 'cover',
  cover_empty = 'cover_empty',
  logo = 'logo',
  logo_emoji = 'logo_emoji',
  logo_letter = 'logo_letter',
  logo_empty = 'logo_empty',
}
export type ISelectModuleImageType = keyof typeof SELECT_MODULE_IMAGE_TYPE
