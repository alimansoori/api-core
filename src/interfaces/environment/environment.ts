import { IAppConfig } from './config.js'

export interface IEnvironment extends IAppConfig {
  /**
   * @default development
   */
  NODE_ENV: 'development' | 'production' | 'staging' | 'test' | 'clinicjs'
  UNICORE_ADDRESS: string
  REDIS_NO_CLUSTER_PORT: number
  REDIS_NO_CLUSTER_HOST: string
  BASE_STATIC_PATH: string
  BASE_PUBLIC_PATH: string
  API_BACKEND_SERVER_ADDRESS: string
  ILYACLIENT_API_PATH: string
  EMAIL_SERVICE_URL: string
  MAX_RECURRENCE_INTERVAL: number
  UNICLIENT_USERS_PATH: string

  TELEGRAM_TOKEN: string,
  TELEGRAM_BOT_API: string,
  TELEGRAM_HTTPS_SERVER: string,

  MAIL_HOST: string
  MAIL_PORT: number
  MAIL_USER: string
  MAIL_PASS: string
  MAIL_FROM: string

  MIRO_CLIENT_ID: string
  MIRO_CLIENT_SECRET: string

  CLIO_AUTH_APP_KEY: string
  CLIO_AUTH_APP_SECRET: string
  CLIO_APP_KEY: string
  CLIO_APP_SECRET: string

  API_BACKEND_PORT: number
  API_BACKEND_SOCKET_PORT: number
  API_BACKEND_IP: string
  PRIMARY_SERVER_IP: string
  PRIMARY_SERVER_DOMAIN: string
  BASE_DIR: string
  UPLOAD_PATH: string

  JWT_PRIVATE_KEY: string
  JWT_PUBLIC_KEY: string

  MYSQL_DOCKER_IMAGE_VERSION: string

  MYSQL_PORT_1: number
  MYSQL_IP_1: string
  MYSQL_HOST_1: string
  MYSQL_PORT_2: string
  MYSQL_IP_2: string
  MYSQL_HOST_2: string

  DATABASE_URL: string
  DATABASE_USERNAME: string
  DATABASE_PASSWORD: string
  DATABASE_NAME: string

  FACEBOOK_CLIENT_ID: string
  FACEBOOK_CLIENT_SECRET: string

  UNICLIENT_ID: string
  UNICLIENT_SECRET: string

  REDIS_NO_CLUSTER_PASSWORD: string
  /**
   * @minimum 0
   * @maximum 15
   * @default 0
   */
  REDIS_NO_CLUSTER_DATABASE_INDEX?: number
  REDIS_KEY_PREFIX?: string

  REFRESH_TOKEN_AGE_DAY: number
  ACCESS_TOKEN_EXPIRY: number

  TWILIO_ACCOUNT_SID: string
  TWILIO_AUTH_TOKEN: string
  TWILIO_SENDER_PHONE: string

  STRIPE_SECRET_KEY: string
  STRIPE_PUBLISH_KEY: string

  STRIPE_OAUTH_SECRET_KEY: string
  STRIPE_OAUTH_PUBLISH_KEY: string
  STRIPE_OAUTH_CLIENT_ID: string

  STRIPE_WEBHOOK_SECRET?: string

  OUTLOOK_CALENDAR_SCOPES: string
  OUTLOOK_CALENDAR_REDIRECT_URL: string
  OUTLOOK_CALENDAR_CLIENT_ID: string
  OUTLOOK_CALENDAR_AUTHORITY: string
  OUTLOOK_CALENDAR_CLIENT_SECRET: string
  OUTLOOK_CALENDAR_NOTIFICATION_ADDRESS: string
  MICROSOFT_AUTH_REDIRECT_URL: string

  GOOGLE_MAP_API_KEY: string
  GOOGLE_CALENDAR_NOTIFICATION_ADDRESS: string
  GOOGLE_CALENDAR_list_NOTIFICATION_ADDRESS: string
  LEGALER_CONNECT_BASE_REDIRECT_URL: string

  GOOGLE_CALENDAR_ACTION_REQ_DELAYS_MS: number
  GOOGLE_CALENDAR_ACTION_MAX_REQS: number
  GOOGLE_CALENDAR_NOTIFICATION_MAX_REQS: number

  BULK_REQUEST_LIMIT: number

  APP_VER: string

  SENTRY_DSN: string

  FRONT_SERVER_ADDRESS: string
  PUBLIC_STORAGE_NAME: string
  CHAT_SERVER_URL: string
  CHAT_SERVER_ADMIN_TOKEN: string
  CHAT_SERVER_ADMIN_ID: string
  CHAT_SERVER_HELPER_URL: string
  CHAT_SERVER_SOCKET_URL: string
  CHAT_NOTIF_KEY: string
  CHAT_DATABASE_NAME: string
  MONGO_SERVER_URL: string
  MONITORING_ACCESS_TOKEN: string
  GRAFANA_SERVER_IP: string

  REDIS_DOCKER_IMAGE_VERSION: string

  REDIS_EXTERNAL_PORT_1: number
  REDIS_DOCKER_PORT_1: number
  REDIS_IP_1: string
  REDIS_HOST_1: string

