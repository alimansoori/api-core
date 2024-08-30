import { IFileResponseModel, PERMISSION } from '../app/index.js'
import { service } from '../backend.js'

export type IGetServiceByIdQueryResult = service & {
  cover: IFileResponseModel
  logo: IFileResponseModel
}

export enum SERVICE_SCOPE {
  enabled = 'enabled',
  disabled = 'disabled',
  draft = 'draft',
  mine = 'mine',
  others = 'others',
}

export type IServicePermissions =
  | PERMISSION.Admin
  | PERMISSION.Owner
  | PERMISSION.NoAccess
  | PERMISSION.Collaborator
  | PERMISSION.Viewer
