import { Prisma } from '@prisma/client'
import { WIDGET_NAME } from '../../../../shared-models/index.js'

export const widgets: Prisma.widgetCreateManyArgs['data'] = [
  {
    key: WIDGET_NAME.overview,
    name: 'overview',
    widget_id: 1,
  },
  {
    key: WIDGET_NAME.booked_meetings,
    name: 'Booked meeting',
    widget_id: 2,
    parent_id: 1,
  },
  {
    key: WIDGET_NAME.daily_meetings,
    name: 'Daily meetings',
    widget_id: 3,
    parent_id: 1,
  },
  {
    key: WIDGET_NAME.monthly_income,
    name: 'Monthly income',
    widget_id: 4,
    parent_id: 1,
  },
  {
    key: WIDGET_NAME.used_storage,
    name: 'Used storage',
    widget_id: 5,
    parent_id: 1,
  },
  {
    key: WIDGET_NAME.module,
    name: 'module',
    widget_id: 6,
  },
  {
    key: WIDGET_NAME.past_meeting,
    name: 'Past Meeting',
    widget_id: 7,
    parent_id: 6,
  },
  {
    key: WIDGET_NAME.recent_files,
    name: 'Recent files',
    widget_id: 8,
    parent_id: 6,
  },
  {
    key: WIDGET_NAME.recent_notes,
    name: 'Recent notes',
    widget_id: 9,
    parent_id: 6,
  },
  {
    key: WIDGET_NAME.recent_tasks,
    name: 'Recent tasks',
    widget_id: 10,
    parent_id: 6,
  },
  {
    key: WIDGET_NAME.rooms,
    name: 'Rooms',
    parent_id: 6,
    widget_id: 118,
  },
  {
    key: WIDGET_NAME.upcoming_meetings,
    name: 'Upcoming meetings',
    widget_id: 12,
    parent_id: 6,
  },
]
