import axios from 'axios'

const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 5000
})

interface WeatherResponse {
  weather: {
    main: string
    description: string
    icon: string
  }[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  wind: {
    speed: number
  }
  name: string
}

export async function getWeather(city: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      throw new Error('OPENWEATHER_API_KEY não configurada.')
    }

    const { data } = await weatherClient.get<WeatherResponse>(
      '/data/2.5/weather',
      {
        params: {
          q: city,
          units: 'metric',
          lang: 'pt_br',
          appid: apiKey
        }
      }
    )

    return {
      city: data.name,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      minTemperature: data.main.temp_min,
      maxTemperature: data.main.temp_max,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    }

  } catch (error) {
    const axiosError = error as any
    console.error('[Weather API] Error:', {
      status: axiosError?.response?.status,
      timeout: axiosError?.code === 'ECONNABORTED',
      city
    })

    return {
      city,
      temperature: null,
      feelsLike: null,
      minTemperature: null,
      maxTemperature: null,
      humidity: null,
      windSpeed: null,
      weather: 'unknown',
      description: 'Sem dados meteorológicos',
      icon: null
    }
  }
}