import axios from 'axios'

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

    const { data } = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
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
  console.error('Erro ao buscar clima:', error);

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