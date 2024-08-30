import { getRepo } from '@app/database/entities/repositoryRegistry.js'

export const getTimezoneByTimezoneId = (timezone_id: number) => {
  const repo = getRepo()
  return repo.timezone.findById(timezone_id)
}
