import { ResponseSchemas } from '../defaults.schema.js'

export const IGetAllWidgetsApiSchema = {
  tags: ['Widget'],
  summary: 'List all widgets' as const,
  method: 'GET' as const,
  route: '/workspace/:workspace_id/dashboard/widgets/all' as const,

  params: {
    type: 'object',
    properties: {
      workspace_id: {
        type: 'integer',
      },
    },
    additionalProperties: false,
    required: ['workspace_id'],
  },

  response: {
    '200': ResponseSchemas[200]({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          widget_id: {
            type: 'integer',
          },
          key: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          parent_id: {
            type: 'integer',
            nullable: true,
          },
        },
        additionalProperties: false,
        required: ['key', 'name', 'parent_id', 'widget_id'],
      },
    }),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
    '403': ResponseSchemas[403](),
  },
}

export const IGetManageUserWidgetListApiSchema = {
  tags: ['Widget'],
  summary: 'Manage use widget list' as const,
  method: 'POST' as const,
  route: '/workspace/:workspace_id/dashboard/widgets' as const,

  params: {
    type: 'object',
    properties: {
      workspace_id: {
        type: 'integer',
      },
    },
    additionalProperties: false,
    required: ['workspace_id'],
  },
  body: {
    type: 'object',
    properties: {
      widget_keys: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            is_selected: {
              type: 'boolean',
            },
          },
          additionalProperties: false,
          required: ['is_selected', 'name'],
        },
      },
    },
    additionalProperties: false,
    required: ['widget_keys'],
  },

  response: {
    '204': ResponseSchemas[204](),
    '403': ResponseSchemas[403](),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
  },
}

export const IGetAllUserWidgetsApiSchema = {
  tags: ['Widget'],
  summary: 'List All user Widgets' as const,
  method: 'GET' as const,
  route: '/workspace/:workspace_id/dashboard/widgets' as const,

  params: {
    type: 'object',
    properties: {
      workspace_id: {
        type: 'integer',
      },
    },
    additionalProperties: false,
    required: ['workspace_id'],
  },

  response: {
    '200': ResponseSchemas[200]({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          user_widget_id: {
            type: 'integer',
          },
          user_id: {
            type: 'integer',
          },
          workspace_id: {
            type: 'integer',
          },
          order: {
            type: 'integer',
            nullable: true,
          },
          widget_id: {
            type: 'integer',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
        },
        additionalProperties: false,
        required: ['created_at', 'order', 'updated_at', 'user_id', 'user_widget_id', 'widget_id', 'workspace_id'],
      },
    }),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
    '403': ResponseSchemas[403](),
  },
}
