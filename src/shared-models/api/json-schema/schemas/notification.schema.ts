import { ResponseSchemas } from '../defaults.schema.js'

export const IGetAllNotificationsApiSchema = {
  tags: ['Notification'],
  summary: 'List all notifications' as const,
  method: 'GET' as const,
  route: '/user/notification' as const,

  querystring: {
    type: 'object',
    properties: {
      type: {
        enum: ['all', 'read', 'seen', 'unread', 'unseen'],
        type: 'string',
      },
      limit: {
        minimum: 1,
        maximum: 100,
        example: 10,
        default: 10,
        type: 'integer',
      },
      page: {
        type: 'integer',
      },
      pagination: {
        default: true,
        example: true,
        type: 'boolean',
      },
    },
    additionalProperties: false,
    required: ['pagination'],
  },
  response: {
    '200': ResponseSchemas[200]({
      type: 'object',
      properties: {
        result: {
          type: 'array',
          items: {
            additionalProperties: false,
            type: 'object',
            properties: {
              notification_id: {
                type: 'integer',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
              },
              is_read: {
                type: 'boolean',
              },
              is_seen: {
                type: 'boolean',
              },
              is_silent: {
                type: 'boolean',
              },
              src_user: {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      user_id: {
                        type: 'integer',
                      },
                      first_name: {
                        type: 'string',
                      },
                      last_name: {
                        type: 'string',
                      },
                      nickname: {
                        type: 'string',
                        nullable: true,
                      },
                      timezone: {
                        anyOf: [
                          {
                            type: 'object',
                            properties: {
                              timezone_id: {
                                type: 'integer',
                              },
                              name: {
                                type: 'string',
                              },
                              offset: {
                                type: 'integer',
                                nullable: true,
                              },
                              abbr: {
                                type: 'string',
                                nullable: true,
                              },
                            },
                            additionalProperties: false,
                            required: ['abbr', 'name', 'offset', 'timezone_id'],
                          },
                          {
                            type: 'object',
                            nullable: true,
                          },
                        ],
                      },
                      avatar: {
                        anyOf: [
                          {
                            type: 'object',
                            properties: {
                              full_path: {
                                type: 'string',
                              },
                              alt: {
                                type: 'string',
                              },
                              file_id: {
                                type: 'integer',
                              },
                            },
                            additionalProperties: false,
                            required: ['alt', 'full_path'],
                          },
                          {
                            type: 'object',
                            nullable: true,
                          },
                        ],
                      },
                      email: {
                        type: 'string',
                        nullable: true,
                      },
                      position: {
                        type: 'string',
                        nullable: true,
                      },
                      company: {
                        type: 'string',
                        nullable: true,
                      },
                      username: {
                        type: 'string',
                        nullable: true,
                      },
                    },
                    additionalProperties: false,
                    required: ['avatar', 'email', 'first_name', 'last_name', 'timezone', 'user_id', 'username'],
                  },
                  {
                    type: 'object',
                    nullable: true,
                  },
                ],
              },
              dst_user_id: {
                type: 'integer',
              },
              workspace_id: {
                type: 'integer',
                nullable: true,
              },
              template: {
                enum: [
                  'booking_auto_confirm',
                  'booking_canceled',
                  'booking_confirmed',
                  'booking_declined',
                  'booking_invited',
                  'booking_pending',
                  'booking_rescheduled',
                  'matter_added',
                  'meeting_all_voted',
                  'meeting_attended',
                  'meeting_canceled',
                  'meeting_confirmed',
                  'meeting_declined_one',
                  'meeting_invitation_approved',
                  'meeting_invite',
                  'meeting_invite_poll',
                  'meeting_knock_request',
                  'meeting_missed',
                  'meeting_poll_canceled',
                  'meeting_poll_declined_one',
                  'meeting_poll_updated',
                  'meeting_recording_invite',
                  'meeting_reminder_1hr',
                  'meeting_reminder_30min',
                  'meeting_reminder_now',
                  'meeting_reminder_tomorrow',
                  'meeting_start',
                  'meeting_updated',
                  'meeting_vote',
                  'module_request_access',
                  'module_request_access_reply',
                  'notification_test',
                  'opportunity_assigned',
                  'opportunity_expressed',
                  'opportunity_invited',
                  'opportunity_updated',
                  'page_invite',
                  'page_update',
                  'room_added',
                  'room_invitation_approved',
                  'room_opened',
                  'service_host_changed',
                  'service_invite',
                  'workspace_invite',
                  'workspace_join',
                  'workspace_left',
                ],
                type: 'string',
              },
              meta: {
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      meeting: {
                        type: 'object',
                        properties: {
                          meeting_hash: {
                            type: 'string',
                          },
                          url: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                          type: {
                            enum: ['booking', 'breakoutroom', 'meeting', 'room', 'template'],
                            type: 'string',
                          },
                          response: {
                            enum: ['accept', 'block', 'reject'],
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['meeting_hash', 'name', 'type', 'url'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          meeting_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['meeting_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['meeting', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      meeting_user_id: {
                        type: 'integer',
                      },
                      meeting: {
                        type: 'object',
                        properties: {
                          meeting_hash: {
                            type: 'string',
                          },
                          url: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                          type: {
                            enum: ['booking', 'breakoutroom', 'meeting', 'room', 'template'],
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['meeting_hash', 'name', 'type', 'url'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          meeting_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['meeting_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['meeting', 'meeting_user_id', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      meeting: {
                        type: 'object',
                        properties: {
                          meeting_hash: {
                            type: 'string',
                          },
                          url: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                          type: {
                            enum: ['booking', 'breakoutroom', 'meeting', 'room', 'template'],
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['meeting_hash', 'name', 'type', 'url'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          meeting_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['meeting_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['meeting', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      module: {
                        enum: [
                          'agenda',
                          'document',
                          'folder',
                          'meeting',
                          'meeting_recording',
                          'note',
                          'opportunity',
                          'private_file',
                          'project',
                          'room',
                          'service',
                          'user_profile',
                          'workspace',
                          'workspace_profile',
                        ],
                        type: 'string',
                      },
                      record_id: {
                        anyOf: [
                          {
                            type: 'string',
                          },
                          {
                            type: 'integer',
                          },
                        ],
                      },
                      share_id: {
                        type: 'integer',
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['module', 'record_id', 'share_id', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      workspace: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                          },
                          workspace_id: {
                            type: 'integer',
                          },
                        },
                        additionalProperties: false,
                        required: ['name', 'workspace_id'],
                      },
                      variables: {
                        type: 'array',
                        items: [
                          {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'object',
                                properties: {
                                  text: {
                                    type: 'string',
                                  },
                                  id: {
                                    anyOf: [
                                      {
                                        type: 'string',
                                        nullable: true,
                                      },
                                      {
                                        type: 'integer',
                                      },
                                    ],
                                  },
                                },
                                additionalProperties: false,
                                required: ['id', 'text'],
                              },
                              src_user_id: {
                                type: 'object',
                                properties: {
                                  text: {
                                    type: 'string',
                                  },
                                  id: {
                                    anyOf: [
                                      {
                                        type: 'string',
                                        nullable: true,
                                      },
                                      {
                                        type: 'integer',
                                      },
                                    ],
                                  },
                                },
                                additionalProperties: false,
                                required: ['id', 'text'],
                              },
                            },
                            additionalProperties: false,
                            required: ['name', 'src_user_id'],
                          },
                        ],
                        minItems: 1,
                        maxItems: 1,
                      },
                    },
                    additionalProperties: false,
                    required: ['variables', 'workspace'],
                  },
                  {
                    type: 'object',
                    properties: {
                      module: {
                        enum: [
                          'agenda',
                          'document',
                          'folder',
                          'meeting',
                          'meeting_recording',
                          'note',
                          'opportunity',
                          'private_file',
                          'project',
                          'room',
                          'service',
                          'user_profile',
                          'workspace',
                          'workspace_profile',
                        ],
                        type: 'string',
                      },
                      record_id: {
                        anyOf: [
                          {
                            type: 'string',
                          },
                          {
                            type: 'integer',
                          },
                        ],
                      },
                      respond: {
                        enum: ['accepted', 'declined'],
                        type: 'string',
                      },
                      share_id: {
                        type: 'integer',
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          respond: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['name', 'respond', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['module', 'record_id', 'respond', 'share_id', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      invited_user_id: {
                        type: 'integer',
                      },
                      page: {
                        type: 'object',
                        properties: {
                          page_hash: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['name', 'page_hash'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          page_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['page_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['invited_user_id', 'page', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      page: {
                        type: 'object',
                        properties: {
                          page_hash: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['name', 'page_hash'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          page_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['page_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['page', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      project: {
                        type: 'object',
                        properties: {
                          project_hash: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['name', 'project_hash'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          project_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['project_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['project', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      opportunity: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                          },
                          opportunity_hash: {
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['name', 'opportunity_hash'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          opportunity_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['opportunity_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['opportunity', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      invited_user_id: {
                        type: 'integer',
                      },
                      service: {
                        type: 'object',
                        properties: {
                          service_url: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['name', 'service_url'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          service_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['service_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['invited_user_id', 'service', 'variables'],
                  },
                  {
                    type: 'object',
                    properties: {
                      invited_user_id: {
                        type: 'integer',
                      },
                      meeting_recording: {
                        type: 'object',
                        properties: {
                          meeting_recording_hash: {
                            type: 'string',
                          },
                          meeting_url: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                        },
                        additionalProperties: false,
                        required: ['meeting_recording_hash', 'meeting_url', 'name'],
                      },
                      variables: {
                        type: 'object',
                        properties: {
                          src_user_id: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                          meeting_recording_name: {
                            type: 'object',
                            properties: {
                              text: {
                                type: 'string',
                              },
                              id: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    nullable: true,
                                  },
                                  {
                                    type: 'integer',
                                  },
                                ],
                              },
                            },
                            additionalProperties: false,
                            required: ['id', 'text'],
                          },
                        },
                        additionalProperties: false,
                        required: ['meeting_recording_name', 'src_user_id'],
                      },
                    },
                    additionalProperties: false,
                    required: ['invited_user_id', 'meeting_recording', 'variables'],
                  },
                  {
                    type: 'object',
                    additionalProperties: false,
                  },
                ],
              },
            },
            required: [
              'created_at',
              'dst_user_id',
              'is_read',
              'is_seen',
              'is_silent',
              'meta',
              'notification_id',
              'src_user',
              'template',
              'workspace_id',
            ],
          },
        },
        read_count: {
          type: 'integer',
        },
        seen_count: {
          type: 'integer',
        },
        limit: {
          type: 'integer',
        },
        page: {
          type: 'integer',
        },
        total: {
          type: 'integer',
        },
        totalPages: {
          type: 'integer',
        },
        offset: {
          type: 'integer',
        },
        hasNextPage: {
          type: 'boolean',
        },
        hasPrevPage: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
      required: ['offset', 'read_count', 'result', 'seen_count'],
    }),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
    '403': ResponseSchemas[403](),
  },
}

export const IBulkNotificationsActionApiSchema = {
  tags: ['Notification'],
  summary: 'Bulk notifications action' as const,
  method: 'POST' as const,
  route: '/user/notification/status/bulk-action' as const,

  body: {
    type: 'object',
    properties: {
      notification_ids: {
        example: [1, 6, 8],
        minItems: 1,
        maxItems: 200,
        type: 'array',
        items: {
          type: 'integer',
        },
      },
      action: {
        example: 'seen',
        enum: ['clear', 'read', 'seen', 'unread'],
        type: 'string',
      },
      from_date: {
        description:
          'The action will have effect on all notifications that are past this time.\r\n' +
          'If `notification_ids` is passed, this will be applied as a filter to them.',
        format: 'date-time',
        example: '2020-10-10T10:00:00',
        type: 'string',
      },
      to_date: {
        description:
          'The action will have effect on all notifications that are before this time.\n' +
          'If `notification_ids` is passed, this will be applied as a filter to them.',
        format: 'date-time',
        example: '2021-10-10T10:00:00',
        type: 'string',
      },
    },
    additionalProperties: false,
    required: ['action'],
  },

  response: {
    '200': ResponseSchemas[200]({
      type: 'object',
      properties: {
        successIds: {
          type: 'array',
          items: {
            type: 'integer',
          },
        },
        failedIds: {
          type: 'array',
          items: {
            type: 'integer',
          },
        },
      },
      additionalProperties: false,
      required: ['failedIds', 'successIds'],
    }),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
    '403': ResponseSchemas[403](),
  },
}

export const IUpdateNotificationStatusApiSchema = {
  tags: ['Notification'],
  summary: 'Update notification status' as const,
  method: 'PUT' as const,
  route: '/user/notification/status/:notification_id' as const,

  params: {
    type: 'object',
    properties: {
      notification_id: {
        example: 10,
        type: 'integer',
      },
    },
    additionalProperties: false,
    required: ['notification_id'],
  },
  body: {
    type: 'object',
    properties: {
      action: {
        example: 'is_read',
        enum: ['is_read', 'is_seen'],
        type: 'string',
      },
    },
    additionalProperties: false,
    required: ['action'],
  },

  response: {
    '201': ResponseSchemas[201]({
      type: 'object',
      properties: {},
    }),
    '400': ResponseSchemas[400](),
    '429': ResponseSchemas[429](),
    '401': ResponseSchemas[401](),
    '403': ResponseSchemas[403](),
  },
}

export const ITestNotificationApiSchema = {
  tags: ['Notification'],
  summary: 'Test notification' as const,
  method: 'GET' as const,
  route: '/user/notification/test' as const,

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
