import { randomBytes } from 'crypto'

export default class E2EE {
  private _key!: string
  constructor() {
    this.renew()
  }
  private generate() {
    return ('10000000-1000' + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) => {
      const [randomValue] = randomBytes(10) as any

      // eslint-disable-next-line no-bitwise
      return (c ^ (randomValue & (15 >> (c / 4)))).toString(16)
    })
  }

  public renew() {
    this._key = this.generate()
  }

  get key() {
    return this._key
  }
}
