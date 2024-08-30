import { getRepo } from '@app/database/entities/repositoryRegistry.js'

export const getDefaultImageModule = async (user_id: number, module_id: number, workspace_id: number) => {
  const repo = getRepo()

  return repo.header.getDefaultModuleHeaders(user_id, module_id, workspace_id)
}
