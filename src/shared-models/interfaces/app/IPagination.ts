export interface IPaginationReq {
  /**
   * @minimum 1
   * @maximum 100
   * @example 10
   * @default 10
   */
  limit?: number
  page?: number
  /**
   * @default true
   * @example true
   */
  pagination: boolean
}
export interface IUniclientPaginationReq {
  limit?: number
  page?: number
}

export interface IPaginationDBModel {
  limit: number
  offset: number
}

export interface IPaginationRes {
  limit?: number
  page?: number
  total?: number
  totalPages?: number
  offset: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}
