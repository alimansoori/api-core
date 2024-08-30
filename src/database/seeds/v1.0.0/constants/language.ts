import { Prisma } from '@prisma/client'
// import CountryDataList from 'country-data-list';
import CountriesList from 'countries-list'
// import { getAllCountries,getTimezone } from 'countries-and-timezones';

export const languages = () => {
  const model: Prisma.languageCreateManyArgs['data'] = []
  const convertedLanguages: { [key: string]: CountriesList.Language } = CountriesList.languagesAll

  for (const lang in convertedLanguages) {
    const { name, native, rtl }: CountriesList.Language = convertedLanguages[lang]

    model.push({
      name,
      is_rtl: !!rtl,
      native_name: native,
      alpha_2: lang,
    })
  }

  return model
}
