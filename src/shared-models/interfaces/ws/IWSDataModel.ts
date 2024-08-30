export type IWSDataModel<T, K extends keyof T> = {
  type: K
  data: T[K]
}
