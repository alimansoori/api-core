import { ISeedUp } from '@app/interfaces/prisma/seedUpItem.js'
import { PrismaClient } from '@prisma/client'
import { currencyList } from '../../../utility/currencies/currency-list.js'

export default <ISeedUp>{
  up: async (prisma: PrismaClient) => {
    const allCurrencyKeys = Object.keys(currencyList)

    for (const key in currencyList) {
      if (currencyList[key].code) {
        await prisma.currency.upsert({
          where: {
            code: currencyList[key].code,
          },
          create: {
            code: currencyList[key].code,
            name: currencyList[key].name,
            symbol: currencyList[key].symbol,
            symbol_native: currencyList[key].symbol_native,
            decimal_digits: currencyList[key].decimal_digits,
          },
          update: {
            code: currencyList[key].code,
            name: currencyList[key].name,
            symbol: currencyList[key].symbol,
            symbol_native: currencyList[key].symbol_native,
            decimal_digits: currencyList[key].decimal_digits,
          },
        })
      }

      await prisma.currency.deleteMany({
        where: {
          code: {
            notIn: allCurrencyKeys,
          },
        },
      })
    }
  },
}
