import { Disposable, Listener, ListenerItem } from './interfaces/typedEvent.interface.js'

export default class TypedEvent<EvD, EvT extends keyof EvD> {
  private listeners: ListenerItem<EvT, Listener<EvD[EvT]>>[] = []
  private listenersOnce = new Map<EvT, Listener<EvD[EvT]>>()

  on = <T extends EvT>(event: T, listener: Listener<EvD[T]>): Disposable => {
    this.listeners.push({
      event,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      listener,
    })
    return {
      dispose: () => this.off(event),
    }
  }

  once = <T extends EvT>(event: T, listener: Listener<EvD[T]>): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.listenersOnce.set(event, listener)
  }

  off = (event: EvT) => {
    this.listeners = this.listeners.filter((listenerItem) => listenerItem.event !== event)
  }

  emit = <T extends EvT>(event: T, data: EvD[T]) => {
    this.listeners
      .filter((listenerItem) => listenerItem.event === event)
      .forEach((listenerItem) => {
        listenerItem.listener(data)
      })

    if (this.listenersOnce.size > 0) {
      const toCall = this.listenersOnce.get(event)
      toCall?.(data)
      this.listenersOnce.delete(event)
    }
  }
}
