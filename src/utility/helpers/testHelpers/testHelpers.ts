import { FastifyInstance } from 'fastify'
import { nanoid } from 'nanoid'
import { inject, singleton } from 'tsyringe'
import bcrypt from 'bcrypt'
import { expect } from 'chai'
import { createApp } from '@app/core/bootApplication.js'
import {
  BLOCK_TYPE_KEY,
  DOCUMENT_TYPE,
  IEmailCauseUniclient,
  IMeetingStatus,
  IUserSignupTempToken,
  IUserToken,
  MODULE_KEY,
  PERMISSION,
  RequestHandler,
  TIMEZONE,
} from '@app/shared-models/index.js'
import {
  safeFakeFirstName,
  safeFakeLastName,
  TestContext,
  transformPath,
  generateNanoID,
  isDevelopment,
} from '@app/utility/helpers/index.js'
import {
  serverLocations,
  labels,
  defaultCover,
  systemAsset,
  systemAssetCategory,
  getPlans,
} from '@app/utility/mock/costants.js'
import Database from '@app/database/index.js'
import { UNI_USERS_PASSWORD } from '@app/utility/mock/aliMansooriUsers.js'
import { addUserToWorkspace, createWorkspace } from '@app/utility/common/index.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { createNewUserSession, generateAccessToken, generateTempToken } from '@app/lib/security.js'
import { spawnSync } from 'child_process'
import { logger } from '@app/lib/logger.js'
import { randEmail } from '@ngneat/falso'
import { Context } from '@app/interfaces/index.js'
import {
  user,
  contact,
  IDENTITY_TYPE,
  contact_identity,
  contact_customfield,
  IDENTITY_CATEGORY,
  usergroup,
  meeting,
  ATTENDEE_REQUEST_TYPE,
  ATTENDEE_REQUEST_STATUS,
  meeting_recurrence,
  breakoutroom_setting,
  meeting_timeslot,
  Prisma,
  project,
  USER_ROLE,
  document,
  note,
  document_template,
  meeting_agenda,
  form,
  DOCUMENT_MARK_TYPE,
} from '@prisma/client'
import { Faker } from '@app/utility/helpers/testHelpers/fake.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { setProjectData } from '@app/core/middleware/catchProject.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'
import AppTerminator from '@app/core/appTerminator.js'

@singleton()
export default class TestHelper {
  constructor(@inject(Database) private db: Database) {}

  private repo = getRepo()
  private helper = getHelper()

  public beforeAllSetup = async () => {
    // initiate app
    const { app } = await createApp()

    let subdomain: string
    let workspace_id: number
    let console_project_id: number
    // check if there's no console project create one
    const console_project = await this.db.getPrisma().console_project.findFirst()

    if (!console_project) {
      const initial_data = await this.initTestData()
      subdomain = initial_data.subdomain
      workspace_id = initial_data.workspace_id
      console_project_id = initial_data.console_project_id
    } else {
      const workspace = await this.db.getPrisma().workspace.findFirst()

      if (!workspace) {
        throw new Error("Can't find any workspace")
      }

      subdomain = workspace.subdomain
      workspace_id = workspace.workspace_id
      console_project_id = console_project.console_project_id
    }

    await setProjectData()

    return { app, subdomain, workspace_id, console_project_id }
  }

  public afterAllSetup = async (app: FastifyInstance) => {
    const terminator = new AppTerminator(app)
    terminator.terminate()

    // eslint-disable-next-line no-process-env
    if (process.env.RESET_DATABASE) {
      logger.log('Resetting database...')
      const command = 'npm run db:reset:test'
      logger.log(spawnSync(command, { shell: false }).toString())
    }
  }

  private loginUser = async (user_id: number) => {
    const session_hash = generateNanoID()
    const jti = nanoid()
    await createNewUserSession(user_id, session_hash, '', jti, '0.0.0.0')
    return generateAccessToken<IUserToken>(user_id, {
      client_id: getConfigs().UNICLIENT_ID,
      users: [{ user_id, user_hash: '' }],
      jti: {
        [jti]: {
          user_id,
          user_hash: '',
        },
      },
    })
  }

