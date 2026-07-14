import axios from 'axios'

const countryCache = new Map<string, any>()

const restCountriesApiUrl =
  process.env.REST_COUNTRIES_URL ??
  'https://api.restcountries.com'

const restCountriesApiKey =
  process.env.REST_COUNTRIES_API_KEY ??
  'rc_live_demo'

const countryClient = axios.create({
  baseURL: restCountriesApiUrl,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${restCountriesApiKey}`
  }
})

interface CountryApiResponse {
  names: {
    common: string
    official: string
  }
  capitals?: { name: string }[]
  region?: string
  subregion?: string
  population?: number
  flag?: {
    url_png?: string
    url_svg?: string
  }
  currencies?: {
    code?: string
    name?: string
    symbol?: string
  }[]
  languages?: {
    bcp47?: string
    name?: string
  }[]
}

export async function getCountryInfo(country: string) {
  try {
    const cacheKey = country.toLowerCase().trim()
    const cached = countryCache.get(cacheKey)
    if (cached) return cached

    const { data } = await countryClient.get(
      `/countries/v5/names.common/${encodeURIComponent(country)}?response_fields=names,capitals,region,subregion,population,flag,currencies,languages`
    )

    const countryObjects =
      Array.isArray(data?.data?.objects)
        ? data.data.objects
        : Array.isArray(data?.objects)
          ? data.objects
          : Array.isArray(data)
            ? data
            : []

    if (countryObjects.length === 0) {
      throw new Error('País não encontrado.')
    }

    const countryData = countryObjects[0] as CountryApiResponse

    const result = {
      name: countryData.names?.common ?? country,
      officialName: countryData.names?.official ?? null,
      capital: countryData.capitals?.[0]?.name ?? null,
      region: countryData.region ?? null,
      subregion: countryData.subregion ?? null,
      population: countryData.population ?? null,
      flag: countryData.flag?.url_png ?? null,
      flagSvg: countryData.flag?.url_svg ?? null,
      currencies: Array.isArray(countryData.currencies)
        ? Object.fromEntries(countryData.currencies.map(currency => [
            currency.code ?? currency.name ?? 'unknown',
            { name: currency.name ?? '', symbol: currency.symbol ?? '' }
          ]))
        : {},
      languages: Array.isArray(countryData.languages)
        ? Object.fromEntries(countryData.languages.map(language => [
            language.bcp47 ?? language.name ?? 'unknown',
            language.name ?? ''
          ]))
        : {}
    }

    countryCache.set(cacheKey, result)
    return result
  } catch (error) {
    console.error('[Country API] Error:', error)
    return {
      name: country,
      officialName: null,
      capital: null,
      region: null,
      subregion: null,
      population: null,
      flag: null,
      flagSvg: null,
      currencies: {},
      languages: {}
    }
  }
}