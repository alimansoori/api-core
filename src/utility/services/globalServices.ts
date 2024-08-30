import RocketchatApi from '@app/lib/integrations/rocketchat/rocketchatApi.js'
import { StorageService } from '@app/lib/storage/storage.service.js'
import { container } from 'tsyringe'

type Service = {
  storage: StorageService
  rocketchatApi: RocketchatApi
  is_resolved: boolean
}
const serviceRegistry: Partial<Service> = { is_resolved: false }

export const initService = (): Service => {
  if (serviceRegistry.is_resolved) return serviceRegistry as Service
  serviceRegistry.storage = container.resolve(StorageService)
  serviceRegistry.rocketchatApi = container.resolve(RocketchatApi)
  serviceRegistry.is_resolved = true
  return serviceRegistry as Service
}

export const getService = (): Service => {
  return serviceRegistry as Service
}
