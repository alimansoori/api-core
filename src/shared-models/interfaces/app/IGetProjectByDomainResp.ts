import { console_project_module, module } from '../backend.js'

export type IGetProjectByDomainResp = {
  domain: string
  console_project_id: number
  name: string
  project_modules: (console_project_module & {
    module: module
  })[]
  logomark_file: {
    name: string
    path: string
    file_hash: string
  } | null
  logomark_dark_file: {
    name: string
    path: string
    file_hash: string
  } | null
  logotype_file: {
    name: string
    path: string
    file_hash: string
  } | null
  logotype_dark_file: {
    name: string
    path: string
    file_hash: string
  } | null
}
