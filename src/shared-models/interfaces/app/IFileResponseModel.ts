export type IFileResponseModel = {
  full_path: string
  alt: string
  file_id?: number
} | null

export type ILogoFileResponseModel = {
  full_path: string
  alt: string
  file_id?: number
  is_default: boolean
} | null

export type IPrivateFileModel = {
  full_path: string
  alt: string
  private_file_id: number
  private_file_hash: string
  is_starred: boolean | null
  is_trashed: boolean
  trashed_at: string | null
  name: string
  mime: string | null
  size: number
  created_by: {
    first_name: string
    last_name: string
    nickname?: string | null
    user_hash: string
  }
  created_at: string
  updated_at?: string
}

export type IFolderItem = {
  folder_hash: string
  name: string
  is_starred: boolean | null
  is_trashed?: boolean
  created_by?: {
    first_name: string
    last_name: string
    nickname?: string | null
    user_hash: string
  } | null
  created_at: string
  updated_at: string
  trashed_at?: string | null
}

export type IFolderModel = {
  this_folder: IFolderItem
  parent_folder?: {
    folder_hash: string
    name: string
  }
  child_folders: IFolderItem[]
}

export type IPrivateFolderOptions = IFolderModel | {}

export type IPrivateFileModelResponse<T extends IPrivateFolderOptions = {}> = IPrivateFileModel & T

export const ALLOWABLE_FILE_MIME = [
  /^image\/.*/,
  /^video\/.*/,
  /^audio\/.*/,
  'text/plain',
  'application/rtf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
  'application/zip',
  'application/vnd.rar',
  'application/x-rar-compressed',
  'application/gzip',
  'application/x-7z-compressed',
  'application/x-tar',
  'text/html',
  'text/css',
  '	text/javascript',
  'application/json',
  'application/xml',
  'text/xml',
  'csv',
  'text/markdown',
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',
  'application/x-httpd-php',
  'application/x-python-code',
  'text/x-python',
  'image/vnd.adobe.photoshop',
  'application/postscript',
]
