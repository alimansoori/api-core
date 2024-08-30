import { ConfigValidator } from '@app/lib/config.validator.js'
import { generateJwtKeyPair, getJwtPrivateKey, getJwtPublicKey } from '@app/lib/security.js'
import { APP_CONFIG } from '@app/utility/config/app.config.js'
import { config } from 'dotenv-flow'
import { resolve, join } from 'path'
import { container } from 'tsyringe'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const runtimeEnvs = () => {
  const configValidator = container.resolve(ConfigValidator)
  const base = resolve(__dirname, '../')

  //* ************************************\\  Config .env file  //************************************* */
  config({
    path: resolve(base, '../'),
    silent: true,
  })

  //* ************************************\\  Runtime ENVs  //************************************* */
  configValidator.set({
    BASE_DIR: base,
    UNICLIENT_USERS_PATH: 'users',
    UPLOAD_PATH: join(__dirname, '/../../public'),
    APP_VER: '1.0.0',
  })

  //* ************************************\\  Prepare App Functions  //************************************* */
  generateJwtKeyPair()
  configValidator.set({
    JWT_PRIVATE_KEY: getJwtPrivateKey(),
    JWT_PUBLIC_KEY: getJwtPublicKey(),
  })

  //* ************************************\\  Check and validate configs  //************************************* */
  configValidator.init(APP_CONFIG)
}
