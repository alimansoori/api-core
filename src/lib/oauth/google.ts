import { google } from 'googleapis'
import { getServerAddress } from '@app/utility/helpers/index.js'
import { getConfigs } from '../config.validator.js'

export const getUniclientGoogleOAuth = () =>
  new google.auth.OAuth2(
    getConfigs().GOOGLE_CLIENT_ID,
    getConfigs().GOOGLE_SECRET_KEY,
    getServerAddress() + '/api/v1/google/callback',
  )
