import { logger } from '@app/lib/logger.js'
import { MODULE_KEY_TYPE } from '@app/shared-models/index.js'
import { HISTORY_ACTION } from '@prisma/client'
import { container } from 'tsyringe'
import Mixpanel from '../mixpanel/mixpanel.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { Context } from '@app/interfaces/index.js'
import { capitalize, onSuccessChecker } from '@app/utility/helpers/index.js'
import { FastifyRequest } from 'fastify'
import Mp from 'mixpanel'

const eventDescriptionGenerator = (
  action: HISTORY_ACTION,
  module: MODULE_KEY_TYPE,
  entity_name: string,
  user: {
    user_hash: string
    first_name: string
    last_name: string
    nickname: string | null
  } | null,
  options?: {
    is_meeting_recurring?: boolean
    is_meeting_poll?: boolean
    is_instant?: boolean
  },
) => {
  let action_description: string | undefined
  let event_name: string | undefined = ''
  const full_name = user ? user.first_name + ' ' + user.last_name : undefined

  if (options?.is_meeting_recurring) {
    entity_name = 'Recurring meeting ' + entity_name
    event_name = 'Recurring meeting '
  } else if (options?.is_meeting_poll) {
    entity_name = 'Poll meeting ' + entity_name
    event_name = 'Poll meeting '
  } else if (options?.is_instant) {
    entity_name = 'Instant meeting ' + entity_name
    event_name = 'Instant meeting '
  }

  let add_action_maker = true

  switch (action) {
    case 'accept_booking': {
      action_description = `Booking ${entity_name} has been accepted`
      event_name += 'Booking accepted'
      break
    }

    case 'add_share': {
      action_description = `${entity_name} has been shared`
      event_name += 'has been shared'
      break
    }

    case 'add_to_project': {
      action_description = `${entity_name} has been added to a project`
      event_name += 'has been added'
      break
    }

    case 'remove_from_project': {
      action_description = `${entity_name} has been removed from a project`
      event_name += 'has been removed'

      break
    }

    case 'archive': {
      action_description = `${entity_name} has been archived`
      event_name += 'has been archived'

      break
    }

    case 'change_owner': {
      action_description = `Owner of ${entity_name} has been changed`
      event_name += 'Owner has been changed'

      break
    }

    case 'close': {
      action_description = `${entity_name} has been closed`
      event_name += 'has been closed'

      break
    }

    case 'create': {
      action_description = `${entity_name} has been created`
      event_name += 'has been created'
      break
    }

    case 'decline_booking': {
      action_description = `Booking ${entity_name} has been declined`
      event_name += 'Booking has been declined'

      break
    }

    case 'delete_share': {
      action_description = `Sharing of ${entity_name} has been removed`
      event_name += 'sharing has been removed'

      break
    }

    case 'disable': {
      action_description = `${entity_name} has been disabled`
      event_name += 'has been disabled'

      break
    }

    case 'disable_chat': {
      action_description = `Chat of ${entity_name} has been disabled`
      event_name += 'Chat has been disabled'

      break
    }

    case 'start_chat': {
      action_description = `Chat of ${entity_name} has been started`
      event_name += 'Chat has been started'

      break
    }

    case 'enable': {
      action_description = `${entity_name} has been enabled`
      event_name += 'has been enabled'

      break
    }

    case 'enable_chat': {
      action_description = `Chat of ${entity_name} has been enabled`
      event_name += 'Chat has been enabled'

      break
    }

    case 'open': {
      action_description = `${entity_name} has been opened`
      event_name += 'has been opened'

      break
    }

    case 'opportunity_assign_provider': {
      action_description = `A provider has been assigned for opportunity ${entity_name}`
      event_name += 'Provider has been assigned for opportunity'

      break
    }

    case 'opportunity_cancel_express_interest': {
      action_description = `An express interest has been canceled for opportunity ${entity_name}`
      event_name += 'Express interest has been created for opportunity'

      break
    }

    case 'opportunity_express_interest': {
      action_description = `An express interest has been created for opportunity ${entity_name}`
      event_name += 'Express interest has been created for opportunity'

      break
    }

    case 'opportunity_unassign_provider': {
      action_description = `A provider has been unassigned for opportunity ${entity_name}`
      event_name += 'Provider has been unassigned for opportunity'

      break
    }

    case 'reschedule': {
      action_description = `${entity_name} has been rescheduled`
      event_name += 'has been rescheduled'

      break
    }

    case 'restore': {
      action_description = `${entity_name} has been restored`
      event_name += 'has been restored'

      break
    }

    case 'trash': {
      action_description = `${entity_name} has been trashed`
      event_name += 'has been trashed'
      break
    }

    case 'update': {
      action_description = `${entity_name} has been updated`
      event_name += 'has been updated'

      break
    }

    case 'upload': {
      action_description = `${entity_name} has been uploaded`
      event_name += 'has been uploaded'
      break
    }

    case 'confirm': {
      action_description = `${entity_name} has been confirmed`
      event_name += 'has been confirmed'
      break
    }

    case 'vote': {
      action_description = `${entity_name} has been Voted`
      event_name += 'has been Voted'
      break
    }

    case 'cancel': {
      action_description = `${entity_name} has been canceled`
      event_name += 'has been canceled'

      break
    }

    case 'decline': {
      action_description = `${entity_name} has been declined`
      event_name += 'has been declined'

      break
    }

    case 'accept': {
      action_description = `${entity_name} has been accepted`
      event_name += 'has been accepted'
      break
    }

    case 'workspace_join': {
      action_description = `${entity_name} has joined to the workspace`
      event_name += 'User has joined to the workspace'
      add_action_maker = false
      break
    }

    case 'workspace_left': {
      action_description = `${entity_name} has left to the workspace`
      event_name += 'User has left to the workspace'
      add_action_maker = false
      break
    }

    case 'invite': {
      action_description = `${entity_name} has been invited to join to the workspace`
      event_name += 'User has been invited to join to the workspace'

      break
    }

    case 'delete': {
      action_description = `${entity_name} has been deleted`
      event_name += 'has been deleted'
      break
    }

    default: {
      break
    }
  }

  if (full_name && add_action_maker) {
    action_description += ` by ${full_name}`
  }

  return {
    description: `[Module action] ${capitalize(module)}: ${action_description || capitalize(action.replace('_', ' '))}`,
    event_name: `${capitalize(module)} ${event_name || capitalize(action.replace('_', ' '))}`,
  }
}

