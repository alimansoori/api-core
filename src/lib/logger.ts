/* eslint-disable no-console */
import Sentry from '@sentry/node'
import { colors } from '@app/utility/constants/index.js'
// import { isDevelopment, isProduction, isStaging, stringifyObject } from '@app/utility/helpers/index.js';
import { isProduction, isStaging, stringifyObject } from '@app/utility/helpers/index.js'
import { config, addColors, createLogger, transports, format } from 'winston'
import LokiTransport from 'winston-loki'
import { getConfigs } from '@app/lib/config.validator.js'
import { container, singleton } from 'tsyringe'

export const consoleColorize = (val: string, color: keyof typeof colors) => {
  return `${colors[color]}${val}${colors.reset}`
}

@singleton()
class Winston {
  createWinston = (data: { lokiTransport: boolean }) => {
    addColors({ ...config.syslog.colors, critical: config.syslog.colors.error })
    const crtLog = createLogger({
      levels: {
        critical: 1,
        error: 2,
        warning: 3,
        info: 4,
        debug: 4,
      },
    })

    const transportFormats: ReturnType<(typeof format)['combine']>[] = [
      format((log) => {
        log.originalLevel = log.level
        log.level = '[' + log.level.toUpperCase() + ']'
        return log
      })(),
      format.colorize({ level: true }),
      format.printf(({ message, level }) => `${level} ${message}`),
      format((log) => {
        log.level = log.originalLevel
        return log
      })(),
    ]

    crtLog.add(
      new transports.Console({
        format: format.combine(
          format((log) => {
            if (log.noConsole) return false
            return log
          })(),
          ...transportFormats,
        ),
      }),
    )

    if (data.lokiTransport) {
      const labels: Record<string, any> = {
        app: 'Coffee',
        origin: getConfigs().IS_MEDIASERVER ? 'media-server' : 'api-backend',
      }

      if (['localic.com', 'alimansoori71.ir'].includes(getConfigs().PRIMARY_SERVER_DOMAIN)) {
        labels.server_domain = getConfigs().PRIMARY_SERVER_DOMAIN
      }

      crtLog.add(
        new LokiTransport({
          host: 'http://0.0.0.0:3100',
          labels,
          json: true,
          format: format.combine(...transportFormats),
          replaceTimestamp: true,
          onConnectionError: (err) => console.error(err),
        }),
      )
    }

    return crtLog
  }

  logger = this.createWinston({ lokiTransport: isProduction() || isStaging() })
}

export const logger = {
  error: (error: any, options?: { req?: any; msg?: any }, tags?: string[]): void => {
    const winston = container.resolve(Winston)
    // console.error('�', `${consoleColorize('ERROR | ', 'red')}`, error ? stringifyObject(error) : error);

    winston.logger.log('error', {
      message: typeof error === 'string' ? error : stringifyObject(error),
      labels: tags?.length ? { tags: tags.toString() } : undefined,
    })

    Sentry.captureException(error instanceof Error ? error : new Error(error))
  },

  log: (arg: any, tags?: string[], options?: { noConsole?: boolean }): void => {
    const winston = container.resolve(Winston)
    // console.log('� ', consoleColorize('LOG |', 'green'), ...args);

    winston.logger.log('info', {
      message: typeof arg === 'string' ? arg : stringifyObject(arg),
      labels: tags?.length ? { tags: tags.toString() } : undefined,
      noConsole: options?.noConsole,
    })
  },

  remoteLog: (arg: any): void => {
    const winston = container.resolve(Winston)
    // if (isStaging() || isProduction()) {
    Sentry.captureMessage(typeof arg === 'string' ? arg : stringifyObject(arg))
    // } else console.log('� ', consoleColorize('REMOTE LOG |', 'green'), arg);

    winston.logger.log('info', {
      message: typeof arg === 'string' ? arg : stringifyObject(arg),
    })
  },

  debug: (msg: any, tags?: string[], options?: { noConsole?: boolean }): void => {
    const winston = container.resolve(Winston)
    // if (isDevelopment()) console.debug('� ', consoleColorize('DEBUG |', 'yellow'), msg);

    winston.logger.log('debug', {
      message: typeof msg === 'string' ? msg : stringifyObject(msg),
      labels: tags?.length ? { tags: tags.toString() } : undefined,
      noConsole: options?.noConsole,
    })
  },

  info: (msg: any): void => {
    const winston = container.resolve(Winston)
    // console.info('� ', consoleColorize('INFO |', 'cyan'), msg);

    // if (msg instanceof Object || msg instanceof Array) {
    //   console.log('� ', consoleColorize('LOG |', 'green'), JSON.stringify(msg));
    // }

    winston.logger.log('info', {
      message: typeof msg === 'string' ? msg : stringifyObject(msg),
    })
  },

  warning: (msg: any): void => {
    const winston = container.resolve(Winston)
    // console.warn('� ', consoleColorize('WARNING |', 'yellow'), msg);

    // if (msg instanceof Object || msg instanceof Array) {
    //   console.log('� ', consoleColorize('LOG |', 'green'), JSON.stringify(msg));
    // }

    winston.logger.log('warning', {
      message: typeof msg === 'string' ? msg : stringifyObject(msg),
    })
  },

  critical: (msg: any): void => {
    const winston = container.resolve(Winston)
    // if (isDevelopment()) {
    //   console.log('� ', consoleColorize('CRITICAL |', 'red'), msg);
    // }

    // if (msg instanceof Object || msg instanceof Array) {
    //   console.log('� ', consoleColorize('LOG |', 'green'), JSON.stringify(msg));
    // }

    Sentry.captureException(msg)

    winston.logger.log('critical', {
      message: typeof msg === 'string' ? msg : stringifyObject(msg),
    })
  },
}