  REDIS_EXTERNAL_PORT_2: number
  REDIS_DOCKER_PORT_2: number
  REDIS_IP_2: string
  REDIS_HOST_2: string

  REDIS_EXTERNAL_PORT_3: number
  REDIS_DOCKER_PORT_3: number
  REDIS_IP_3: string
  REDIS_HOST_3: string

  REDIS_EXTERNAL_PORT_4: number
  REDIS_DOCKER_PORT_4: number
  REDIS_IP_4: string
  REDIS_HOST_4: string

  REDIS_EXTERNAL_PORT_5: number
  REDIS_DOCKER_PORT_5: number
  REDIS_IP_5: string
  REDIS_HOST_5: string

  REDIS_EXTERNAL_PORT_6: number
  REDIS_DOCKER_PORT_6: number
  REDIS_IP_6: string
  REDIS_HOST_6: string
  /**
   * @default false
   */
  REDIS_USE_EXTERNAL_PORT?: boolean
  /**
   * @default false
   */
  REDIS_NO_CLUSTER?: boolean

  // firebase config
  FIREBASE_TYPE: string
  FIREBASE_PROJECT_ID: string
  FIREBASE_PRIVATE_KEY_ID: string
  FIREBASE_PRIVATE_KEY: string
  FIREBASE_CLIENT_EMAIL: string
  FIREBASE_CLIENT_ID: string
  FIREBASE_AUTH_URI: string
  FIREBASE_TOKEN_URI: string
  FIREBASE_AUTH_PROVIDER_X509_CERT_URL: string
  FIREBASE_CLIENT_X509_CERT_URL: string
  FIREBASE_API_KEY: string
  FIREBASE_AUTH_DOMAIN: string
  FIREBASE_STORAGE_BUCKET: string
  FIREBASE_MESSAGING_SENDER_ID: string
  FIREBASE_APP_ID: string
  FIREBASE_MEASUREMENT_ID: string
  FIREBASE_VAPID_KEY: string
  /**
   * @default false
   */
  CLEAR_SOCKET_DATA_ON_START_APP?: boolean

  MINIO_IP?: string
  USING_SSL_MINIO: boolean
  MINIO_HOST: string
  MINIO_PORT: number
  MINIO_CONSOLE_PORT: number
  MINIO_USERNAME: string
  MINIO_PASSWORD: string
  MINIO_ENCRYPTION_OFF?: boolean
  /**
   * @default false
   */
  SEED_MINIO?: boolean
  PROMETHEUS_INTERVAL_MS: number
  GOOGLE_CLIENT_ID: string
  /**
   * @default false
   */
  IS_MINIO_ENABLED?: boolean
  /**
   * @default false
   */
  IS_STRIPE_ENABLED?: boolean
  TRIAL_PERIOD_DAYS: number
  WHISPER_COMMAND: string
  WHISPER_MODEL: string
  WHISPER_SERVER_ADDRESS: string
  /**
   * @default ["ctranslate2","openai"]
   */
  TRANSCRIPTION_ENGINES: ('ctranslate2' | 'openai' | 'iotype')[]
  GOOGLE_SECRET_KEY: string
  /**
   * @default false
   */
  PUSH_NOTIFICATION_DISABLED?: boolean
  /**
   * @default false
   */
  SMS_DISABLED?: boolean

  /**
   * @default false
   */
  IS_MEDIASERVER: boolean
  /**
   * @default 4001
   */
  MS_WS_PORT: number
  /**
  /**
   * @default 4002
   */
  MS_PORT: number
  /**
   * @default 10000
   */
  MS_MIN_PORT: number
  /**
   * @default 20000
   */
  MS_MAX_PORT: number
  /**
   * @default 5
   */
  MS_ROOM_AUTO_CLOSE_MIN: number
  /**
   * @default false
   */
  DISABLE_MEDIASERVER_TRACKER: boolean
  MS_SECRET: string
  /**
   * @default 1
   */
  MEDIASERVER_VERSION: number

  /**
   * @default
   */
  MEDIASERVER_DEBUG: string
  /**
   * @default ffmpeg
   */
  MEDIASERVER_RECORD_PROCESS: 'ffmpeg' | 'gstreamer'

  MS_ANNOUNCE_IP?: string

  // openAI config
  ORGANIZATION_ID: string
  OPENAI_API_KEY: string
  OPENAI_ASSISTANT_ID: string
  NO_SPEECH_TRESHOLD?: string
  // Slack
  SLACK_BOT_TOKEN: string
  SLACK_USER_TOKEN: string
  SLACK_SIGNING_SECRET: string
  SLACK_App_ID: string
  SLACK_CREDENTIAL_EXPIRATION_DAYS: number
  SLACK_CLIENT_ID: string
  SLACK_CLIENT_SECRET: string
  WAIT_LIST_COFFEE_API_KEY: string
  WAIT_LIST_GOOD_COFFEE_API_KEY: string
  MIXPANEL_TOKEN: string
  IOTYPE_TOKEN: string
  SEED_BORING_AVATAR?: boolean
  SEED_TASK?: boolean
  CLICK_UP_CLIENT_ID: string
  CLICK_UP_CLIENT_SECRET: string
  MAGIC_LINK_CLIENT_ID: string
  MAGIC_LINk_SECRET_KEY: string
}
