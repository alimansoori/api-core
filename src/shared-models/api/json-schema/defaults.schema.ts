/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IErrors } from '../../interfaces/index.js'

const SuccessResponseSchema = (dataSchema: any) => {
  //const definitions = dataSchema?.definitions
  return {
    type: 'object',
    //definitions,
    properties: {
      //data: {},
      data: dataSchema,
      success: {
        type: 'boolean',
        enum: [true],
      },
    },
    required: ['success', 'data'],
  }
}

const ErrorRequestSchema = (keys: string[]) => ({
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      enum: [false],
    },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: keys.includes('any')
            ? {
                type: 'string',
              }
            : {
                enum: keys,
                type: 'string',
              },
          message: {
            type: 'string',
          },
          extra: {},
        },
        additionalProperties: false,
        required: ['message'],
      },
    },
  },
  additionalProperties: false,
  required: ['errors', 'success'],
})

const NoContentSchema = {
  type: 'null',
}

export const ResponseSchemas = {
  200: (data: any) => SuccessResponseSchema(data),
  201: (data?: any) => SuccessResponseSchema(data),
  204: (data?: any) => NoContentSchema,
  302: (data?: any) => NoContentSchema,
  400: (data?: any) => ErrorRequestSchema(['any']),
  401: (data?: any) => ErrorRequestSchema([IErrors.UNAUTHORIZED]),
  402: (data?: any) => NoContentSchema,
  403: (data?: any) => ErrorRequestSchema([IErrors.FORBIDDEN_ACCESS]),
  404: (data?: any) => ErrorRequestSchema([IErrors.NOT_FOUND]),
  429: (data?: any) => ErrorRequestSchema([IErrors.MAX_RATE_LIMIT]),
  501: (data?: any) => NoContentSchema,
  502: (data?: any) => NoContentSchema,
}
export const IGetFileApiCustomSchema = {
  tags: ['File'],
  summary: 'Get file' as const,
  method: 'GET' as const,
  route: '/:file_name' as const,

  params: {
    type: 'object',
    properties: {
      file_name: {
        minLength: 1,
        example: 'test',
        type: 'string',
      },
    },
    additionalProperties: false,
    required: ['file_name'],
  },

  querystring: {
    type: 'object',
    properties: {
      file_hash: {
        minLength: 1,
        maxLength: 31,
        example: 'test',
        type: 'string',
      },

      thumbnail: {
        type: 'boolean',
      },
    },
    additionalProperties: false,
    required: ['file_hash'],
  },
  response: {
    '404': ResponseSchemas[404](),
    '403': ResponseSchemas[403](),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
  },
}
