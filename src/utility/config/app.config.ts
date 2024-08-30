const pagination = {
  limit: 20,
  page: 1,
}

const googleOAuth = {
  web: {
    project_id: 'alimansoori71',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    redirect_uris: [
      'https://staging.alimansoori71.us/api/v1/oauth/google/callback',
      'http://localhost:3000/api/v1/oauth/google/callback',
      'http://localhost:3002/api/v1/oauth/google/callback',
      'https://dev.legaler.com/api/v1/oauth/google/callback',
      'https://staging.alimansoori71.us/api/v1/integration/google.calendar/connect/callback',
      'http://localhost:3002/api/v1/integration/google.calendar/connect/callback',
      'https://staging.alimansoori71.us/api/v1/integration/google.calendar/connect/callback',
      'https://dev.legaler.com/api/v1/integration/sgoogle.calendar/connect/callback',
    ],
    javascript_origins: [
      'http://localhost:3002',
      'http://localhost:8083',
      'https://staging.alimansoori71.us',
      'http://localhost:3000',
      'https://dev.legaler.com',
    ],
  },
}

const commonConfigs = {
  BASE_STATIC_PATH: 'api/upload',
  BASE_PUBLIC_PATH: 'api/v1',
  ILYACLIENT_API_PATH: '/api',
  MAX_RECURRENCE_INTERVAL: 365,
  UNICLIENT_ID: 'oRgAvVb6nYqie7HTkDqww',
  UNICLIENT_SECRET: '0h2A2wREAtuKkQj_5--OriruXdXAezor',
  LEGALER_CONNECT_BASE_REDIRECT_URL: 'http://localhost',
  OUTLOOK_CALENDAR_SCOPES: 'user.read,calendars.readwrite,mailboxsettings.read',
  OUTLOOK_CALENDAR_AUTHORITY: 'https://login.microsoftonline.com/common/',
  // amir you should make paths from  base route constants
  OUTLOOK_CALENDAR_REDIRECT_URL: '/api/v1/integration/outlook/callback',
  OUTLOOK_CALENDAR_NOTIFICATION_ADDRESS: '/api/v1/integration/outlook/notification/',
  MICROSOFT_AUTH_REDIRECT_URL: '/api/v1/oauth/microsoft/callback',
  GOOGLE_CALENDAR_NOTIFICATION_ADDRESS: '/api/v1/integration/google.calendar/notification',
  GOOGLE_CALENDAR_list_NOTIFICATION_ADDRESS: '/api/v1/integration/google.calendar/calendar-list/notification',
  SENTRY_DSN: 'https://e6dea7cc71cb49a69bdb79fb0681a79c@o1096708.ingest.sentry.io/6118987',
}

export const CLEAR_SOCKET_DATA_ON_START_APP = true

export const APP_CONFIG = {
  pagination,
  googleOAuth,
  CLEAR_SOCKET_DATA_ON_START_APP,
  ...commonConfigs,
}
