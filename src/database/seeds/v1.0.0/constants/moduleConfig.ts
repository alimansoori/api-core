import { Prisma } from '@prisma/client'
import { MODULE_CONFIG_KEY, MODULE_KEY } from '../../../../shared-models/index.js'

export const moduleConfigs: Prisma.module_configCreateArgs['data'][] = [
  {
    name: MODULE_CONFIG_KEY.outlook_calendar.id,
    module: { connect: { key: MODULE_KEY.outlook_calendar } },
    is_visible: false,
    description: 'user id in microsoft account',
  },
  {
    name: MODULE_CONFIG_KEY.outlook_calendar.email,
    module: { connect: { key: MODULE_KEY.outlook_calendar } },
    is_visible: true,
    description: 'user microsoft account email',
  },
  {
    name: MODULE_CONFIG_KEY.outlook_calendar.refresh_token,
    module: { connect: { key: MODULE_KEY.outlook_calendar } },
    is_visible: false,
    description: 'user microsoft account refresh token',
  },
  {
    name: MODULE_CONFIG_KEY.google_calendar.refresh_token,
    module: { connect: { key: MODULE_KEY.google_calendar } },
    is_visible: false,
    description: 'user google account refresh token',
  },
  {
    name: MODULE_CONFIG_KEY.google_calendar.email,
    module: { connect: { key: MODULE_KEY.google_calendar } },
    is_visible: true,
    description: 'user google account email',
  },
  {
    name: MODULE_CONFIG_KEY.google_calendar.calendar_list_watch_id,
    module: { connect: { key: MODULE_KEY.google_calendar } },
    is_visible: false,
    description: 'user google calendar list watch id',
  },
  {
    name: MODULE_CONFIG_KEY.google_calendar.calendar_list_sync_token,
    module: { connect: { key: MODULE_KEY.google_calendar } },
    is_visible: false,
    description: 'user google calendar list sync token',
  },
  {
    name: MODULE_CONFIG_KEY.google_calendar.calendar_list_resource_id,
    module: { connect: { key: MODULE_KEY.google_calendar } },
    is_visible: false,
    description: 'user google calendar list resource id',
  },
  {
    name: MODULE_CONFIG_KEY.google_calendar.calendar_list_failed_at,
    module: { connect: { key: MODULE_KEY.google_calendar } },
    is_visible: false,
    description: 'user google calendar list failure date',
  },
  {
    name: MODULE_CONFIG_KEY.google_contacts.refresh_token,
    module: { connect: { key: MODULE_KEY.google_contacts } },
    is_visible: false,
    description: 'user google account refresh token',
  },
  {
    name: MODULE_CONFIG_KEY.google_contacts.email,
    module: { connect: { key: MODULE_KEY.google_contacts } },
    is_visible: true,
    description: 'user google account email',
  },
  {
    name: MODULE_CONFIG_KEY.stripe.stripe_cus_id,
    module: { connect: { key: MODULE_KEY.workspace } },
    is_visible: false,
    description: 'workspace corresponding stripe customer id',
  },
  {
    name: MODULE_CONFIG_KEY.stripe.stripe_sub_id,
    module: { connect: { key: MODULE_KEY.workspace } },
    is_visible: false,
    description: 'workspace corresponding stripe subscription id',
  },
  {
    name: MODULE_CONFIG_KEY.stripe.refresh_token,
    module: { connect: { key: MODULE_KEY.stripe } },
    is_visible: false,
    description: 'User stripe refresh token',
  },
  {
    name: MODULE_CONFIG_KEY.stripe.user_id,
    module: { connect: { key: MODULE_KEY.stripe } },
    is_visible: false,
    description: 'User stripe ID',
  },
  {
    name: MODULE_CONFIG_KEY.clickup.access_token,
    module: { connect: { key: MODULE_KEY.clickup } },
    is_visible: false,
    description: 'Click up access token',
  },
  {
    name: MODULE_CONFIG_KEY.clickup.user_id,
    module: { connect: { key: MODULE_KEY.clickup } },
    is_visible: false,
    description: 'Click up user id',
  },
  {
    name: MODULE_CONFIG_KEY.clickup.email,
    module: { connect: { key: MODULE_KEY.clickup } },
    is_visible: true,
    description: 'Click up user email',
  },
]
