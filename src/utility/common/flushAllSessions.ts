import { getRepo } from '@app/database/entities/repositoryRegistry.js'

export const flushAllUserSessions = async (user_id: number) => {
  const repo = getRepo()

  const sessions = await repo.settings.getUserSessions(user_id)

  const sessionsJti = sessions.map((i) => i.session.jti)
  const rocketchat_tokens = await repo.rocketchatToken.getRocketchatTokenByJtiBatch(sessionsJti)

  await repo.user.deleteActiveSessionsBatch(sessionsJti)

  rocketchat_tokens.forEach((token) => {
    if (token.workspace_user.chat_user_id) {
      repo.rocketChat.deleteUserToken(token.workspace_user.chat_user_id, token.token)
    }
  })
}
