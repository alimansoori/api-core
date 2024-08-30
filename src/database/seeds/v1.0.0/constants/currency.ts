import { Prisma } from '@prisma/client'
import CurrencyList from '../../../../utility/currencies/index.js'

export const currencies = () => {
  const model: Prisma.currencyCreateManyArgs['data'] = []
  const currencies = CurrencyList.getAll()

  for (const keyCode in currencies) {
    const { code, name, symbol, symbol_native } = currencies[keyCode]
    if (!code) continue
    model.push({
      code,
      name,
      symbol,
      symbol_native,
    })
  }

  return model
}
