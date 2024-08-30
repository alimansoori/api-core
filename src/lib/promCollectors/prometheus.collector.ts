import Database from '@app/database/index.js'
import promClient, { Gauge, Histogram } from 'prom-client'
import { inject, singleton } from 'tsyringe'
import { PromCollectorTypes } from './interfaces/prom.interface.js'
import { getConfigs } from '../config.validator.js'

@singleton()
export default class PrometheusCollector {
  constructor(@inject(Database) private db: Database) {}

  public init() {
    promClient.collectDefaultMetrics()

    setInterval(async () => {
      const metrics = await this.metrics()
      await this.db.getRedis().set('MS_METRICS', metrics)
    }, getConfigs().PROMETHEUS_INTERVAL_MS)
  }

  public addRedisCollector(type: PromCollectorTypes, name: string, help: string, labelNames?: string[]) {
    const data: promClient.GaugeConfiguration<string> = {
      name,
      help,
    }
    if (labelNames?.length) data.labelNames = labelNames

    switch (type) {
      case 'gauge':
        return new promClient.Gauge(data)
      default:
        break
    }
  }

  public async setGauge(instance?: Gauge, value: number = 0, labels: Record<string, string> = {}) {
    instance?.set(labels, value)
  }
  public async incGauge(instance?: Gauge) {
    instance?.inc()
  }
  public async decGauge(instance?: Gauge) {
    instance?.dec()
  }

  public async observeHistogram(instance?: Histogram, value: number = 0, labels: Record<string, string> = {}) {
    instance?.observe(labels, value)
  }

  public async removeByLabels(instance?: Gauge, labels: Record<string, string> = {}) {
    instance?.remove(labels)
  }

  public async metrics() {
    return promClient.register.metrics()
  }

  get contentType() {
    return promClient.contentType
  }

  get register() {
    return promClient.register
  }
}
