import { Prisma } from '@prisma/client'
import { MODULE_KEY, PLAN_CONFIG_KEY } from '../../../../shared-models/index.js'

export const planConfig: Prisma.plan_configCreateArgs['data'][] = [
  { name: PLAN_CONFIG_KEY.module_max_count, module: { connect: { key: MODULE_KEY.system } } },
  { name: PLAN_CONFIG_KEY.meeting_length_limit, module: { connect: { key: MODULE_KEY.meeting } } },
  { name: PLAN_CONFIG_KEY.meeting_recurrence, module: { connect: { key: MODULE_KEY.meeting } } },
  { name: PLAN_CONFIG_KEY.service_variation, module: { connect: { key: MODULE_KEY.service } } },
  { name: PLAN_CONFIG_KEY.ai_token_limit, module: { connect: { key: MODULE_KEY.system } } },
  { name: PLAN_CONFIG_KEY.workspace_max_guest, module: { connect: { key: MODULE_KEY.workspace } } },
  { name: PLAN_CONFIG_KEY.workspace_max_member, module: { connect: { key: MODULE_KEY.workspace } } },
  { name: PLAN_CONFIG_KEY.workspace_custom_role, module: { connect: { key: MODULE_KEY.workspace } } },
  { name: PLAN_CONFIG_KEY.storage_capacity, module: { connect: { key: MODULE_KEY.file } } },
  { name: PLAN_CONFIG_KEY.retention_duration, module: { connect: { key: MODULE_KEY.system } } },
  { name: PLAN_CONFIG_KEY.embedding_access, module: { connect: { key: MODULE_KEY.system } } },
  { name: PLAN_CONFIG_KEY.module_custom_url, module: { connect: { key: MODULE_KEY.system } } },
  { name: PLAN_CONFIG_KEY.white_label, module: { connect: { key: MODULE_KEY.workspace } } },
  { name: PLAN_CONFIG_KEY.integration_access, module: { connect: { key: MODULE_KEY.system } } },
  { name: PLAN_CONFIG_KEY.api_access, module: { connect: { key: MODULE_KEY.system } } },
  { name: PLAN_CONFIG_KEY.premium_support, module: { connect: { key: MODULE_KEY.system } } },
]