  public fakeRequest = async <T extends RequestHandler>(
    app: FastifyInstance,
    method: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS',
    route: string,
    reqData: {
      user_id: number
      params?: T['fastify']['Params']
      body?: T['fastify']['Body']
      query?: T['fastify']['Querystring'] & { subdomain?: string }
    },
    expects: { code: number },
  ): Promise<T['Schema']['response']['200']> => {
    const transformedPath = reqData.params ? transformPath(route, reqData.params) : route
    const res = await app
      .inject({
        method,
        url: transformedPath,
        payload: reqData.body,
        query: reqData.query,
        headers: { authorization: 'bearer ' + (await this.loginUser(reqData.user_id)) },
      })
      .finally()

    if (res.statusCode !== expects.code) logger.log(res.body)
    expect(res.statusCode, JSON.stringify(res.body)).equal(expects.code)

    if (res.body) return JSON.parse(res.body)?.data
    return true
  }

  public generateTempToken = async (email: string, cause: IEmailCauseUniclient) => {
    const generateToken = generateTempToken<IUserSignupTempToken>({ email }, 15)
    return await this.repo.token.exchangeTempToken(generateToken, cause)
  }

  private record = <Prop extends PropertyKey, Value extends { [key: string]: number[] }>(prop: Prop, value: Value) =>
    ({ [prop]: value }) as Record<Prop, Value>

  public deleteAfterAll = async (models: TestContext['shouldDeleteAfterTest']) => {
    for (const modelName in models) {
      const model = models[modelName as keyof typeof models]

      if (model?.method === 'db') {
        const where = { ...this.record(`${modelName}_id`, { in: model.ids }) }
        await (this.db.getPrisma()[modelName as any] as any).deleteMany({
          where,
        })
      } else if (model?.method === 'repo') {
        // repo for each model should add
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore70
        await this.repo[modelName as keyof ReturnType<typeof getRepo>][model.repoMethodName!](model.ids)
      }
    }
  }

  //  <------------------------------->             SAMPLE DATA HELPERS              <------------------------------->

