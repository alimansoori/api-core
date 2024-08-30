import { Prisma } from '@prisma/client'
import { LOCATION_KEY } from '../../../../shared-models/index.js'

export const location: Prisma.locationCreateManyArgs['data'] = [
  {
    name: 'Coffee meeting',
    icon: 'coffee-colorful',
    key: LOCATION_KEY.uni_meet_video,
  },
  {
    name: 'Coffee webinar meeting',
    icon: 'coffee-colorful',
    key: LOCATION_KEY.uni_meet_webinar,
  },
  {
    name: 'Coffee audio-only meeting',
    icon: 'coffee-colorful',
    key: LOCATION_KEY.uni_meet_audio,
  },
  {
    name: 'Zoom meeting',
    icon: 'zoom-colorful',
    key: LOCATION_KEY.zoom,
  },
  {
    name: 'Google Meet',
    icon: 'google-meet-colorful',
    key: LOCATION_KEY.google_meet,
  },
  {
    name: 'Skype meeting',
    icon: 'skype-colorful',
    key: LOCATION_KEY.skype,
  },
  {
    name: 'Cisco Webex',
    icon: 'cisco-webex-colorful',
    key: LOCATION_KEY.cisco,
  },
  {
    name: 'Phone Call',
    icon: 'call-2',
    key: LOCATION_KEY.phone,
  },
  {
    name: 'In Person',
    icon: 'location',
    key: LOCATION_KEY.location,
  },
]
