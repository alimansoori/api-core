import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { logger } from '@app/lib/logger.js'
import { IFileResponseModel, Routes } from '@app/shared-models/index.js'
import { regexPatterns } from '@app/utility/constants/index.js'
import { existsSync, statSync, unlinkSync } from 'fs'
import path from 'path'

export const getFileInfo = (path: string) => {
  const info = statSync(path)
  return {
    size: Number((info.size / 1024).toFixed(2)),
  }
}

export const removeFsFile = (path: string): void => {
  try {
    const isExist = existsSync(path)
    if (isExist) unlinkSync(path)
  } catch (error) {
    logger.error(error)
  }
}

export const removeFile = async (file_id: number, path: string) => {
  const repo = getRepo()
  removeFsFile(path)
  await repo.file.removeById(file_id)
}

// export const getUploadPath = (base: IUploadDirType, data: { user_id: number; workspace_id?: number }) => {
//   const { UPLOAD_PATH, UNICLIENT_USERS_PATH } = getConfigs();
//   const { user_id, workspace_id } = data;
//   if (!user_id) throw new Error('user_id is required');

//   const path: { relative: string; absolute: string } = {
//     absolute: '',
//     relative: '',
//   };

//   if (base === 'workspace') {
//     path.relative = `${UNICLIENT_USERS_PATH}/${user_id}/workspace/${workspace_id}`;
//   } else {
//     path.relative = `${UNICLIENT_USERS_PATH}/${user_id}`;
//   }

//   path.absolute = `${UPLOAD_PATH}/${path.relative}`;
//   const existed = existsSync(path.absolute);
//   if (!existed) mkdirSync(path.absolute, { recursive: true });

//   return path;
// };

export function combineNameAndPathForImages(
  file?: { name: string; file_hash: string; file_id?: number } | null,
  includeFileId?: boolean,
  thumbnail?: boolean,
): IFileResponseModel {
  const { BASE_PUBLIC_PATH } = getConfigs()
  if (!file) return null
  const validName = file.name.replace(regexPatterns.download_file_special_character_replace, '_')

  const model: { full_path: string; alt: string; file_id?: number } = {
    full_path: `/${BASE_PUBLIC_PATH}/${validName}?file_hash=${file.file_hash}`,
    alt: file.name,
    file_id: file.file_id,
  }
  if (includeFileId && file?.file_id) model.file_id = file.file_id

  if (thumbnail) {
    model.full_path += '&thumbnail=true'
  }

  return model
}

export function combineNameAndPathForPrivateFile(
  private_file_hash: string,
  name: string,
  subdomain: string,
  custom_domain?: string | null,
): string {
  const validName = name.replace(regexPatterns.download_file_special_character_replace, '_')
  // return `https://${custom_domain ?? sub_domain + FRONT_SERVER_ADDRESS}

  const url = `${Routes.FILE}/${validName}?file_hash=${private_file_hash}`

  return url
}

export function parseFileName(name: string) {
  return path.parse(name)
}