  public createConsoleProject = async (
    name: string,
    ctx?: Context,
  ): Promise<{ console_project_id: number; usertype_id: number }> => {
    // const widget_id = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    // const alimansoori71ProjectWidget: { widget_id: number }[] = [];
    // widget_id.forEach((id) => {
    //   alimansoori71ProjectWidget.push({
    //     widget_id: id,
    //   });
    // });

    const { console_project_id } = await this.db.getPrisma().console_project.create({
      data: {
        name,
        domain: 'staging.alimansoori71.us',
        labels: { create: labels },
        console_project_language: {
          create: [{ language: { connect: { alpha_2: 'en' } } }, { language: { connect: { alpha_2: 'es' } } }],
        },
        logotype_file: {
          create: { mime: 'image/png', path: 'mock/', name: 'coffee_logotype.svg', file_hash: nanoid(31) },
        },
        logotype_dark_file: {
          create: { mime: 'image/png', path: 'mock/', name: 'coffee_logotype_dark.svg', file_hash: nanoid(31) },
        },
        logomark_file: {
          create: { mime: 'image/png', path: 'mock/', name: 'coffee-logo_dark.png', file_hash: nanoid(31) },
        },
        logomark_dark_file: {
          create: { mime: 'image/png', path: 'mock/', name: 'coffee-logo.png', file_hash: nanoid(31) },
        },
      },
    })

    if (isDevelopment()) {
      await this.db.getPrisma().server.create({
        data: {
          name: 'Localhost',
          hostname: 'us1',
          url: 'localhost',
          core_api_address: 'localhost',
          core_ws_address: 'localhost',
          region: 'Localhost',
          country: { connect: { alpha_2: 'US' } },
          console_project: { connect: { console_project_id } },
        },
      })
    }

    for (const server of serverLocations) {
      await this.db.getPrisma().server.create({
        data: {
          ...server,
          console_project: { connect: { console_project_id } },
        },
      })
    }

    await this.db.getPrisma().workspace_type.create({
      data: {
        name: 'Coffee',
        primary_color: '#ff006b',
        primary_dark_color: '#ff006b',
        secondary_color: '#2d3f50',
        secondary_dark_color: '#1e1e22',
        domain: 'coffee.xyz',
        console_project: { connect: { console_project_id } },
        logotype_file: {
          create: { mime: 'image/png', path: 'mock/', name: 'coffee_logotype.svg', file_hash: nanoid(31) },
        },
        logotype_dark_file: {
          create: { mime: 'image/png', path: 'mock/', name: 'coffee_logotype_dark.svg', file_hash: nanoid(31) },
        },
        logomark_file: { create: { mime: 'image/png', path: 'mock/', name: 'coffee-logo.svg', file_hash: nanoid(31) } },
        logomark_dark_file: {
          create: { mime: 'image/png', path: 'mock/', name: 'coffee-logo_dark.svg', file_hash: nanoid(31) },
        },
        plan: {
          create: getPlans(),
        },
      },
    })

    await this.db.getPrisma().system_asset_category.createMany({
      data: systemAssetCategory,
    })

    for (const i of systemAsset) {
      await this.db.getPrisma().system_asset.create({
        data: i,
      })
    }

    for (const i of defaultCover) {
      await this.db.getPrisma().header.create({
        data: i,
      })
    }

    const { usertype_id } = await this.db.getPrisma().usertype.create({
      data: {
        name: 'Lawyer',
        console_project_id,
        usertype_module: {
          create: Object.values(MODULE_KEY).map((i) => ({
            module: { connect: { key: i } },
          })),
        },
      },
    })

    return { console_project_id, usertype_id }
  }

  public createUser = async (
    console_project_id: number,
    email: string,
    first_name: string,
    last_name: string,
    usertype_id: number,
    role?: USER_ROLE,
    ctx?: Context,
  ): Promise<{ user_id: number; username: string }> => {
    const username = `${first_name}.${last_name}.${Faker.string.sample(8)}`
    const { user_id } = await this.db.getPrisma().user.create({
      data: {
        user_identity: {
          create: {
            type: 'email',
            console_project_id: 1,
            value: email,
            is_primary: true,
            is_verified: true,
          },
        },
        user_hash: nanoid(),
        password: await bcrypt.hash(UNI_USERS_PASSWORD, 10),
        first_name: first_name,
        last_name: last_name,
        console_project_id,
        role: role || 'user',
        usertype_id: usertype_id,
        console_project_language_id: (await this.db
          .getPrisma()
          .console_project_language.findFirst({ where: { language: { alpha_2: 'en' } } }))!.console_project_language_id,
        timezone_id: (await this.db.getPrisma().timezone.findFirst({ where: { name: TIMEZONE['Asia/Tehran'] } }))
          ?.timezone_id,
        username,
      },
    })
    return { user_id, username }
  }

