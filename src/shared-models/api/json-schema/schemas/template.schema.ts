import { ResponseSchemas } from '../defaults.schema.js'

export const IGetAllIntegrationTemplateApiSchema = {
  tags: ['Template'],
  summary: 'List all integration templates' as const,

  deprecated: true as const,

  response: {
    '200': ResponseSchemas[200]({
      type: 'object',
      properties: {},
    }),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
    '403': ResponseSchemas[403](),
  },
}
