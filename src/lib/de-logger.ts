import { isDevelopment, stringifyObject } from '@app/utility/helpers/index.js'
import { getConfigs } from './config.validator.js'
import { Log, LogLevel, MediaServerLog } from '@app/shared-models/index.js'
import { container } from 'tsyringe'
import { MediaServerLogDumper } from './logDumper/LogMediaServer/index.js'
import { logger } from './logger.js'

type LogSide = 'back' | 'front'
interface DeLoggerConfiguration {
  readonly state: string
  readonly side: LogSide
  readonly skipLogsForNamespaces: string[]
}

export class DeLogger {
  // Logger With Prefix - Can be Used in Classes as Static Property .
  private static configuration: DeLoggerConfiguration = {
    state: 'development',
    side: 'back',
    skipLogsForNamespaces: [],
  }
  public static BACKLOG: MediaServerLog[] = []
  private static readonly BACK_RESET: string = '\x1b[0m'
  private static readonly FRONT_RESET: string = '\x1b[30m'
  private static readonly FRONT_COLORS: string[] = [
    '#E53935',
    '#D81B60',
    '#8E24AA',
    '#5E35B1',
    '#1E88E5',
    '#00897B',
    '#43A047',
    '#F4511E',
    '#6D4C41',
    '#546E7A',
  ]
  private static readonly BACK_COLORS: string[] = [
    '\x1b[31m',
    '\x1b[32m',
    '\x1b[33m',
    '\x1b[34m',
    '\x1b[35m',
    '\x1b[36m',
    '\x1b[37m',
  ]
  private static readonly NAMESPACES: Map<string, string> = new Map()

  private mediaServerLogDumper = container.resolve(MediaServerLogDumper)
  private availableTags = (getConfigs().MEDIASERVER_DEBUG || '').split(',')
  private package: Log | null
  public meta!: Log['meta']
  private _isTagEnabled = false
  static dumpInterval: NodeJS.Timer | null = null

  public constructor(private readonly entry: { namespace: string; tags: string[] }) {
    this.package = null
    this._isTagEnabled = this.isTagEnabled()

    if (!DeLogger.NAMESPACES.has(this.entry.namespace)) {
      const { color } = DeLogger.getColor()
      DeLogger.NAMESPACES.set(this.entry.namespace, color)
    }
  }

  public static startDumpTimeout() {
    DeLogger.dumpInterval = setInterval(() => {
      if (DeLogger.BACKLOG.length > 0) {
        this.dump(true)
      }
    }, 5000)
  }

  private isTagEnabled() {
    if (isDevelopment() || this.availableTags.includes('*')) return true
    return this.entry.tags.some((q) => this.availableTags.includes(q))
  }

  private static getColor() {
    const size = DeLogger.NAMESPACES.size
    const palette = DeLogger.configuration.side === 'front' ? DeLogger.FRONT_COLORS : DeLogger.BACK_COLORS
    const index = size % palette.length
    const color: string = palette[index] || '\x1b[4m'

    return { color }
  }

  public log(message: string, meta: Log['meta'] = {}) {
    this.package = { message, meta: { ...this.meta, ...meta }, level: 'log', source: 'mediaserver' }

    this.writeToTerminal(message, this.package.meta, 'log')

    return this
  }

  public error(message: string, meta: Log['meta'] = {}) {
    this.package = { message, meta: { ...this.meta, ...meta }, level: 'error', source: 'mediaserver' }

    this.writeToTerminal(message, this.package.meta, 'error')

    return this
  }

  public save() {
    if (!this.package) throw Error('No log found to save.')

    const { message, meta, level, source } = this.package

    const time = new Date().getTime()

    DeLogger.BACKLOG.push({
      namespace: this.entry.namespace,
      tags: this.entry.tags,
      message,
      meta,
      level,
      time,
      source,
    })

    this.clearPackage()
  }

  private writeToTerminal(message: any, meta: Log['meta'], level: LogLevel) {
    const { namespace } = this.getNamespace()

    if (DeLogger.configuration.state !== 'production') {
      const preventLog = DeLogger.configuration.skipLogsForNamespaces.includes(this.entry.namespace)

      if ((!this._isTagEnabled || preventLog) && level !== 'error') {
        return
      }

      if (level === 'error') {
        logger.error(namespace + ' | ' + message + ' | ' + stringifyObject(meta))
        return this.mediaServerLogDumper.error(meta, namespace + '  \x1b[36m' + message + DeLogger.BACK_RESET)
      } else {
        logger.debug(namespace + ' | ' + message + ' | ' + stringifyObject(meta, { singleLine: true }), this.entry.tags, {
          noConsole: true,
        })
        return this.mediaServerLogDumper.log(meta, namespace + '  \x1b[36m' + message + DeLogger.BACK_RESET)
      }
    }
  }

  private clearPackage() {
    this.package = null
  }

  private getNamespace() {
    if (DeLogger.configuration.side === 'front') {
      const { namespace: rawNamespace } = this.entry
      const namespace = rawNamespace

      return { namespace }
    }

    const { namespace: rawNamespace } = this.entry
    const color = DeLogger.NAMESPACES.get(rawNamespace)
    const reset = DeLogger.configuration.side === 'back' ? DeLogger.BACK_RESET : DeLogger.FRONT_RESET
    const namespace = `${color}${rawNamespace}${reset}`

    return { namespace }
  }

  public static dump(clear?: boolean) {
    // if (!DeLogger.BACKLOG.length) return;
    // const mixpanel = container.resolve(Mixpanel);
    // mixpanel.sendBatch(
    //   DeLogger.BACKLOG.map((log) => {
    //     const { message, ...restLog } = log;
    //     return { event: message, properties: { ...restLog } };
    //   }),
    // );
    // if (clear) {
    //   DeLogger.BACKLOG = [];
    // }
  }

  public static setConfiguration(args: Partial<DeLoggerConfiguration>) {
    Object.assign(DeLogger.configuration, args)
  }
}
