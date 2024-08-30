import { IChannelsCreateReq, IChannelsCreateRes } from '@app/lib/integrations/rocketchat/interfaces/channels.create.js'
import { IGroupsCreateReq, IGroupsCreateRes } from '@app/lib/integrations/rocketchat/interfaces/groups.create.js'
import { IGroupsDeleteReq, IGroupsDeleteRes } from '@app/lib/integrations/rocketchat/interfaces/groups.delete.js'
import { IUsersCreateReq, IUsersCreateRes } from '@app/lib/integrations/rocketchat/interfaces/users.create.js'
import {
  IUsersCreateTokenReq,
  IUsersCreateTokenRes,
} from '@app/lib/integrations/rocketchat/interfaces/users.createToken.js'
import { IUsersDeleteReq, IUsersDeleteRes } from '@app/lib/integrations/rocketchat/interfaces/users.delete.js'
import { IRocketChatUserRoles } from '@app/shared-models/interfaces/app/IRocketChatUserRoles.js'
import { nanoid } from 'nanoid'
import { singleton } from 'tsyringe'
import { IRocketChatGetRoomsReq, IRocketChatGetRoomsRes } from './interfaces/rooms.get.js'
import { IRocketChatGetSubscriptionsReq, IRocketChatGetSubscriptionsRes } from './interfaces/subscriptions.get.js'
import { fetchRequestRocket } from './rocketFetch.js'
import { logger } from '@app/lib/logger.js'
import {
  IRocketchatBaseResponse,
  updateUserInfoReq,
} from '@app/lib/integrations/rocketchat/interfaces/IRocketchatBaseResponse.js'
import { generateError } from '@app/core/error/errorGenerator.js'
import { regexPatterns } from '@app/utility/constants/index.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { Context } from '@app/interfaces/index.js'
import { IGroupsEditRes } from '@app/lib/integrations/rocketchat/interfaces/groups.edit.js'

import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'
import { getService } from '@app/utility/services/globalServices.js'

@singleton()
export default class RocketchatApi {
  private repo = getRepo()
  private service = getService()

  public createChannel = async (name: string, members: any[]) => {
    const res = await fetchRequestRocket<IChannelsCreateReq, IChannelsCreateRes>('POST', 'channels.create', {
      name: name + '.' + nanoid(5),
      members,
    })
    return res
  }

  public createGroup = async (
    name: string,
    { types, id }: { types: 'meeting' | 'breakoutroom' | 'workspace'; id: string | number },
    members_usernames: string[],
    owner_chat_id: string,
    workspace_user_id: number,
  ) => {
    const RocketTokenOfCreator = await this.createToken(owner_chat_id, workspace_user_id)

    name = name ? name + '.' + 'alimansoori71-' + nanoid(5) + '-uni' : nanoid(5)
    const res = await fetchRequestRocket<IGroupsCreateReq, IGroupsCreateRes>(
      'POST',
      'groups.create',
      {
        name,
        members: members_usernames,
        customFields: {
          entity: {
            types,
            id,
          },
        },
      },
      {
        user_id: owner_chat_id,
        token: RocketTokenOfCreator.body?.data.authToken,
      },
    )
    return res
  }

