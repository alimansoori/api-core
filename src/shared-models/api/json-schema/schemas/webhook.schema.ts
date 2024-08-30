import { ResponseSchemas } from '../defaults.schema.js'

export const IStripeWebhookApiSchema = {
  tags: ['Webhook'],
  summary: 'Stripe webhook' as const,
  method: 'POST' as const,
  route: '/stripe' as const,

  hide: true as const,

  response: {
    '200': ResponseSchemas[200]({
      type: 'object',
      additionalProperties: false,
    }),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
  },
}

export const IClioContactWebhookApiSchema = {
  tags: ['Webhook'],
  summary: 'Clio contact webhook' as const,
  method: 'POST' as const,
  route: '/clio/:user_id/contact' as const,

  hide: true as const,
  params: {
    type: 'object',
    properties: {
      user_integrated_module_id: {
        type: 'integer',
      },
    },
    additionalProperties: false,
    required: ['user_integrated_module_id'],
  },

  response: {
    '204': ResponseSchemas[204](),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
  },
}

export const IClioMatterWebhookApiSchema = {
  tags: ['Webhook'],
  summary: 'Clio matter webhook' as const,
  method: 'POST' as const,
  route: '/clio/:user_id/matter' as const,

  hide: true as const,
  params: {
    type: 'object',
    properties: {
      user_integrated_module_id: {
        type: 'integer',
      },
    },
    additionalProperties: false,
    required: ['user_integrated_module_id'],
  },

  response: {
    '204': ResponseSchemas[204](),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
  },
}

export const IClioCalEntryWebhookApiSchema = {
  tags: ['Webhook'],
  summary: 'Clio calendar entry webhook' as const,
  method: 'POST' as const,
  route: '/clio/:user_id/calendar_entry' as const,

  hide: true as const,
  params: {
    type: 'object',
    properties: {
      user_integrated_module_id: {
        type: 'integer',
      },
    },
    additionalProperties: false,
    required: ['user_integrated_module_id'],
  },

  response: {
    '204': ResponseSchemas[204](),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
  },
}