export const createModuleHistoryRecord = async (data: {
  user_id: number
  entity_id: number
  action: HISTORY_ACTION
  module: MODULE_KEY_TYPE
  workspace_id: number
  entity_name: string
  meta?: Record<string, any>
  ctx?: Context
  req?: FastifyRequest
}) => {
  const { ctx } = data
  onSuccessChecker(ctx, async () => {
    const { module, user_id, workspace_id, action, entity_id, entity_name, meta, req } = data
    const repo = getRepo()
    const mixpanel = container.resolve(Mixpanel)

    await repo.moduleHistory.create({
      action,
      entity_id,
      module: {
        connect: {
          key: module,
        },
      },
      user: {
        connect: {
          user_id,
        },
      },
      workspace: {
        connect: {
          workspace_id,
        },
      },
    })

    const user = await repo.user.getForHistory(user_id)
    const workspace = await repo.workspace.getWorkspace(workspace_id)

    const { description, event_name } = eventDescriptionGenerator(action, module, entity_name, user, {
      is_meeting_recurring: meta?.is_recurring_meeting,
      is_meeting_poll: meta?.is_meeting_poll,
      is_instant: meta?.is_instant,
    })

    const event: Mp.Event = {
      event: event_name,
      properties: {
        description,
        user_hash: user!.user_hash,
        workspace_subdomain: workspace!.subdomain,
        entity_id,
        mp_country_code: user?.country?.name,
        meta,
        user: {
          first_name: user?.first_name,
          last_name: user?.last_name,
          nickname: user?.nickname,
          timezone: user?.timezone?.name,
        },
      },
    }

    if (!req) {
      mixpanel.trackBackend(event)
    } else {
      mixpanel.trackByReq(event, req)
    }
  })
}

export const deleteAllModuleHistoryRecords = async (data: { entity_id: number; module: MODULE_KEY_TYPE }) => {
  try {
    const { module, entity_id } = data
    const repo = getRepo()
    const res = await repo.moduleHistory.deleteAllHistory(entity_id, module)
    return res
  } catch (err) {
    logger.error(err)
  }
}
