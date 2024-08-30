export const IEnvironmentSchema = {
  type: 'object',
  properties: {
    NODE_ENV: {
      default: 'development',
      enum: ['clinicjs', 'development', 'production', 'staging', 'test'],
      type: 'string',
    },
    TELEGRAM_TOKEN: {
      type: 'string',
    },
    TELEGRAM_BOT_API: {
      type: 'string',
    },
    TELEGRAM_HTTPS_SERVER: {
      type: 'string',
    },
    UNICORE_ADDRESS: {
      type: 'string',
    },
    REDIS_NO_CLUSTER_PORT: {
      type: 'integer',
    },
    REDIS_NO_CLUSTER_HOST: {
      type: 'string',
    },
    BASE_STATIC_PATH: {
      type: 'string',
    },
    BASE_PUBLIC_PATH: {
      type: 'string',
    },
    API_BACKEND_SERVER_ADDRESS: {
      type: 'string',
    },
    ILYACLIENT_API_PATH: {
      type: 'string',
    },
    EMAIL_SERVICE_URL: {
      type: 'string',
    },
    MAX_RECURRENCE_INTERVAL: {
      type: 'integer',
    },
    UNICLIENT_USERS_PATH: {
      type: 'string',
    },

    MAIL_HOST: {
      type: 'string',
    },
    MAIL_PORT: {
      type: 'integer',
    },
    MAIL_USER: {
      type: 'string',
    },
    MAIL_PASS: {
      type: 'string',
    },
    MAIL_FROM: {
      type: 'string',
    },

    MIRO_CLIENT_ID: {
      type: 'string',
    },
    MIRO_CLIENT_SECRET: {
      type: 'string',
    },
    CLIO_AUTH_APP_KEY: {
      type: 'string',
    },
    CLIO_AUTH_APP_SECRET: {
      type: 'string',
    },
    CLIO_APP_KEY: {
      type: 'string',
    },
    CLIO_APP_SECRET: {
      type: 'string',
    },
    API_BACKEND_PORT: {
      type: 'integer',
    },
    API_BACKEND_SOCKET_PORT: {
      type: 'integer',
    },
    API_BACKEND_IP: {
      type: 'string',
    },
    PRIMARY_SERVER_IP: {
      type: 'string',
    },
    PRIMARY_SERVER_DOMAIN: {
      type: 'string',
    },
    BASE_DIR: {
      type: 'string',
    },
    UPLOAD_PATH: {
      type: 'string',
    },
    JWT_PRIVATE_KEY: {
      type: 'string',
    },
    JWT_PUBLIC_KEY: {
      type: 'string',
    },
    MYSQL_DOCKER_IMAGE_VERSION: {
      type: 'string',
    },
    MYSQL_PORT_1: {
      type: 'integer',
    },
    MYSQL_IP_1: {
      type: 'string',
    },
    MYSQL_HOST_1: {
      type: 'string',
    },
    MYSQL_PORT_2: {
      type: 'string',
    },
    MYSQL_IP_2: {
      type: 'string',
    },
    MYSQL_HOST_2: {
      type: 'string',
    },
    DATABASE_URL: {
      type: 'string',
    },
    DATABASE_USERNAME: {
      type: 'string',
    },
    DATABASE_PASSWORD: {
      type: 'string',
    },
    DATABASE_NAME: {
      type: 'string',
    },
    FACEBOOK_CLIENT_ID: {
      type: 'string',
    },
    FACEBOOK_CLIENT_SECRET: {
      type: 'string',
    },
    UNICLIENT_ID: {
      type: 'string',
    },
    UNICLIENT_SECRET: {
      type: 'string',
    },
    REDIS_NO_CLUSTER_PASSWORD: {
      type: 'string',
    },
    REDIS_NO_CLUSTER_DATABASE_INDEX: {
      minimum: 0,
      maximum: 15,
      default: 0,
      type: 'integer',
    },
    REDIS_KEY_PREFIX: {
      type: 'string',
    },
    REFRESH_TOKEN_AGE_DAY: {
      type: 'integer',
    },
    ACCESS_TOKEN_EXPIRY: {
      type: 'integer',
    },
    TWILIO_ACCOUNT_SID: {
      type: 'string',
    },
    TWILIO_AUTH_TOKEN: {
      type: 'string',
    },
    TWILIO_SENDER_PHONE: {
      type: 'string',
    },
    STRIPE_SECRET_KEY: {
      type: 'string',
    },
    STRIPE_PUBLISH_KEY: {
      type: 'string',
    },
    STRIPE_OAUTH_SECRET_KEY: {
      type: 'string',
    },
    STRIPE_OAUTH_PUBLISH_KEY: {
      type: 'string',
    },
    STRIPE_OAUTH_CLIENT_ID: {
      type: 'string',
    },
    STRIPE_WEBHOOK_SECRET: {
      type: 'string',
    },
    OUTLOOK_CALENDAR_SCOPES: {
      type: 'string',
    },
    OUTLOOK_CALENDAR_REDIRECT_URL: {
      type: 'string',
    },
    OUTLOOK_CALENDAR_CLIENT_ID: {
      type: 'string',
    },
    OUTLOOK_CALENDAR_AUTHORITY: {
      type: 'string',
    },
    OUTLOOK_CALENDAR_CLIENT_SECRET: {
      type: 'string',
    },
    OUTLOOK_CALENDAR_NOTIFICATION_ADDRESS: {
      type: 'string',
    },
    MICROSOFT_AUTH_REDIRECT_URL: {
      type: 'string',
    },
    GOOGLE_MAP_API_KEY: {
      type: 'string',
    },
    GOOGLE_CALENDAR_NOTIFICATION_ADDRESS: {
      type: 'string',
    },
    GOOGLE_CALENDAR_list_NOTIFICATION_ADDRESS: {
      type: 'string',
    },
    LEGALER_CONNECT_BASE_REDIRECT_URL: {
      type: 'string',
    },
    GOOGLE_CALENDAR_ACTION_REQ_DELAYS_MS: {
      type: 'integer',
    },
    GOOGLE_CALENDAR_ACTION_MAX_REQS: {
      type: 'integer',
    },
    GOOGLE_CALENDAR_NOTIFICATION_MAX_REQS: {
      type: 'integer',
    },
    BULK_REQUEST_LIMIT: {
      type: 'integer',
    },
    APP_VER: {
      type: 'string',
    },
    SENTRY_DSN: {
      type: 'string',
    },
    FRONT_SERVER_ADDRESS: {
      type: 'string',
    },
    PUBLIC_STORAGE_NAME: {
      type: 'string',
    },
    CHAT_SERVER_URL: {
      type: 'string',
    },
    CHAT_SERVER_ADMIN_TOKEN: {
      type: 'string',
    },
    CHAT_SERVER_ADMIN_ID: {
      type: 'string',
    },
    CHAT_SERVER_HELPER_URL: {
      type: 'string',
    },
    CHAT_SERVER_SOCKET_URL: {
      type: 'string',
    },
    CHAT_NOTIF_KEY: {
      type: 'string',
    },
    CHAT_DATABASE_NAME: {
      type: 'string',
    },
    MONGO_SERVER_URL: {
      type: 'string',
    },
    MONITORING_ACCESS_TOKEN: {
      type: 'string',
    },
    GRAFANA_SERVER_IP: {
      type: 'string',
    },
    REDIS_DOCKER_IMAGE_VERSION: {
      type: 'string',
    },
    REDIS_EXTERNAL_PORT_1: {
      type: 'integer',
    },
    REDIS_DOCKER_PORT_1: {
      type: 'integer',
    },
    REDIS_IP_1: {
      type: 'string',
    },
    REDIS_HOST_1: {
      type: 'string',
    },
    REDIS_EXTERNAL_PORT_2: {
      type: 'integer',
    },
    REDIS_DOCKER_PORT_2: {
      type: 'integer',
    },
    REDIS_IP_2: {
      type: 'string',
    },
    REDIS_HOST_2: {
      type: 'string',
    },
    REDIS_EXTERNAL_PORT_3: {
      type: 'integer',
    },
    REDIS_DOCKER_PORT_3: {
      type: 'integer',
    },
    REDIS_IP_3: {
      type: 'string',
    },
    REDIS_HOST_3: {
      type: 'string',
    },
    REDIS_EXTERNAL_PORT_4: {
      type: 'integer',
    },
    REDIS_DOCKER_PORT_4: {
      type: 'integer',
    },
    REDIS_IP_4: {
      type: 'string',
    },
    REDIS_HOST_4: {
      type: 'string',
    },
    REDIS_EXTERNAL_PORT_5: {
      type: 'integer',
    },
    REDIS_DOCKER_PORT_5: {
      type: 'integer',
    },
    REDIS_IP_5: {
      type: 'string',
    },
    REDIS_HOST_5: {
      type: 'string',
    },
    REDIS_EXTERNAL_PORT_6: {
      type: 'integer',
    },
    REDIS_DOCKER_PORT_6: {
      type: 'integer',
    },
    REDIS_IP_6: {
      type: 'string',
    },
    REDIS_HOST_6: {
      type: 'string',
    },
    REDIS_USE_EXTERNAL_PORT: {
      default: false,
      type: 'boolean',
    },
    REDIS_NO_CLUSTER: {
      default: false,
      type: 'boolean',
    },
    FIREBASE_TYPE: {
      type: 'string',
    },
    FIREBASE_PROJECT_ID: {
      type: 'string',
    },
    FIREBASE_PRIVATE_KEY_ID: {
      type: 'string',
    },
    FIREBASE_PRIVATE_KEY: {
      type: 'string',
    },
    FIREBASE_CLIENT_EMAIL: {
      type: 'string',
    },
    FIREBASE_CLIENT_ID: {
      type: 'string',
    },
    FIREBASE_AUTH_URI: {
      type: 'string',
    },
    FIREBASE_TOKEN_URI: {
      type: 'string',
    },
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL: {
      type: 'string',
    },
    FIREBASE_CLIENT_X509_CERT_URL: {
      type: 'string',
    },
    FIREBASE_API_KEY: {
      type: 'string',
    },
    FIREBASE_AUTH_DOMAIN: {
      type: 'string',
    },
    FIREBASE_STORAGE_BUCKET: {
      type: 'string',
    },
    FIREBASE_MESSAGING_SENDER_ID: {
      type: 'string',
    },
    FIREBASE_APP_ID: {
      type: 'string',
    },
    FIREBASE_MEASUREMENT_ID: {
      type: 'string',
    },
    FIREBASE_VAPID_KEY: {
      type: 'string',
    },
    CLEAR_SOCKET_DATA_ON_START_APP: {
      default: false,
      type: 'boolean',
    },
    MINIO_IP: {
      type: 'string',
    },
    USING_SSL_MINIO: {
      type: 'boolean',
    },
    MINIO_HOST: {
      type: 'string',
    },
    MINIO_PORT: {
      type: 'integer',
    },
    MINIO_CONSOLE_PORT: {
      type: 'integer',
    },
    MINIO_USERNAME: {
      type: 'string',
    },
    MINIO_PASSWORD: {
      type: 'string',
    },
    MINIO_ENCRYPTION_OFF: {
      type: 'boolean',
    },
    SEED_MINIO: {
      default: false,
      type: 'boolean',
    },
    PROMETHEUS_INTERVAL_MS: {
      type: 'integer',
    },
    GOOGLE_CLIENT_ID: {
      type: 'string',
    },
    IS_MINIO_ENABLED: {
      default: false,
      type: 'boolean',
    },
    IS_STRIPE_ENABLED: {
      default: false,
      type: 'boolean',
    },
    TRIAL_PERIOD_DAYS: {
      type: 'integer',
    },
    WHISPER_COMMAND: {
      type: 'string',
    },
    WHISPER_MODEL: {
      type: 'string',
    },
    WHISPER_SERVER_ADDRESS: {
      type: 'string',
    },
    TRANSCRIPTION_ENGINES: {
      default: ['ctranslate2', 'openai'],
      type: 'array',
      items: {
        enum: ['ctranslate2', 'iotype', 'openai'],
        type: 'string',
      },
    },
    GOOGLE_SECRET_KEY: {
      type: 'string',
    },
    PUSH_NOTIFICATION_DISABLED: {
      default: false,
      type: 'boolean',
    },
    SMS_DISABLED: {
      default: false,
      type: 'boolean',
    },
    IS_MEDIASERVER: {
      default: false,
      type: 'boolean',
    },
    MS_WS_PORT: {
      default: 4001,
      type: 'integer',
    },
    MS_PORT: {
      description: '/**',
      default: 4002,
      type: 'integer',
    },
    MS_MIN_PORT: {
      default: 10000,
      type: 'integer',
    },
    MS_MAX_PORT: {
      default: 20000,
      type: 'integer',
    },
    MS_ROOM_AUTO_CLOSE_MIN: {
      default: 5,
      type: 'integer',
    },
    DISABLE_MEDIASERVER_TRACKER: {
      default: false,
      type: 'boolean',
    },
    MS_SECRET: {
      type: 'string',
    },
    MEDIASERVER_VERSION: {
      default: 1,
      type: 'integer',
    },
    MEDIASERVER_DEBUG: {
      default: '',
      type: 'string',
    },
    MEDIASERVER_RECORD_PROCESS: {
      default: 'ffmpeg',
      enum: ['ffmpeg', 'gstreamer'],
      type: 'string',
    },
    MS_ANNOUNCE_IP: {
      type: 'string',
    },
    ORGANIZATION_ID: {
      type: 'string',
    },
    OPENAI_API_KEY: {
      type: 'string',
    },
    OPENAI_ASSISTANT_ID: {
      type: 'string',
    },
    NO_SPEECH_TRESHOLD: {
      type: 'string',
    },
    SLACK_BOT_TOKEN: {
      type: 'string',
    },
    SLACK_USER_TOKEN: {
      type: 'string',
    },
    SLACK_SIGNING_SECRET: {
      type: 'string',
    },
    SLACK_App_ID: {
      type: 'string',
    },
    SLACK_CREDENTIAL_EXPIRATION_DAYS: {
      type: 'integer',
    },
    SLACK_CLIENT_ID: {
      type: 'string',
    },
    SLACK_CLIENT_SECRET: {
      type: 'string',
    },
    WAIT_LIST_COFFEE_API_KEY: {
      type: 'string',
    },
    WAIT_LIST_GOOD_COFFEE_API_KEY: {
      type: 'string',
    },
    MIXPANEL_TOKEN: {
      type: 'string',
    },
    IOTYPE_TOKEN: {
      type: 'string',
    },
    SEED_BORING_AVATAR: {
      type: 'boolean',
    },
    SEED_TASK: {
      type: 'boolean',
    },
    CLICK_UP_CLIENT_ID: {
      type: 'string',
    },
    CLICK_UP_CLIENT_SECRET: {
      type: 'string',
    },
    MAGIC_LINK_CLIENT_ID: {
      type: 'string',
    },
    MAGIC_LINk_SECRET_KEY: {
      type: 'string',
    },
    pagination: {
      type: 'object',
      properties: {
        limit: {
          type: 'integer',
        },
        page: {
          type: 'integer',
        },
      },
      additionalProperties: false,
      required: ['limit', 'page'],
    },
    googleOAuth: {
      type: 'object',
      properties: {
        web: {
          type: 'object',
          properties: {
            project_id: {
              type: 'string',
            },
            auth_uri: {
              type: 'string',
            },
            token_uri: {
              type: 'string',
            },
            auth_provider_x509_cert_url: {
              type: 'string',
            },
            redirect_uris: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            javascript_origins: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          additionalProperties: false,
          required: [
            'auth_provider_x509_cert_url',
            'auth_uri',
            'javascript_origins',
            'project_id',
            'redirect_uris',
            'token_uri',
          ],
        },
      },
      additionalProperties: false,
      required: ['web'],
    },
  },
  additionalProperties: false,
  required: [
    'ACCESS_TOKEN_EXPIRY',
    'API_BACKEND_IP',
    'API_BACKEND_PORT',
    'API_BACKEND_SERVER_ADDRESS',
    'API_BACKEND_SOCKET_PORT',
    'APP_VER',
    'BASE_DIR',
    'BASE_PUBLIC_PATH',
    'BASE_STATIC_PATH',
    'BULK_REQUEST_LIMIT',
    'CHAT_DATABASE_NAME',
    'CHAT_NOTIF_KEY',
    'CHAT_SERVER_ADMIN_ID',
    'CHAT_SERVER_ADMIN_TOKEN',
    'CHAT_SERVER_HELPER_URL',
    'CHAT_SERVER_SOCKET_URL',
    'CHAT_SERVER_URL',
    'CLICK_UP_CLIENT_ID',
    'CLICK_UP_CLIENT_SECRET',
    'CLIO_APP_KEY',
    'CLIO_APP_SECRET',
    'CLIO_AUTH_APP_KEY',
    'CLIO_AUTH_APP_SECRET',
    'DATABASE_NAME',
    'DATABASE_PASSWORD',
    'DATABASE_URL',
    'DATABASE_USERNAME',
    'DISABLE_MEDIASERVER_TRACKER',
    'EMAIL_SERVICE_URL',
    'FACEBOOK_CLIENT_ID',
    'FACEBOOK_CLIENT_SECRET',
    'FIREBASE_API_KEY',
    'FIREBASE_APP_ID',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_AUTH_PROVIDER_X509_CERT_URL',
    'FIREBASE_AUTH_URI',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID',
    'FIREBASE_CLIENT_X509_CERT_URL',
    'FIREBASE_MEASUREMENT_ID',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_TOKEN_URI',
    'FIREBASE_TYPE',
    'FIREBASE_VAPID_KEY',
    'FRONT_SERVER_ADDRESS',
    'GOOGLE_CALENDAR_ACTION_MAX_REQS',
    'GOOGLE_CALENDAR_ACTION_REQ_DELAYS_MS',
    'GOOGLE_CALENDAR_NOTIFICATION_ADDRESS',
    'GOOGLE_CALENDAR_NOTIFICATION_MAX_REQS',
    'GOOGLE_CALENDAR_list_NOTIFICATION_ADDRESS',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_MAP_API_KEY',
    'GOOGLE_SECRET_KEY',
    'GRAFANA_SERVER_IP',
    'IOTYPE_TOKEN',
    'IS_MEDIASERVER',
    'JWT_PRIVATE_KEY',
    'JWT_PUBLIC_KEY',
    'LEGALER_CONNECT_BASE_REDIRECT_URL',
    'MAGIC_LINK_CLIENT_ID',
    'MAGIC_LINk_SECRET_KEY',
    'MAX_RECURRENCE_INTERVAL',
    'MEDIASERVER_DEBUG',
    'MEDIASERVER_RECORD_PROCESS',
    'MEDIASERVER_VERSION',
    'MICROSOFT_AUTH_REDIRECT_URL',
    'MINIO_CONSOLE_PORT',
    'MINIO_HOST',
    'MINIO_PASSWORD',
    'MINIO_PORT',
    'MINIO_USERNAME',
    'MIRO_CLIENT_ID',
    'MIRO_CLIENT_SECRET',
    'MIXPANEL_TOKEN',
    'MONGO_SERVER_URL',
    'MONITORING_ACCESS_TOKEN',
    'MS_MAX_PORT',
    'MS_MIN_PORT',
    'MS_PORT',
    'MS_ROOM_AUTO_CLOSE_MIN',
    'MS_SECRET',
    'MS_WS_PORT',
    'MYSQL_DOCKER_IMAGE_VERSION',
    'MYSQL_HOST_1',
    'MYSQL_HOST_2',
    'MYSQL_IP_1',
    'MYSQL_IP_2',
    'MYSQL_PORT_1',
    'MYSQL_PORT_2',
    'NODE_ENV',
    'OPENAI_API_KEY',
    'OPENAI_ASSISTANT_ID',
    'ORGANIZATION_ID',
    'OUTLOOK_CALENDAR_AUTHORITY',
    'OUTLOOK_CALENDAR_CLIENT_ID',
    'OUTLOOK_CALENDAR_CLIENT_SECRET',
    'OUTLOOK_CALENDAR_NOTIFICATION_ADDRESS',
    'OUTLOOK_CALENDAR_REDIRECT_URL',
    'OUTLOOK_CALENDAR_SCOPES',
    'PRIMARY_SERVER_DOMAIN',
    'PRIMARY_SERVER_IP',
    'PROMETHEUS_INTERVAL_MS',
    'PUBLIC_STORAGE_NAME',
    'REDIS_DOCKER_IMAGE_VERSION',
    'REDIS_DOCKER_PORT_1',
    'REDIS_DOCKER_PORT_2',
    'REDIS_DOCKER_PORT_3',
    'REDIS_DOCKER_PORT_4',
    'REDIS_DOCKER_PORT_5',
    'REDIS_DOCKER_PORT_6',
    'REDIS_EXTERNAL_PORT_1',
    'REDIS_EXTERNAL_PORT_2',
    'REDIS_EXTERNAL_PORT_3',
    'REDIS_EXTERNAL_PORT_4',
    'REDIS_EXTERNAL_PORT_5',
    'REDIS_EXTERNAL_PORT_6',
    'REDIS_HOST_1',
    'REDIS_HOST_2',
    'REDIS_HOST_3',
    'REDIS_HOST_4',
    'REDIS_HOST_5',
    'REDIS_HOST_6',
    'REDIS_IP_1',
    'REDIS_IP_2',
    'REDIS_IP_3',
    'REDIS_IP_4',
    'REDIS_IP_5',
    'REDIS_IP_6',
    'REDIS_NO_CLUSTER_HOST',
    'REDIS_NO_CLUSTER_PASSWORD',
    'REDIS_NO_CLUSTER_PORT',
    'REFRESH_TOKEN_AGE_DAY',
    'SENTRY_DSN',
    'SLACK_App_ID',
    'SLACK_BOT_TOKEN',
    'SLACK_CLIENT_ID',
    'SLACK_CLIENT_SECRET',
    'SLACK_CREDENTIAL_EXPIRATION_DAYS',
    'SLACK_SIGNING_SECRET',
    'SLACK_USER_TOKEN',
    'STRIPE_OAUTH_CLIENT_ID',
    'STRIPE_OAUTH_PUBLISH_KEY',
    'STRIPE_OAUTH_SECRET_KEY',
    'STRIPE_PUBLISH_KEY',
    'STRIPE_SECRET_KEY',
    'TRANSCRIPTION_ENGINES',
    'TRIAL_PERIOD_DAYS',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_SENDER_PHONE',
    'ILYACLIENT_API_PATH',
    'UNICLIENT_ID',
    'UNICLIENT_SECRET',
    'UNICLIENT_USERS_PATH',
    'UNICORE_ADDRESS',
    'UPLOAD_PATH',
    'USING_SSL_MINIO',
    'WAIT_LIST_COFFEE_API_KEY',
    'WAIT_LIST_GOOD_COFFEE_API_KEY',
    'WHISPER_COMMAND',
    'WHISPER_MODEL',
    'WHISPER_SERVER_ADDRESS',
    'googleOAuth',
    'pagination',
  ],
}
