
type Repo = {
}

let repositoryRegistry: Repo | undefined

export const getRepo = (): Repo => {
  if (repositoryRegistry) return repositoryRegistry
  repositoryRegistry = {
  }
  return repositoryRegistry
}
