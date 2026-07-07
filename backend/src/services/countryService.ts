import axios from 'axios'

interface CountryApiResponse {
  name: {
    common: string
    official: string
  }
  capital?: string[]
  region: string
  subregion?: string
  population: number
  flags: {
    png: string
    svg: string
  }
  currencies?: Record<
    string,
    {
      name: string
      symbol: string
    }
  >
  languages?: Record<string, string>
}

export async function getCountryInfo(country: string) {
  try {
    const baseUrl =
      process.env.REST_COUNTRIES_URL ??
      'https://restcountries.com/v3.1'

    const { data } = await axios.get(
      `${baseUrl}/name/${encodeURIComponent(country)}?fullText=true`
    )

    if (!data.length) {
      throw new Error('País não encontrado.')
    }

    const countryData = data[0]

    return {
      name: countryData.name.common,
      officialName: countryData.name.official,
      capital: countryData.capital?.[0] ?? null,
      region: countryData.region,
      subregion: countryData.subregion ?? null,
      population: countryData.population,
      flag: countryData.flags.png,
      flagSvg: countryData.flags.svg,
      currencies: countryData.currencies ?? {},
      languages: countryData.languages ?? {}
    }

  } catch (error) {
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