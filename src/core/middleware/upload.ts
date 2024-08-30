import { enumToArray } from '@app/utility/helpers/index.js'
import { EMimeDB, mimeDB, TMimeDB } from '@app/utility/constants/mimeDB.js'
import { FastifyRequest, preHandlerAsyncHookHandler } from 'fastify'
import { generateError } from '@app/core/error/errorGenerator.js'

interface IUploadMiddlewareParams {
  allowedFileTypes: TMimeDB[]
  forbiddenMimes?: string[]
}

export function uploadMiddleware(options: IUploadMiddlewareParams): preHandlerAsyncHookHandler {
  return async (req, res) => {
    const contentType = req.headers['content-type']?.split(';')
    if (!req.body) req.body = {}

    if (contentType && contentType[0] !== 'multipart/form-data') {
      return
    }

    const files = await req.file()

    if (!files) {
      return
    }

    const isAcceptable = checkMimeTypeOfFile(files.mimetype, options)
    if (!isAcceptable) throw generateError([{ message: 'file type is not valid' }], 'FORBIDDEN')

    const fields: any = files.fields

    for (const fieldName in fields) {
      if (!fields[fieldName].file && fieldName === 'data') {
        appendDataToReq(req as any, fields['data'])
      }
    }

    req.uploadedFiles = files
  }
}

function checkMimeTypeOfFile(mimeFile: string, options: { allowedFileTypes: TMimeDB[]; forbiddenMimes?: string[] }) {
  const forbiddenMimes = options.forbiddenMimes?.length ? options.forbiddenMimes : []
  const allowedFileTypes: TMimeDB[] = options.allowedFileTypes.length ? options.allowedFileTypes : enumToArray(EMimeDB)
  let isAccepted = false

  for (const mime of allowedFileTypes) {
    isAccepted = !!mimeDB[mime].find((i) => {
      return mimeFile === i.mime && !forbiddenMimes.includes(mimeFile)
    })

    if (isAccepted) break
  }

  return isAccepted
}

function appendDataToReq(req: FastifyRequest<{ Body: Record<string, any> }>, data: any) {
  req.body = req.body || {}
  if (!data) return

  if (typeof data?.value === 'string') {
    try {
      const parsedData = JSON.parse(data?.value)
      if (parsedData && typeof parsedData === 'object') req.body = { ...req.body, ...parsedData }
    } catch (err) {
      throw generateError([{ message: 'Bad request format. data must be json type' }], 'BAD_REQUEST')
    }
  }
}
