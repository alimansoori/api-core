import { MODULE_KEY, PERMISSION, TIMEZONE } from '@app/shared-models/index.js'
import { generateRandomNumber } from '@app/utility/common/generateRandomString.js'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { generateNanoID } from '../core.helpers.js'
import { nanoid } from 'nanoid'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'
export const Faker = {
  ...faker,
  custom: {
    randomNumber: (min: number, max: number) => {
      return Math.floor(generateRandomNumber() * (max - min + 1)) + min
    },
    service: async (user_id: number, workspace_id: number) => {
      const repo = getRepo()

      return await repo.service.create({
        name: 'Work with Camera',
        description: 'Strengthening the muscles around the knee is not the answer to knee pain reduction.',
        from_date: new Date('2021-10-30'),
        service_hash: nanoid(31),
        to_date: new Date('2021-11-21'),
        min_booking_notice: 10,
        start_time_increment: 30,
        url: generateNanoID(14),
        max_booking_per_day: 5,
        buffer_before_meeting: 20,
        buffer_after_meeting: 30,
        is_draft: false,
        workspace: { connect: { workspace_id } },
        user: { connect: { user_id } },
        availability_template: {
          create: {
            timezone: { connect: { name: TIMEZONE['Asia/Tehran'] } },
            type: 'service',
            workspace: { connect: { workspace_id } },
            user: { connect: { user_id } },
            availability: {
              create: [
                {
                  type: 'default',
                  week_day: 'wednesday',
                  start_time: new Date(),
                  end_time: new Date(),
                },
                {
                  type: 'date',
                  date: new Date('2021-10-30'),
                  start_time: new Date(),
                  end_time: new Date(),
                },
              ],
            },
          },
        },
        variations: {
          create: [
            {
              price: 10,
              duration: 60,
              location_id: 1,
              type: 'paid',
              order: 1,
              currency_id: (await repo.currency.getByCode('USD'))!.currency_id,
            },
          ],
        },
        service_share: {
          create: [
            {
              share: {
                create: {
                  module_id: (await repo.module.getModuleByKey(MODULE_KEY.service))!.module_id,
                  dst_user_id: user_id,
                  permission: PERMISSION.Owner,
                  workspace_id,
                  src_user_id: user_id,
                },
              },
            },
          ],
        },
        service_user: {
          createMany: {
            data: [{ user_id, calc_permission: PERMISSION.Owner }],
          },
        },
      })
    },
    uniMeeting: async (initialData: {
      type: 'meeting' | 'room'
      user_id: number
      workspace_id: number
      participants: {
        id: number
        role: PERMISSION.Admin | PERMISSION.Collaborator | PERMISSION.Viewer
        type: 'user' | 'usergroup'
      }[]
    }) => {
      const helper = getHelper()

      const creation = {
        meeting: async () => {
          return await helper.meeting.createMeeting('meeting', {
            meeting_location: { location_id: 1 },
            owner_user_id: initialData.user_id,
            participants: initialData.participants,
            workspace_id: initialData.workspace_id,
            times: [
              {
                start: dayjs().hour(9).minute(0).toDate().toISOString(),
                end: dayjs().hour(10).minute(0).toDate().toISOString(),
                initial_order: 1,
              },
            ],
            console_project: {
              domain: 'localhost',
              console_project_id: 1,
            },
            name: Faker.company.buzzNoun(),
            server_id: 1,
            reply: {},
          })
        },
        room: async () => {
          const helper = getHelper()

          return await helper.meeting.createMeeting('room', {
            meeting_location: { location_id: 1 },
            owner_user_id: initialData.user_id,
            participants: initialData.participants,
            console_project: {
              domain: 'localhost',
              console_project_id: 1,
            },
            name: Faker.company.buzzNoun(),
            max_attendee: 10,
            times: [
              {
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                initial_order: 0,
              },
            ],
            workspace_id: 1,
            url: Faker.string.sample(3).toLowerCase().replace(/\s/g, '_').substring(0, 31),
            server_id: 1,
            reply: {},
          })
        },
      }
      return creation[initialData.type]()
    },
  },
}
