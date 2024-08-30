import { Prisma } from '@prisma/client'
import { MODULE_CONFIG_KEY, MODULE_KEY } from '../../../../shared-models/index.js'

export const moduleConfigs: Prisma.module_configCreateArgs['data'][] = [
  {
    name: MODULE_CONFIG_KEY.clio.email,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: true,
    is_editable: false,
    description: 'user clio account email',
  },
  {
    name: MODULE_CONFIG_KEY.clio.account_id,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio account user id',
  },
  {
    name: MODULE_CONFIG_KEY.clio.access_token,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio account access token',
  },
  {
    name: MODULE_CONFIG_KEY.clio.refresh_token,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio account refresh token',
  },
  {
    name: MODULE_CONFIG_KEY.clio.contact_sync,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: true,
    is_editable: true,
    description: 'user clio contact_sync',
  },
  {
    name: MODULE_CONFIG_KEY.clio.contact_webhook_id,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio contact_webhook_id',
  },
  {
    name: MODULE_CONFIG_KEY.clio.contact_webhook_secret,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio contact_webhook_secret',
  },
  {
    name: MODULE_CONFIG_KEY.clio.contact_webhook_expire_at,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio contact_webhook_expire_at',
  },
  {
    name: MODULE_CONFIG_KEY.clio.project_sync,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: true,
    is_editable: true,
    description: 'user clio project_sync',
  },
  {
    name: MODULE_CONFIG_KEY.clio.project_webhook_id,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio project_webhook_id',
  },
  {
    name: MODULE_CONFIG_KEY.clio.project_webhook_secret,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio project_webhook_secret',
  },
  {
    name: MODULE_CONFIG_KEY.clio.project_webhook_expire_at,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio project_webhook_expire_at',
  },
  {
    name: MODULE_CONFIG_KEY.clio.meeting_sync,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: true,
    is_editable: true,
    description: 'user clio meeting_sync',
  },
  {
    name: MODULE_CONFIG_KEY.clio.meeting_webhook_id,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio meeting_webhook_id',
  },
  {
    name: MODULE_CONFIG_KEY.clio.meeting_webhook_secret,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio meeting_webhook_secret',
  },
  {
    name: MODULE_CONFIG_KEY.clio.meeting_webhook_expire_at,
    module: { connect: { key: MODULE_KEY.clio } },
    is_visible: false,
    is_editable: false,
    description: 'user clio meeting_webhook_expire_at',
  },
]
