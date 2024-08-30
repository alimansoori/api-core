import { getRepo } from '@app/database/entities/repositoryRegistry.js'

export const checkJobPosition = async (name: string) => {
  const repo = getRepo()
  const company = await repo.jobPosition.findJobPositionByName(name)

  if (company) {
    return company
  }

  return repo.jobPosition.createJobPosition(name)
}

export const checkCompany = async (name: string) => {
  const repo = getRepo()

  const company = await repo.company.findCompanyByName(name)

  if (company) {
    return company
  }

  return repo.company.createCompany(name)
}
