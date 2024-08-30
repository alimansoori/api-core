import { getConfigs } from '@app/lib/config.validator.js'
// @ts-ignore
import { BucketItem, Client, ClientOptions, UploadedObjectInfo } from 'minio'
import { stat, createReadStream, Stats } from 'fs'
import { Readable } from 'node:stream'
import { singleton } from 'tsyringe'
import { regexPatterns } from '@app/utility/constants/index.js'
import { logger } from '@app/lib/logger.js'
// TODO: This type is no longer available when using esm. We have to create our own
// import { ResultCallback } from 'minio';
type ResultCallback<T> = any
@singleton()
export class StorageService {
  minioClient!: Client
  constructor() {
    const { USING_SSL_MINIO, MINIO_HOST, MINIO_PORT, MINIO_IP, MINIO_USERNAME, MINIO_PASSWORD, IS_MINIO_ENABLED } =
      getConfigs()

    if (IS_MINIO_ENABLED) {
      const minioClintConfig: ClientOptions = {
        endPoint: MINIO_IP ?? MINIO_HOST,
        port: MINIO_PORT,
        useSSL: false,
        accessKey: MINIO_USERNAME,
        secretKey: MINIO_PASSWORD,
      }

      if (USING_SSL_MINIO) {
        minioClintConfig.useSSL = true
      }

      const minioClient = new Client(minioClintConfig)

      this.minioClient = minioClient
    }
  }

  createBucket = async (bucketName: string, region: string) => {
    const fixedName = bucketName.replace(regexPatterns.bucketInvalidCharacters, '.')
    const isBucketExists = await this.checkBucketExistence(fixedName)

    if (!isBucketExists) {
      await this.minioClient.makeBucket(fixedName, region)
      const { MINIO_ENCRYPTION_OFF } = getConfigs()

      if (MINIO_ENCRYPTION_OFF !== false) {
        await this.minioClient.setBucketEncryption(fixedName, {
          Rule: [{ ApplyServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } }],
        })
      }
    }
  }

  checkBucketExistence = (bucketName: string) => {
    return this.minioClient.bucketExists(bucketName)
  }

  ReadAndUpload = async (bucketName: string, objectName: string, file: string) => {
    const fileStream = createReadStream(file)
    const fileStat = await this.checkFileStat(file)
    return this.minioClient.putObject(bucketName, objectName, fileStream, fileStat.size)
  }

  uploadBuffer = async (bucketName: string, objectName: string, buffer: Buffer, size: number) => {
    return this.minioClient.putObject(bucketName, objectName, buffer, size)
  }
  uploadStream = async (bucketName: string, objectName: string, stream: Readable | Buffer, size?: number) => {
    return this.minioClient.putObject(bucketName, objectName, stream, size)
  }

  uploadStreamCallback = async (
    bucketName: string,
    objectName: string,
    stream: Readable,
    cb?: ResultCallback<UploadedObjectInfo>,
  ) => {
    return this.minioClient.putObject(bucketName, objectName, stream, cb)
  }

  checkFileStat = (filePath: string): Promise<Stats> => {
    return new Promise((resolve, reject) => {
      stat(filePath, (err, stats) => {
        if (err) reject(err)
        resolve(stats)
      })
    })
  }

  deleteFile = (bucketName: string, objectName: string) => {
    return this.minioClient.removeObject(bucketName, objectName)
  }

  checkFileExistence = (bucketName: string, objectName: string) => {
    return this.minioClient.statObject(bucketName, objectName)
  }

  createPostPolicy = (bucketName: string, MIME: string) => {
    const policy = this.minioClient.newPostPolicy()
    policy.setBucket(bucketName)
    policy.setContentType(MIME)
  }

  readFileStream = async (bucketName: string, objectName: string): Promise<Readable | false> => {
    return this.minioClient.getObject(bucketName, objectName).catch((err) => {
      return false
    })
  }

  readPartialStream = async (
    bucketName: string,
    objectName: string,
    offset: number,
    length?: number,
  ): Promise<Readable | null> => {
    return this.minioClient.getPartialObject(bucketName, objectName, offset, length).catch((err) => {
      logger.error(err)
      return null
    })
  }

  statObject = async (bucketName: string, objectName: string) => {
    return this.minioClient.statObject(bucketName, objectName)
  }

  BulkRemove = (bucketName: string, objectNames: string[]) => {
    return this.minioClient.removeObjects(bucketName, objectNames)
  }

  listBuckets = () => {
    return this.minioClient.listBuckets()
  }

  listObjects = async (bucketName: string) => {
    const stream = this.minioClient.listObjects(bucketName, undefined, true)
    const data: BucketItem[] = []
    stream.on('data', function (obj) {
      data.push(obj)
    })

    return new Promise<BucketItem[]>((resolve, reject) => {
      stream.on('end', function () {
        resolve(data)
      })
      stream.on('error', function (err) {
        reject(err)
      })
    })
  }

  removeBucket = async (bucketName: string) => {
    const allObjects = await this.listObjects(bucketName)
    const objectNames: string[] = []

    for (const object of allObjects) {
      if (object.name) {
        objectNames.push(object.name)
      }
    }

    await this.BulkRemove(bucketName, objectNames)
    await this.minioClient.removeBucket(bucketName)
  }
}
