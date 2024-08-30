import { currencyList } from './currency-list.js'

class CurrencyList {
  currencyList: Record<
    string,
    {
      name: string
      symbol_native: string
      symbol: string
      code: string
      name_plural: string
      rounding: number
      decimal_digits: number
    }
  >

  constructor() {
    this.currencyList = currencyList
  }
  public getAll() {
    return this.currencyList
  }
  public get(currency_code: string) {
    return this.currencyList[currency_code]
  }
}

export default new CurrencyList()
