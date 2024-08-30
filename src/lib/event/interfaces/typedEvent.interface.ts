export type Listener<T> = (data: T) => any

export interface ListenerItem<K, V> {
  event: K
  listener: V
}

export interface Disposable {
  dispose(): void
}
