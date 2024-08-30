import { mainRouter } from '@app/api/index.js'
import { errorHandler } from '@app/core/error/errorHandler.js'
import removeUnusedSocketDataFromRedis from '@app/core/removeSocketRecords.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { FirebaseAdmin } from '@app/lib/integrations/firebase/firebaseApp.js'
import { logger } from '@app/lib/logger.js'
import { getJwtKeyDirPath } from '@app/lib/security.js'
import swagger from '@app/utility/config/swagger.js'
import { ajvCoerceKeyword } from '@app/utility/constants/index.js'
import { initHelpers } from '@app/utility/helpers/globalHelper/globalHelper.js'
import { isProduction, isStaging } from '@app/utility/helpers/index.js'
import { initService } from '@app/utility/services/globalServices.js'
import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import { fastifySchedule } from '@fastify/schedule'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import EventEmitter from 'events'
import Fastify, { FastifyInstance } from 'fastify'
import fastifyRawBody from 'fastify-raw-body'
import fs, { mkdirSync } from 'fs'
import 'isomorphic-fetch'
import * as PhoneNumberValidator from 'libphonenumber-js'
import path, { join } from 'path'
import { SimpleIntervalJob } from 'toad-scheduler'
import { container } from 'tsyringe'
import { fileURLToPath, pathToFileURL } from 'url'
import { initialMiddleware } from './middleware/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function loadTasks(fastify: FastifyInstance) {
  const modulesPath = path.join(__dirname, '..', 'api', 'v1');
  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const moduleName of modules) {
    const tasksPath = path.join(modulesPath, moduleName, 'tasks');
    if (fs.existsSync(tasksPath)) {
      const taskFiles = fs.readdirSync(tasksPath).filter(file => file.endsWith('.task.js'));

      for (const taskFile of taskFiles) {
        const taskUrl = pathToFileURL(path.join(tasksPath, taskFile)).href;
        const taskModule = await import(taskUrl);
        console.log(taskModule);

        if (taskModule.default) {
          const { task, interval } = taskModule.default;
          const job = new SimpleIntervalJob(interval, task);

          fastify.scheduler.addSimpleIntervalJob(job);
        }
      }
    }
  }
}

// start application
export const createApp = async () => {
  EventEmitter.defaultMaxListeners = 20
  initHelpers()
  initService()
  //* ************************************\\  Default Directories  //************************************* */
  const { UPLOAD_PATH, UNICLIENT_USERS_PATH } = getConfigs()
  mkdirSync(UPLOAD_PATH, { recursive: true })
  mkdirSync(join(UPLOAD_PATH, UNICLIENT_USERS_PATH), { recursive: true })
  mkdirSync(getJwtKeyDirPath(), { recursive: true })

  //* ************************************\\  Initialize Fastify  //************************************* */

  const fastify = Fastify({
    trustProxy: true,
    ignoreTrailingSlash: true,
    serializerOpts: { ajv: {} },
    ajv: {
      customOptions: {
        formats: {
          float: true,
          'phone-number': (data: string) => {
            return PhoneNumberValidator.isValidPhoneNumber(data)
          },
          'contact-number': (data: string) => {
            return new RegExp(/\+\d+/g).test(data)
          },
        },
        keywords: [ajvCoerceKeyword, 'example'],
        coerceTypes: true,
        allErrors: true,
        removeAdditional: true,
        strict: false,
      },
    },
    logger:
      isProduction() || isStaging()
        ? false
        : {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        },
  })

  fastify.register(fastifySwagger, swagger)
  fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  await fastify.register(fastifyRawBody, {
    field: 'rawBody',
    global: false,
    encoding: false, // false will set rawBody as a Buffer
    runFirst: true,
  })

  fastify.register(cookie, {} as FastifyCookieOptions)
  fastify.setErrorHandler(errorHandler)

  //* ************************************\\  Initialize Firebase  //************************************* */
  if (!getConfigs().PUSH_NOTIFICATION_DISABLED) container.resolve(FirebaseAdmin)

  //* ******************************\\  Remove socket records from redis  //****************************** */
  await removeUnusedSocketDataFromRedis()

  //* ************************************\\  Initialize middleware  //************************************* */
  await initialMiddleware(fastify)

  //* ************************************\\  Routes  //************************************* */
  const { ILYACLIENT_API_PATH } = getConfigs()
  fastify.register(mainRouter, { prefix: ILYACLIENT_API_PATH })

  fastify.setSerializerCompiler(() => {
    return (data: any) => JSON.stringify(data)
  })

  fastify.register(fastifySchedule);

  fastify.ready().then(async () => {
    await loadTasks(fastify);
    logger.info('All tasks are loaded and scheduled.')
  })

  return { app: fastify }
}
