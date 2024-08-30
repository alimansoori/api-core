import { IFileResponseModel } from '@app/shared-models/index.js'
import { combineNameAndPathForImages } from '@app/utility/helpers/index.js'
import { file, workspace_type } from '@prisma/client'
import { injectable } from 'tsyringe'
type logo_file = {
  name: string
  file_id: number
  file_hash: string
  path: string
}
type workspace_for_logo = {
  appearance?: {
    logomark_file: logo_file | null
    logomark_dark_file: logo_file | null
    logotype_file: logo_file | null
    logotype_dark_file: logo_file | null
  } | null
  workspace_type?: {
    logomark_file: logo_file | null
    logomark_dark_file: logo_file | null
    logotype_file: logo_file | null
    logotype_dark_file: logo_file | null
  } | null
}
@injectable()
export class Logos {
  public getWorkspaceLogosWithDefault(
    workspace?: workspace_for_logo,
    workspace_type?:
      | (workspace_type & {
          logomark_file: file | null
          logomark_dark_file: file | null
          logotype_file: file | null
          logotype_dark_file: file | null
        })
      | null,
  ) {
    const response: {
      logomark: (IFileResponseModel & { is_default: boolean }) | null
      logomark_dark: (IFileResponseModel & { is_default: boolean }) | null
      logotype: (IFileResponseModel & { is_default: boolean }) | null
      logotype_dark: (IFileResponseModel & { is_default: boolean }) | null
    } = { logomark: null, logomark_dark: null, logotype: null, logotype_dark: null }

    if (!workspace) {
      const logomark = combineNameAndPathForImages(workspace_type?.logomark_file)
      response.logomark = logomark ? { ...logomark, is_default: true } : null
      const logomark_dark = combineNameAndPathForImages(workspace_type?.logomark_dark_file)
      response.logomark_dark = logomark_dark ? { ...logomark_dark, is_default: true } : null
      const logotype = combineNameAndPathForImages(workspace_type?.logotype_file)
      response.logotype = logotype ? { ...logotype, is_default: true } : null
      const logotype_dark = combineNameAndPathForImages(workspace_type?.logotype_dark_file)
      response.logotype_dark = logotype_dark ? { ...logotype_dark, is_default: true } : null
    } else {
      if (workspace.appearance?.logomark_file) {
        const file = combineNameAndPathForImages(workspace.appearance?.logomark_file)
        response.logomark = file ? { ...file, is_default: false } : null
      } else {
        const file = combineNameAndPathForImages(workspace.workspace_type?.logomark_file)
        response.logomark = file ? { ...file, is_default: true } : null
      }

      if (workspace.appearance?.logomark_dark_file) {
        const file = combineNameAndPathForImages(workspace.appearance?.logomark_dark_file)
        response.logomark_dark = file ? { ...file, is_default: false } : null
      } else {
        const file = combineNameAndPathForImages(workspace.workspace_type?.logomark_dark_file)
        response.logomark_dark = file ? { ...file, is_default: true } : null
      }

      if (workspace.appearance?.logotype_file) {
        const file = combineNameAndPathForImages(workspace.appearance?.logotype_file)
        response.logotype = file ? { ...file, is_default: false } : null
      } else {
        const file = combineNameAndPathForImages(workspace.workspace_type?.logotype_file)
        response.logotype = file ? { ...file, is_default: true } : null
      }

      if (workspace.appearance?.logotype_dark_file) {
        const file = combineNameAndPathForImages(workspace.appearance?.logotype_dark_file)
        response.logotype_dark = file ? { ...file, is_default: false } : null
      } else {
        const file = combineNameAndPathForImages(workspace?.workspace_type?.logotype_dark_file)
        response.logotype_dark = file ? { ...file, is_default: true } : null
      }
    }

    return response
  }
}
