import { WORKSPACE_ACCESS } from '../../../../shared-models/index.js'
import { Prisma } from '@prisma/client'

export const uniconsoleAccess: Prisma.accessCreateArgs['data'][] = [
  {
    name: 'Overview',
    key: 'overview',
    type: 'console',
    access: {
      createMany: {
        data: [
          {
            key: 'online_rooms',
            name: 'Online Rooms',
            description: 'Members with this access will be see Online Rooms',
            type: 'console',
          },
          {
            key: 'weekly_signups',
            name: 'Weekly Signups',
            description: 'Members with this access will be see Weekly Signups',
            type: 'console',
          },
          {
            key: 'today_incomes',
            name: 'Today Income',
            description: 'Members with this access will be see Today Incomes',
            type: 'console',
          },
          {
            key: 'total_balance',
            name: 'Total Balance',
            description: 'Members with this access will be see Total Balance',
            type: 'console',
          },
          {
            key: 'total_slient_service',
            name: 'Total Client Service',
            description: 'Members with this access will be see Total Client Service',
            type: 'console',
          },
          {
            key: 'active_services',
            name: 'Active Services',
            description: 'Members with this access will be see Active Services',
            type: 'console',
          },
          {
            key: 'daily_meetings',
            name: 'Daily Meetings',
            description: 'Members with this access will be see Online Rooms',
            type: 'console',
          },
          {
            key: 'monthly_meetings',
            name: 'Monthly Meetings',
            description: 'Members with this access will be see Monthly Meetings',
            type: 'console',
          },
          {
            key: 'traffic_data',
            name: 'Traffic Data',
            description: 'Members with this access will be see Traffic Data',
            type: 'console',
          },
          {
            key: 'storage_data',
            name: 'Storage Data',
            description: 'Members with this access will be see Storage Data',
            type: 'console',
          },
        ],
      },
    },
  },
  {
    name: 'Reports',
    key: 'reports',
    type: 'console',
    access: {
      createMany: {
        data: [
          {
            key: 'billing',
            name: 'Billing',
            description: 'Members with this access will be access to all of UniConsoles Bills',
            type: 'console',
          },
          {
            key: 'subscriptions',
            name: 'Subscriptions',
            description: 'Members with this access will be access to all of UniConsoles Subscriptions',
            type: 'console',
          },
        ],
      },
    },
  },
  {
    name: 'Developments',
    key: 'developments',
    type: 'console',
    access: {
      createMany: {
        data: [
          {
            key: 'api',
            name: 'API',
            description: 'Members with this access will be access to all of UniConsoles APIS',
            type: 'console',
          },
          {
            key: 'documentations',
            name: 'Documentations',
            description: 'Members with this access will be access to all of UniConsoles Documentation',
            type: 'console',
          },
          {
            key: 'events',
            name: 'Events',
            description: 'Members with this access will be access to all of UniConsoles Events',
            type: 'console',
          },
          {
            key: 'logs',
            name: 'Logs',
            description: 'Members with this access will be access to all of UniConsoles Logs',
            type: 'console',
          },
        ],
      },
    },
  },
  { key: WORKSPACE_ACCESS.IsOwner, name: 'Owner', type: 'client' },
  {
    name: 'Workspace',
    key: 'workspace',
    type: 'client',
    access: {
      createMany: {
        data: [
          {
            key: WORKSPACE_ACCESS.ManageMembers,
            name: 'Manage Members',
            description: 'Full access to workspace setting and preferences.',
            type: 'client',
          },
          {
            key: WORKSPACE_ACCESS.ManageWorkspace,
            name: 'Manage Workspace',
            description: 'Full member adminstration.',
            type: 'client',
          },
          {
            key: WORKSPACE_ACCESS.BillingAccess,
            name: 'Manage usage & billing',
            description: 'Access to workspace billing area.',
            type: 'client',
          },
          {
            key: WORKSPACE_ACCESS.WorkspaceCollaboration,
            name: 'Workspace Collaboration',
            description: 'Create and collaborate with all members.',
            type: 'client',
          },
          {
            key: WORKSPACE_ACCESS.Developer,
            name: 'Developer access',
            description: 'Generate token to access workspace data.',
            type: 'client',
          },
        ],
      },
    },
  },
]