  public createUserAndAddToWorkspace = async (
    console_project_id: number,
    email: string,
    first_name: string,
    last_name: string,
    usertype_id: number,
    workspace_id?: number,
    ctx?: Context,
  ): Promise<user> => {
    const username = `${first_name}.${last_name}.${Faker.string.sample(8)}`
    const user = await this.db.getPrisma().user.create({
      data: {
        user_identity: {
          create: {
            type: 'email',
            console_project_id: 1,
            value: email,
            is_primary: true,
            is_verified: true,
          },
        },
        user_hash: nanoid(),
        password: await bcrypt.hash(UNI_USERS_PASSWORD, 10),
        first_name: first_name,
        last_name: last_name,
        console_project_id,
        role: 'user',
        usertype_id: usertype_id,
        console_project_language_id: (await this.db
          .getPrisma()
          .console_project_language.findFirst({ where: { language: { alpha_2: 'en' } } }))!.console_project_language_id,
        timezone_id: (await this.db.getPrisma().timezone.findFirst({ where: { name: TIMEZONE['Asia/Tehran'] } }))
          ?.timezone_id,
        username,
      },
    })

    if (!workspace_id) {
      const { workspace } = await createWorkspace({
        user_id: user.user_id,
        name: Faker.company.buzzNoun(),
        server_id: 1,
        console_project_id: 1,
        subdomain: Faker.string.sample() + Faker.string.sample(8),
        reply: {},
      })
      await addUserToWorkspace({
        workspace_id: workspace.workspace_id,
        user_id: user.user_id,
        mock: true,
        ctx: undefined as any,
        reply: {},
      })
    } else {
      await addUserToWorkspace({
        workspace_id: workspace_id,
        user_id: user.user_id,
        mock: true,
        ctx: undefined as any,
        reply: {},
      })
    }

    return user
  }

  public createContact = async (
    contactUser_id: number,
    workspace_id: number,
    options: {
      user_id?: number
      first_name?: string
      last_name?: string
      prefix?: string
      suffix?: string
      phonetic_first?: string
      phonetic_middle?: string
      phonetic_last?: string
      nickname?: string
      file_as?: string
      company?: string
      job_title?: string
      department?: string
      country?: string
      province?: string
      city?: string
      street_address?: string
      postal_code?: string
      po_box?: string
      label?: string
      birthday?: string
      website?: string
      relationship?: string
      chat?: string
      internet_call?: string
      emails?: Partial<contact_identity>[]
      phones?: Partial<contact_identity>[]
      custom_fields?: Partial<contact_customfield>[]
    },
    ctx?: Context,
  ): Promise<contact> => {
    const {
      birthday,
      chat,
      city,
      company,
      country,
      department,
      file_as,
      first_name,
      internet_call,
      job_title,
      label,
      last_name,
      nickname,
      phonetic_first,
      phonetic_last,
      phonetic_middle,
      po_box,
      postal_code,
      prefix,
      province,
      relationship,
      street_address,
      suffix,
      user_id,
      website,
    } = options

    let { custom_fields, emails, phones } = options
    // if (!user_id) {
    //   const console_project_id = 1;
    //   const email = Faker.internet.email();
    //   const first_name = Faker.name.firstName();
    //   const last_name = Faker.name.lastName();
    //   const usertype_id = 1;

    //   const user = await this.createUser(console_project_id, email, first_name, last_name, usertype_id);
    //   user_id = user.user_id;
    // }

    // if (!workspace_id) {
    //   const { workspace } = await createWorkspace({
    //     user_id: user_id,
    //     name: Faker.company.buzzNoun(),
    //     server_id: 1,
    //     console_project_id: 1,
    //     subdomain: Faker.string.sample() + Faker.string.sample(8),
    //     reply: {},
    //   });

    //   await addUserToWorkspace({
    //     workspace_id: workspace.workspace_id,
    //     user_id: user_id,
    //     create_rc_account: ['user'],
    //     mock: true,
    //     ctx: undefined as any,
    //     reply: {},
    //   });
    //   workspace_id = workspace.workspace_id;
    // }

    const contIdents: Partial<contact_identity>[] = []

    if (!custom_fields) {
      custom_fields = [
        { field_name: Faker.string.sample(), value: Faker.string.sample(2) },
        { field_name: Faker.string.sample(), value: Faker.string.sample(2) },
      ]
    }

    if (!emails?.length) {
      emails = [
        { value: Faker.internet.email(), category: 'work', is_primary: true },
        { value: Faker.internet.email(), category: 'company', is_primary: false },
        { value: Faker.internet.email(), category: 'personal', is_primary: false },
      ]
    }

    if (!phones?.length) {
      phones = [
        { value: Faker.phone.number(), category: 'work', is_primary: true },
        { value: Faker.phone.number(), category: 'personal', is_primary: false },
      ]
    }

    emails?.forEach((email) => {
      contIdents.push({
        type: 'email',
        category: email?.type as IDENTITY_CATEGORY,
        value: email.value as string,
        is_primary: email?.is_primary as boolean,
      })
    })

    phones?.forEach((phone) => {
      contIdents.push({
        type: 'phone',
        category: phone?.type as IDENTITY_CATEGORY,
        value: phone.value as string,
        is_primary: phone?.is_primary as boolean,
      })
    })

    const contact = await this.repo.contact.create({
      contact_hash: generateNanoID(),
      owner_id: contactUser_id,
      user_id,
      workspace_id,
      first_name: first_name ?? Faker.person.firstName(),
      last_name: last_name ?? Faker.person.lastName(),
      prefix: prefix ?? Faker.person.prefix(),
      suffix: suffix ?? Faker.person.suffix(),
      phonetic_first: phonetic_first ?? Faker.person.firstName(),
      phonetic_middle: phonetic_middle ?? Faker.person.middleName(),
      phonetic_last: phonetic_last ?? Faker.person.lastName(),
      nickname: nickname ?? Faker.person.firstName(),
      file_as: file_as ?? Faker.person.fullName(),
      company: company ?? Faker.company.buzzNoun(),
      job_title: job_title ?? Faker.person.jobTitle(),
      department: department ?? Faker.commerce.department(),
      country: country ?? Faker.location.country(),
      province: province ?? Faker.location.state(),
      city: city ?? Faker.location.city(),
      street_address: street_address ?? Faker.location.streetAddress(),
      postal_code: postal_code ?? Faker.location.zipCode(),
      po_box: po_box ?? Faker.location.zipCode('AK'),
      label: label ?? Faker.string.alpha(),
      birthday: birthday ?? '2002-04-06T15:00:00.931Z',
      website: website ?? Faker.internet.url(),
      relationship: relationship ?? Faker.person.jobDescriptor(),
      chat: chat ?? Faker.person.jobType(),
      internet_call: internet_call ?? Faker.phone.imei(),
      contact_identity: {
        create: contIdents.map((contIdn) => ({
          type: contIdn.type as IDENTITY_TYPE,
          category: contIdn.category,
          value: contIdn.value as string,
          is_primary: contIdn.is_primary,
        })),
      },
      contact_customfield: {
        create: custom_fields?.map((field) => ({
          value: field.value as string,
          field_name: field.field_name as string,
        })),
      },
    })

    return contact
  }

