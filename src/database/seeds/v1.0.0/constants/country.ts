import { Prisma } from '@prisma/client'
import CountriesList from 'countries-list'

export const countries = () => {
  const model: Prisma.countryCreateArgs['data'][] = []

  for (const country in CountriesList.countries) {
    const countryData: CountriesList.Country = CountriesList.countries[country as keyof typeof CountriesList.countries]

    model.push({
      name: countryData.name,
      native_name: countryData.native,
      emoji: countryData.emoji,
      alpha_2: country,
      phone_code: countryData?.phone.split(',')[0],
      /*       currency: countryData?.currency && countryData?.currency.length ? {
        connect: { code: countryData?.currency },
      } : undefined,
      language: countryData?.languages?.length ? {
        connectOrCreate: countryData?.languages.map(i => ({
          where: { alpha_2: i },
          create: { alpha_2: i },
        })),
      } : undefined,
 */
    })
  }

  return model
}
