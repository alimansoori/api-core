/* eslint-disable no-process-env */
import { IEnvironment } from '@app/interfaces/environment/index.js'
import { PartialRecord } from '@app/shared-models/index.js'
import { IEnvironmentSchema } from '@app/utility/schema/environment.schema.js'
import * as Ajv from 'ajv'
import { container, inject, singleton } from 'tsyringe'
import { logger } from './logger.js'
import { AjvValidation } from './validation.js'
import { generateJwtKeyPair, getJwtPrivateKey, getJwtPublicKey } from './security.js'
import { join, resolve } from 'path'
import { APP_CONFIG } from '@app/utility/config/app.config.js'
import { config } from 'dotenv-flow'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

@singleton()
export class ConfigValidator {
  public keys!: IEnvironment
  private ajv: Ajv.default
  constructor(@inject(AjvValidation) private ajvClass: AjvValidation) {
    this.ajv = this.ajvClass.getAjvInstance()
  }

  public init(customData: {} = {}) {
    this.keys = { ...process.env, ...customData, ...this.keys }

    this.jsonSchemaValidator(this.keys, true)
  }

  private jsonSchemaValidator(data: any, strict: boolean) {
    const validate = this.ajv.compile(IEnvironmentSchema)
    validate(data)

    if (validate.errors?.length && strict) {
      logger.error(validate.errors)
      throw new Error('🚨 Config validation error')
    }

    return data
  }

  set(obj: PartialRecord<keyof IEnvironment, any>) {
    this.keys = {
      ...this.keys,
      ...obj,
    }
  }
}

export const getConfigs = () => {
  const validator = container.resolve(ConfigValidator)
  const base = resolve(__dirname, '../')

  if (!validator.keys) {
    config({
      path: resolve(base, '../'),
      silent: true,
    })

    //* ************************************\\  Runtime ENVs  //************************************* */
    validator.set({
      BASE_DIR: base,
      UNICLIENT_USERS_PATH: 'users',
      UPLOAD_PATH: join(__dirname, '/../../public'),
      APP_VER: '1.0.0',
    })

    //* ************************************\\  Prepare App Functions  //************************************* */
    generateJwtKeyPair()
    validator.set({
      JWT_PRIVATE_KEY: getJwtPrivateKey(),
      JWT_PUBLIC_KEY: getJwtPublicKey(),
    })

    //* ************************************\\  Check and validate configs  //************************************* */
    validator.init(APP_CONFIG)
  }

  return validator.keys
}