  public createContactGroup = async (
    name: string,
    description: string,
    workspace_id: number,
    owner_id: number,
    ctx?: Context,
  ): Promise<usergroup> => {
    const group = await this.repo.userGroup.create({
      name,
      description,
      workspace_id,
      owner_id,
      module_id: (await this.repo.module.getModuleByKey(MODULE_KEY.contact)).module_id,
    })
    return group
  }

  public createBreakoutRoom = async (
    meeting_id: number,
    users: Partial<user>[],
    meeting_status: IMeetingStatus,
    ctx?: Context,
  ): Promise<
    | (meeting & {
        meeting_recurrence: meeting_recurrence | null
        breakoutroom_setting: breakoutroom_setting | null
        meeting_timeslot: meeting_timeslot[]
      })
    | undefined
  > => {
    const attendees = users.map((i) => ({
      calc_permission: i.role,
      user_id: i.user_id,
      request_status: ATTENDEE_REQUEST_STATUS.approved,
    }))
    const breakoutroom = await this.repo.meeting.createBreakoutroom(meeting_id, {
      name: Faker.string.alpha(8),
      status: meeting_status,
      attendees: {
        createMany: {
          data: attendees.map((i) => ({
            request_type: ATTENDEE_REQUEST_TYPE.invited,
            request_status: ATTENDEE_REQUEST_STATUS.approved,
            calc_permission: 1,
            user_id: Number(i.user_id),
          })),
        },
      },
    })

    if (breakoutroom) {
      await this.repo.meeting.update(
        {
          meeting_id: breakoutroom.meeting_id,
        },
        {
          started_at: new Date(),
        },
      )
    }

    return breakoutroom
  }

