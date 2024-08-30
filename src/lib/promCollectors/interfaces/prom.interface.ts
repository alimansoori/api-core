import { Gauge, Histogram } from 'prom-client'

export type PromCollectorTypes = 'gauge' | 'histogram'
export type PromCollectorName = 'worker_usage' | 'worker_count'

export interface PromCollectorItem<T extends PromCollectorTypes> {
  id: string
  name: string
  help: string
  type: T
  labelNames?: string[]
}

export interface PromCollectorWithInstance<T extends PromCollectorTypes> extends PromCollectorItem<T> {
  instance: T extends 'gauge' ? Gauge : Histogram
}