  public createToken = async (userId: string, workspace_user_id: number, jti?: string) => {
    try {
      const res = await fetchRequestRocket<IUsersCreateTokenReq, IUsersCreateTokenRes>('POST', 'users.createToken', {
        userId,
      })

      if (jti) {
        const token = await this.repo.rocketChat.getUserLatestToken(userId)

        if (token) {
          const session = await this.repo.settings.getSessionByJti(jti)

          if (session) {
            const rocketchat_tokens = await this.repo.rocketchatToken.getWorkspaceRocketchatTokenByJti(
              session.jti,
              workspace_user_id,
            )

            for (const item of rocketchat_tokens) {
              if (item.workspace_user.chat_user_id) {
                this.repo.rocketChat.deleteUserToken(item.workspace_user.chat_user_id, item.token)
              }
            }

            await this.repo.rocketchatToken.removeTokenByJti(session.jti)
            await this.repo.rocketchatToken.createTokenRecord(workspace_user_id, token.hashedToken, session.session_id)
          }
        }
      }

      return res
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  public isExistUser = async (username: string) => {
    const res = await fetchRequestRocket<any, any>('GET', 'users.list', {
      query: JSON.stringify({ $or: [{ username }] }),
    })
    return res
  }

  public getUserInfo = async (userId: string) => {
    const res = await fetchRequestRocket<any, IUsersCreateRes>('GET', 'users.info', { userId })
    return res
  }

  public createUser = async (
    email: string,
    password: string,
    name: string,
    username: string,
    nickname: string | null,
    user_id: number,
    workspace_id: number,
    roles: IRocketChatUserRoles = ['user'],
  ) => {
    try {
      const res = await fetchRequestRocket<IUsersCreateReq, IUsersCreateRes>('POST', 'users.create', {
        email,
        password,
        name: nickname || name,
        roles,
        nickname,
        username,
        verified: true,
        joinDefaultChannels: false,
        sendWelcomeEmail: false,
        customFields: {
          entity: {
            types: 'user',
            id: user_id,
          },
          workspace_id,
        },
      })

      return res
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  public removeUserByUsername = async (username: string) => {
    const res = await fetchRequestRocket<IUsersDeleteReq, IUsersDeleteRes>('POST', 'users.delete', {
      username,
      confirmRelinquish: true,
    })
    return res
  }

  public removeUserByUserId = async (userId: string) => {
    const res = await fetchRequestRocket<IUsersDeleteReq, IUsersDeleteRes>('POST', 'users.delete', {
      userId,
      confirmRelinquish: true,
    })
    return res
  }

  public removeGroup = async (roomId: string, user_id?: string | null, workspace_user_id?: number) => {
    let RocketTokenOfCreator:
      | {
          body: IUsersCreateTokenRes | null
          status: number
        }
      | undefined

    if (user_id && workspace_user_id) {
      RocketTokenOfCreator = await this.createToken(user_id, workspace_user_id)
    }

    return fetchRequestRocket<IGroupsDeleteReq, IGroupsDeleteRes>(
      'POST',
      'groups.delete',
      { roomId },
      {
        token: RocketTokenOfCreator?.body?.data.authToken,
        user_id,
      },
    ).then((data) => {
      if (data?.body) {
        return data.body.success
      }
    })
  }

  public getRooms = async () => {
    const res = await fetchRequestRocket<IRocketChatGetRoomsReq, IRocketChatGetRoomsRes>('GET', 'rooms.get', {})
    return res
  }

  public getRoomInfo = async (room_id: string) => {
    const res = await fetchRequestRocket<any, any>('GET', 'rooms.info', { query: JSON.stringify({ $or: [{ room_id }] }) })
    return res
  }

  public getSubscriptions = async () => {
    const res = await fetchRequestRocket<IRocketChatGetSubscriptionsReq, IRocketChatGetSubscriptionsRes>(
      'GET',
      'subscriptions.get',
      {},
    )
    return res
  }

  // setAvatar = async (userId: string, avatarUrl: string) => {
  //   return fetchRequestRocket('POST', 'users.setAvatar', { userId, avatarUrl })
  //     .catch((err) => {
  //       logger.error(err);
  //     })
  //     .then((data) => {
  //       if (isProduction() || isStaging()) logger.info(data);
  //     });
  // };

  // resetAvatar = async (userId: string) => {
  //   return fetchRequestRocket('POST', 'users.resetAvatar', { userId })
  //     .catch((err) => {
  //       logger.error(err);
  //     })
  //     .then((data) => {
  //       if (isProduction() || isStaging()) logger.info(data);
  //     });
  // };

  setRoomAvatar = async (
    url: string,
    workspace_id: number,
    file?: { path: string; file_hash: string; name: string; workspace_id: number | null } | null,
    ctx?: Context,
  ) => {
    const repo = getRepo()
    const helper = getHelper()

    const workspace = await this.repo.workspace.get(workspace_id)

    if (workspace) {
      const meeting = await repo.meeting.getUniqueMeetingByURL(url, workspace_id, ctx)

      if (meeting?.chat_id) {
        if (file) {
          const filePath = helper.file.getUserFilePath({
            hash: file.file_hash,
            path: file.path,
          })
          const { PUBLIC_STORAGE_NAME } = getConfigs()

          let storageBucketName = PUBLIC_STORAGE_NAME

          if (file.workspace_id) {
            if (workspace.storage_bucket[0].name) {
              storageBucketName = workspace.storage_bucket[0].name
            }
          }

          const readStream = await this.service.storage.readFileStream(storageBucketName, filePath)

          if (!readStream) {
            throw generateError([{ message: 'File not found' }], 'NOT_FOUND')
          }

          const chunks: any[] = []

          readStream.on('data', (chunk) => {
            chunks.push(chunk)
          })

          readStream.on('end', () => {
            const buf = Buffer.concat(chunks)
            const base64Image = buf.toString('base64')
            const splittedName = file.name.split('.')
            const format = splittedName.at(-1)
            return fetchRequestRocket(
              'POST',
              'rooms.saveRoomSettings',
              { rid: meeting.chat_id, roomAvatar: file ? `data:image/${format};base64,${base64Image}` : null }, // null for removing image
            )
          })
        }
      }
    }
  }

  inviteUserToPrivateGroup = async (
    userId: string,
    roomId: string,
    owner_chat_id?: string | null,
    workspace_user_id?: number,
  ) => {
    let RocketTokenOfCreator:
      | {
          body: IUsersCreateTokenRes | null
          status: number
        }
      | undefined

    if (owner_chat_id && workspace_user_id) {
      RocketTokenOfCreator = await this.createToken(owner_chat_id, workspace_user_id)
    }

    return fetchRequestRocket<any, any>(
      'POST',
      'groups.invite',
      { roomId, userId },
      {
        token: RocketTokenOfCreator?.body?.data.authToken,
        user_id: owner_chat_id,
      },
    )
  }

  enableChat = (rid: string) => {
    return fetchRequestRocket<{}, IRocketchatBaseResponse>('POST', 'rooms.changeArchivationState', {
      rid,
      action: 'unarchive',
    })
      .then((data) => {
        if (data?.body) {
          return data.body.success
        }
      })
      .catch(() => {
        return false
      })
  }

  disableChat = (rid: string) => {
    return fetchRequestRocket<{}, IRocketchatBaseResponse>('POST', 'rooms.changeArchivationState', {
      rid,
      action: 'archive',
    })
      .then((data) => {
        if (data?.body) {
          return data.body.success
        }
      })
      .catch(() => {
        return false
      })
  }

  updateUserInfo = async (userId: string, data: updateUserInfoReq['data']) => {
    const res = await fetchRequestRocket<updateUserInfoReq, IRocketchatBaseResponse>('POST', 'users.update', {
      userId,
      data,
    })
      .then((data) => {
        if (data?.body) {
          return data.body.success
        } else {
          return false
        }
      })
      .catch(() => {
        return false
      })

    if (res && data?.username) {
      await this.repo.workspace.updateChatUserName(userId, data?.username)
    }
  }

  updateUserPreference = (userId: string, language: string) => {
    if (!language.match(regexPatterns.rocketChatLanguage)) {
      throw generateError([{ message: 'Language format is not valid.' }], 'FORBIDDEN')
    }

    return fetchRequestRocket<{}, IRocketchatBaseResponse>('POST', 'users.setPreferences', {
      userId,
      data: {
        language,
      },
    })
      .then((data) => {
        if (data?.body) {
          return data.body.success
        }
      })
      .catch(() => {
        return false
      })
  }

  kickUserFromGroup = async (
    roomId: string,
    userId: string,
    owner_chat_id?: string | null,
    workspace_user_id?: number,
  ) => {
    let RocketTokenOfCreator: AwaitedReturn<RocketchatApi['createToken']> | undefined

    if (owner_chat_id && workspace_user_id) {
      RocketTokenOfCreator = await this.createToken(owner_chat_id, workspace_user_id)
    }

    return fetchRequestRocket<{ userId: string; roomId: string }, IRocketchatBaseResponse>(
      'POST',
      'groups.kick',
      {
        roomId,
        userId,
      },
      {
        token: RocketTokenOfCreator?.body?.data.authToken,
        user_id: owner_chat_id,
      },
    )
  }

  renameGroup = async (roomId: string, name: string, owner_chat_id?: string | null, workspace_user_id?: number) => {
    let RocketTokenOfCreator:
      | {
          body: IUsersCreateTokenRes | null
          status: number
        }
      | undefined

    if (owner_chat_id && workspace_user_id) {
      RocketTokenOfCreator = await this.createToken(owner_chat_id, workspace_user_id)
    }

    const newName = name + '.' + 'alimansoori71-' + nanoid(5) + '-uni'

    return fetchRequestRocket<{ name: string; roomId: string }, IGroupsEditRes>(
      'POST',
      'groups.rename',
      {
        roomId,
        name: newName,
      },
      {
        token: RocketTokenOfCreator?.body?.data.authToken,
        user_id: owner_chat_id,
      },
    ).catch((data) => {
      return data
    })
  }

  createDirectMessage = async (src_user_id: string, src_workspace_user_id: number, target_user_name: string) => {
    let rcTokenForSrcUser:
      | {
          body: IUsersCreateTokenRes | null
          status: number
        }
      | undefined

    if (src_user_id && src_workspace_user_id) {
      rcTokenForSrcUser = await this.createToken(src_user_id, src_workspace_user_id)
    }

    if (rcTokenForSrcUser?.body?.data) {
      const res = await fetchRequestRocket<{}, { message: string }>(
        'POST',
        'method.call/createDirectMessage',
        {
          message: JSON.stringify({
            msg: 'method',
            id: 21,
            method: 'createDirectMessage',
            params: [target_user_name],
          }),
        },
        {
          token: rcTokenForSrcUser?.body?.data.authToken,
          user_id: rcTokenForSrcUser?.body?.data.userId,
        },
      )

      if (res.body) {
        const response = JSON.parse(res.body.message) as { result: { rid: string } }

        if (!response.result.rid) {
          throw generateError([{ message: 'Cannot create chat. Try again later.' }], 'INTERNAL_SERVER_ERROR')
        }

        return response
      } else {
        throw generateError([{ message: 'Something went wrong' }], 'INTERNAL_SERVER_ERROR')
      }
    } else {
      throw generateError([{ message: 'Something went wrong while creating direct message' }], 'INTERNAL_SERVER_ERROR')
    }
  }

  setUserAsOwner = async (
    room_id: string,
    previous_owner_id: string,
    previous_owner_workspace_id: number,
    new_owner_id: string,
  ) => {
    const rcTokenForSrcUser = await this.createToken(previous_owner_id, previous_owner_workspace_id)

    if (rcTokenForSrcUser?.body?.data) {
      const res = await fetchRequestRocket<
        { roomId: string; userId: string },
        {
          success: true
        }
      >(
        'POST',
        'groups.addOwner',
        {
          roomId: room_id,
          userId: new_owner_id,
        },
        {
          token: rcTokenForSrcUser?.body?.data.authToken,
          user_id: rcTokenForSrcUser?.body?.data.userId,
        },
      )

      if (res.body?.success) {
        await fetchRequestRocket<
          { roomId: string; userId: string },
          {
            success: true
          }
        >(
          'POST',
          'groups.removeOwner',
          {
            roomId: room_id,
            userId: previous_owner_id,
          },
          {
            token: rcTokenForSrcUser?.body?.data.authToken,
            user_id: rcTokenForSrcUser?.body?.data.userId,
          },
        )
      } else {
        throw generateError(
          [{ message: 'Something went wrong while transferring chat  ownership.' }],
          'INTERNAL_SERVER_ERROR',
        )
      }
    } else {
      throw generateError([{ message: 'Something went wrong while creating direct message' }], 'INTERNAL_SERVER_ERROR')
    }
  }

  getUserStatus = async (user_id: string) => {
    return fetchRequestRocket<
      { userId: string },
      {
        message: string
        connectionStatus: string
        status: string
        success: boolean
      }
    >('GET', 'users.getStatus', {
      userId: user_id,
    })
  }

  setGuestUserAsMember = (target_user_id: string) => {
    return fetchRequestRocket<{}, IRocketchatBaseResponse>('POST', 'users.update', {
      userId: target_user_id,
      data: {
        roles: ['user'],
      },
    })
      .then((data) => {
        if (data?.body) {
          return data.body.success
        }
      })
      .catch(() => {
        return false
      })
  }
}