  public createMeetingDocument = async (
    meeting_hash: string,
    workspace_id: number,
    user_id: number,
    type: DOCUMENT_TYPE,
    name?: string,
    ctx?: Context,
  ): Promise<
    document & {
      note: note | null
      document_template: document_template | null
      meeting_agenda: meeting_agenda | null
      form: form | null
    }
  > => {
    const newDocument = await this.helper.document.createDocument({
      meeting_hash,
      type,
      name: name ?? null,
      workspace_id,
      user_id,
      meeting_user_id: undefined,
      agenda_order: 1,
    })

    const document_child_hash = generateNanoID()

    await this.repo.document.createBlock(
      {
        document: { connect: { document_id: newDocument.document_id } },
        document_block_hash: generateNanoID(),

        document_block_type: {
          connect: {
            key: BLOCK_TYPE_KEY.paragraph,
          },
        },
        above_hash: generateNanoID(),
        below_hash: generateNanoID(),
        checked: false,
        children: {
          create: {
            document_child_hash,
            text: 'Sample Text',
            document_mark_type: {
              create: {
                key: DOCUMENT_MARK_TYPE.bold,
                document_child_hash,
              },
            },
            document_block_type: {
              connect: {
                key: BLOCK_TYPE_KEY.paragraph,
              },
            },
          },
        },
      },
      ctx,
    )
    return newDocument
  }

  public createProject = async (
    workspace_id: number,
    user_id: number,
    name?: string,
    description?: string,
    ctx?: Context,
  ): Promise<project> => {
    const model: Prisma.projectCreateArgs['data'] = {
      project_hash: generateNanoID(),
      name: name ?? Faker.string.alpha(8),
      workspace: { connect: { workspace_id } },
      owner: { connect: { user_id } },
      project_share: {
        create: {
          share: {
            create: {
              module_id: (await this.repo.module.getModuleByKey(MODULE_KEY.project)).module_id,
              workspace_id,
              src_user_id: user_id,
              dst_user_id: user_id,
              permission: PERMISSION.Owner,
            },
          },
        },
      },
      project_users: {
        create: {
          calc_permission: PERMISSION.Owner,
          user_id,
        },
      },
    }
    if (description) model.description = description

    const project = await this.repo.project.create(model)
    return project
  }

  public initTestData = async (): Promise<{ subdomain: string; workspace_id: number; console_project_id: number }> => {
    // return const transaction = container.resolve(Transaction);
    // await transaction.start(async prisma => {
    const { console_project_id: console_id, usertype_id } = await this.createConsoleProject('Test Console')

    const user1 = await this.createUser(console_id, randEmail(), safeFakeFirstName(), safeFakeLastName(), usertype_id)
    const user2 = await this.createUser(console_id, randEmail(), safeFakeFirstName(), safeFakeLastName(), usertype_id)
    const user3 = await this.createUser(console_id, randEmail(), safeFakeFirstName(), safeFakeLastName(), usertype_id)
    await this.createUser(console_id, randEmail(), safeFakeFirstName(), safeFakeLastName(), usertype_id)

    const { workspace } = await createWorkspace({
      user_id: user1.user_id,
      name: 'AliMansoori',
      server_id: 1,
      console_project_id: console_id,
      subdomain: 'alimansoori71',
      plan_id: 2,
      reply: {},
    })

    for (const user of [user2, user3]) {
      await addUserToWorkspace({
        workspace_id: workspace.workspace_id,
        user_id: user.user_id,
        invited_by_user_id: user1.user_id,
        ctx: undefined as any,
        reply: {},
      })
    }

    return { subdomain: workspace.subdomain, workspace_id: workspace.workspace_id, console_project_id: console_id }
    // });
  }
}
