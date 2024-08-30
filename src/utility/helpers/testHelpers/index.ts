export * from './interfaces/index.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { CustomAvailability } from '@app/database/entities/TemplateAvailability/TemplateAvailability.repo.js'
import Database from '@app/database/index.js'
import RocketchatApi from '@app/lib/integrations/rocketchat/rocketchatApi.js'
import { logger } from '@app/lib/logger.js'
import { regexPatterns } from '@app/utility/constants/index.js'
import {
  randBoolean,
  randFirstName,
  randFutureDate,
  randLastName,
  randNumber,
  randWord
} from '@ngneat/falso'
import { AVAILABILITY_TEMPLATE_TYPE, AVAILABILITY_TYPE, WEEK_DAY } from '@prisma/client'
import { container } from 'tsyringe'

/// ////////////////////////////////////////////////////// stress test ////////////////////////////////////////////////

export const dummyMeeting = (user_id?: number, workspace_id?: number) => ({
  subject: randWord(),
  meeting_type: {
    title: 'uniclient',
  },
  recurrence: {
    option: 'Every day',
    custom: {
      type: 'day',
      repeat_every: randNumber({
        min: 1,
        max: 10,
      }),
    },
    after: randNumber({
      min: 1,
      max: 10,
    }),
    monthlyAtSameWeekAndDay: true,
  },
  user_id: user_id ?? 1,
  workspace_id: workspace_id ?? 1,
  emoji: '🏠',
  status: randNumber({
    min: 1,
    max: 10,
  }),
  meeting_timeslot: {
    create: dummyMeetingTime(),
  },
})

export const dummyUclDocument = (user_id?: number, workspace_id?: number, meeting_id?: string) => ({
  user_id: user_id ?? 1,
  workspace_id: workspace_id ?? 1,
  meeting_id,
  published: randBoolean(),
  // amir
  // type: random.arrayElement(Object.getOwnPropertyNames(DOCUMENT_TYPE)) as unknown as DOCUMENT_TYPE,
  title: randWord(),
  blocks: {
    create: createFakeUcldocumentBlock(),
  },
})

export const dummyWorkSpace = (user_id?: number) => ({
  user_id: user_id ?? 1,
  name: randWord(),
  server_id: 1,
  workspace_user: {
    create: {
      user_id,
      currency: { connect: { code: 'USD' } },
      status: randNumber({
        min: 1,
        max: 10,
      }),
      chat_user_id: randWord(),
    },
  },
  workspace_roles: {
    create: {
      title: randWord(),
      is_owner: true,
      manage_members: true,
      manage_workspace: true,
      billing_access: true,
      workspace_collaboration: true,
    },
  },
  workspace_profile: {
    create: { url: randWord() },
  },
})

function dummyMeetingEvent() {
  return {
    status: randNumber({
      min: 1,
      max: 5,
    }),
    start: randFutureDate(),
    end: randFutureDate(),
    started_at: randFutureDate(),
    ended_at: randFutureDate(),
  }
}

function dummyMeetingTime() {
  return {
    selected: randBoolean(),
    initial_order: randNumber(),
    start: randFutureDate(),
    end: randFutureDate(),
    meeting_event: {
      create: dummyMeetingEvent(),
    },
  }
}

function createFakeUcldocumentBlock() {
  return {
    tag: randWord(),
    html: `<h1>${randWord()}</h1>`,
    checkable: randBoolean(),
    checked: randBoolean(),
    order: randNumber({
      min: 1,
      max: 10,
    }),
  }
}

export const deleteDummyUser = async (user_id: number, email: string): Promise<void> => {
  const repo = getRepo()

  const db = container.resolve(Database)
  const rocketApi = container.resolve(RocketchatApi)

  const workspaceUser = await db.getPrisma().workspace_user.findFirst({
    where: { user_id: user_id },
  })
  await repo.user.deleteUserByEmail(email)

  if (workspaceUser?.chat_user_id) {
    await rocketApi.removeUserByUserId(workspaceUser.chat_user_id)
  }
}

export async function createDummyTemplate(user_id: number) {
  try {
    const repo = getRepo()

    const templatesCount = await repo.templateAvailability.countAllByUserId(user_id)
    const availability: CustomAvailability[] = [
      {
        type: AVAILABILITY_TYPE.default,
        week_day: WEEK_DAY.saturday,
        is_available: true,
        start_time: '15:00:00',
        end_time: '18:00:00',
      },
      {
        type: AVAILABILITY_TYPE.date,
        date: '2021-09-30',
        is_available: true,
        start_time: '10:00:00',
        end_time: '18:00:00',
      },
    ]

    const template = await repo.templateAvailability.create({
      availability,
      user_id,
      type: AVAILABILITY_TEMPLATE_TYPE.service,
      name: `custom${templatesCount + 1}`,
    })

    if (template) {
      return template
    }
  } catch (error) {
    logger.error(error)
  }
}

export function deleteDummyTemplate(template_id: number) {
  try {
    const repo = getRepo()
    repo.templateAvailability.delete(template_id)
  } catch (error) {
    logger.error(error)
  }
}

export function safeFakeFirstName() {
  let name: string | null = null

  do {
    name = randFirstName() as string
  } while (!name.match(regexPatterns.meetingSubject))

  return name
}

export function safeFakeLastName() {
  let name: string | null = null

  do {
    name = randLastName() as string
  } while (!name.match(regexPatterns.meetingSubject))

  return name
}
