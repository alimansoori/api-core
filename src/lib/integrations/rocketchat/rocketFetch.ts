import { getConfigs } from '@app/lib/config.validator.js'
import { fetchRequest } from '@app/lib/fetch.js'
import { logger } from '@app/lib/logger.js'

type IRocketPaths =
  | 'channels.create'
  | 'groups.create'
  | 'users.createToken'
  | 'users.create'
  | 'users.list'
  | 'users.info'
  | 'groups.delete'
  | 'channels.delete'
  | 'users.delete'
  | 'subscriptions.get'
  | 'rooms.get'
  | 'rooms.info'
  | 'users.setAvatar'
  | 'users.resetAvatar'
  | 'groups.invite'
  | 'rooms.saveRoomSettings'
  | 'rooms.changeArchivationState'
  | 'users.update'
  | 'users.setPreferences'
  | 'groups.kick'
  | 'groups.rename'
  | 'method.call/createDirectMessage'
  | 'groups.addOwner'
  | 'groups.removeOwner'
  | 'users.getStatus'

export const fetchRequestRocket = async <T, R>(
  method: 'GET' | 'POST',
  url: IRocketPaths,
  data: T | null = null,
  server_data?: {
    user_id?: string | null
    token?: string
  },
) => {
  const { CHAT_SERVER_URL, CHAT_SERVER_ADMIN_ID, CHAT_SERVER_ADMIN_TOKEN } = getConfigs()

  try {
    const result = await fetchRequest<T, R>(method, CHAT_SERVER_URL + '/api/v1/' + url, data, {
      'X-Auth-Token': server_data?.token ?? CHAT_SERVER_ADMIN_TOKEN,
      'X-User-Id': server_data?.user_id ?? CHAT_SERVER_ADMIN_ID,
    })
    return result
  } catch (err) {
    logger.error(err)
    throw err
  }
}
