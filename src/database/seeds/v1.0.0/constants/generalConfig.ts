import { Prisma } from '@prisma/client'
import { GENERAL_CONFIG_KEY } from '../../../../shared-models/index.js'

export const generalConfig: Prisma.general_configCreateManyArgs['data'] = [
  {
    key: GENERAL_CONFIG_KEY.seed_version,
    value: '1.0.0',
  },
  {
    key: GENERAL_CONFIG_KEY.max_req_in_specific_time,
    value: '2000',
  },
  {
    key: GENERAL_CONFIG_KEY.req_counter_ttl_time,
    value: '1800', // seconds
  },
  {
    key: GENERAL_CONFIG_KEY.external_req_counter_ttl_time,
    value: '300', // seconds
  },
  {
    key: GENERAL_CONFIG_KEY.external_req_delay_after_limit,
    value: '2000', // milliseconds
  },
  {
    key: GENERAL_CONFIG_KEY.max_external_req_in_specific_time,
    value: '300',
  },
  {
    key: GENERAL_CONFIG_KEY.user_ban_time,
    value: '1800',
  },
  {
    key: GENERAL_CONFIG_KEY.user_permanent_ban_count,
    value: '5',
  },
  {
    key: GENERAL_CONFIG_KEY.legaler_connect_authorize_code_ttl,
    value: '600',
  },
  {
    key: GENERAL_CONFIG_KEY.legaler_connect_not_trusted_app_limit,
    value: '5',
  },
  {
    key: GENERAL_CONFIG_KEY.base_workspace_storage_size,
    value: '500000000', // KB
  },
]
