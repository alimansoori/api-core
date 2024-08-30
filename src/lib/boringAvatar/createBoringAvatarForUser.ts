import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { Context } from '@app/interfaces'
import { getConfigs } from '@app/lib/config.validator.js'
import { fetchRequest } from '@app/lib/fetch.js'
import { logger } from '@app/lib/logger.js'
import { StorageService } from '@app/lib/storage/storage.service.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'
import sharp from 'sharp'
import { container } from 'tsyringe'

export const createBoringAvatar = async (user_id: number, user_hash: string, ctx?: Context) => {
  const res = await fetchRequest<{}, string>(
    'GET',
    `https://avatar.coffee.xyz/beam/512/${user_hash}?colors=FF99C4,9CD1F2,FF3389,65D7A1,F0AF62&square`,
    {},
  )
  const svg = res.body

  if (svg) {
    const storageService = container.resolve(StorageService)

    const repo = getRepo()
    const helper = getHelper()

    const { PUBLIC_STORAGE_NAME } = getConfigs()

    const pngBuffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer()

    const fileData = helper.file.createUserFileData(user_id, `${user_hash}.png`, 'image/png', pngBuffer.byteLength, true)

    const minioResponse = await storageService.uploadBuffer(
      PUBLIC_STORAGE_NAME,
      fileData.minio_path,
      pngBuffer,
      pngBuffer.byteLength,
    )

    if (minioResponse.etag) {
      const file = await repo.file.create(
        {
          file_hash: fileData.hash,
          name: fileData.name,
          path: fileData.path,
          user_id,
          size: fileData.size * 8,
          mime: fileData.MIME,
        },
        ctx,
      )

      return file
    }
  }
}

export const seedBoringAvatar = async () => {
  const repo = getRepo()
  const users = await repo.user.getAllUsersByQuery({
    avatar_file_id: null,
  })

  for (const user of users) {
    logger.warning(`Later Create boring avatar for user createBoringAvatarForUser.ts:63`)
    /* const res = await createBoringAvatar(user.user_id, user.user_hash)

    if (res?.file_id) {
      await repo.user.updateByID(user.user_id, { avatar_file_id: res.file_id })
      logger.log('Boring avatar created for user ' + user.user_id)
    } else {
      logger.error('Creating boring avatar failed for user ' + user.user_id)
    } */
  }
}
