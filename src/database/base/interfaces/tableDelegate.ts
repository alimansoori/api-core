export interface TableDelegate {
  aggregate(data: unknown): unknown
  count(data: unknown): unknown
  create(data: unknown): unknown
  delete(data: unknown): unknown
  deleteMany(data: unknown): unknown
  findFirst(data: unknown): unknown
  findMany(data: unknown): unknown
  findUnique(data: unknown): unknown
  update(data: unknown): unknown
  updateMany(data: unknown): unknown
  upsert(data: unknown): unknown
}

export interface CrudTypeMap {
  aggregate: unknown
  count: unknown
  create: unknown
  delete: unknown
  deleteMany: unknown
  findFirst: unknown
  findMany: unknown
  findUnique: unknown
  update: unknown
  updateMany: unknown
  upsert: unknown
}
