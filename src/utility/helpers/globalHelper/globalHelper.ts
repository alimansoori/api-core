
type Helper = {
  is_resolved: boolean
}
const helperRegistry: Partial<Helper> = { is_resolved: false }

export const initHelpers = (): Helper => {
  if (helperRegistry.is_resolved) return helperRegistry as Helper
  console.log('resolved more than once')

  helperRegistry.is_resolved = true
  return helperRegistry as Helper
}

export const getHelper = (): Helper => {
  return helperRegistry as Helper
}
