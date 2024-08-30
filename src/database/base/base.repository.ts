import Database from '@app/database/index.js'
import { Context } from '@app/interfaces/index.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { customAlphabet } from 'nanoid'

export class BaseRepository {
  constructor(
    protected repository: any,
    protected table_name: string,
  ) { }

  public getRepository() {
    return this.repository
  }

  public async findOne(data: any, ctx?: Context) {
    let result

    if (ctx?.prisma) {
      result = (ctx.prisma[this.table_name as keyof typeof ctx.prisma] as any).findUnique(data)
    } else {
      result = this.repository.findUnique(data)
    }

    return result
  }
  public _errorHandler = (err: any) => {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new Error((err.meta as any)?.target)
      } else if (err.code === 'P2017') {
        throw new Error(`${(err.meta as any)?.child_name} not found`)
      } else {
        throw err
      }
    }
  }

  public _transactionChecker = (db: Database, ctx?: Context) => {
    return ctx?.prisma ?? db.getPrisma()
  }

  public _makeId = (prefix?: string) => {
    const alphabets = '123456789abcdefghijklmnopqrstuvwxyz'
    return prefix + customAlphabet(alphabets, 12)()
  }

  public async _makeUniqueId(db: Database, table: string, field: string, prefix?: string, ctx?: Context) {
    let id: string
    do id = this._makeId(prefix)
    while (await (this._transactionChecker(db, ctx)[table as any] as any).findFirst({ where: { [field]: id } }))
    return id
  }
}
