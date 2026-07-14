import prisma from '../lib/prisma.js'
import { deleteImage } from '../utils/uploadImage.js'
import { getCountryInfo } from './countryService.js'
import { getWeather } from './weatherService.js'

import type {
  CreateTripDTO,
  UpdateTripDTO
} from '../schemas/tripSchema.js'

export async function createTrip(
  data: CreateTripDTO,
  imageUrl: string | null
) {
  return prisma.trip.create({
    data: {
      ...data,
      imageUrl
    }
  })
}

export async function getAllTrips(page: number = 1, limit: number = 20) {
  const maxLimit = 100
  const normalizedLimit = Math.min(limit, maxLimit)
  const skip = (page - 1) * normalizedLimit

  const trips = await prisma.trip.findMany({
    include: {
      checklists: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take: normalizedLimit
  })

  const total = await prisma.trip.count()
  const pages = Math.ceil(total / normalizedLimit)

  const tripsWithInfo = await Promise.allSettled(
    trips.map(async (trip) => {
      const results = await Promise.allSettled([
        getCountryInfo(trip.country),
        getWeather(trip.city)
      ])

      const countryInfo = results[0].status === 'fulfilled' 
        ? results[0].value 
        : {
            name: trip.country,
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

      const weather = results[1].status === 'fulfilled'
        ? results[1].value
        : {
            city: trip.city,
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

      return {
        ...trip,
        countryInfo,
        weather
      }
    })
  )

  return {
    data: tripsWithInfo
      .filter(result => result.status === 'fulfilled')
      .map(result => result.status === 'fulfilled' ? result.value : null)
      .filter(Boolean),
    pagination: {
      page,
      limit: normalizedLimit,
      total,
      pages
    }
  }
}

export async function getTripById(id: number) {
  const trip = await prisma.trip.findUnique({
    where: {
      id
    },
    include: {
      checklists: true
    }
  })

  if (!trip) {
    throw new Error('Viagem não encontrada.')
  }

  const results = await Promise.allSettled([
    getCountryInfo(trip.country),
    getWeather(trip.city)
  ])

  const countryInfo = results[0].status === 'fulfilled'
    ? results[0].value
    : {
        name: trip.country,
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

  const weather = results[1].status === 'fulfilled'
    ? results[1].value
    : {
        city: trip.city,
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

  return {
    ...trip,
    countryInfo,
    weather
  }
}

export async function updateTrip(
  id: number,
  data: UpdateTripDTO,
  imageUrl?: string | null
) {
  const trip = await prisma.trip.findUnique({
    where: {
      id
    }
  })

  if (!trip) {
    throw new Error('Viagem não encontrada.')
  }

  try {
    const updatedTrip = await prisma.trip.update({
      where: {
        id
      },
      data: {
        ...data,
        imageUrl: imageUrl ?? trip.imageUrl
      }
    })

    if (imageUrl && trip.imageUrl) {
      try {
        deleteImage(trip.imageUrl)
      } catch (error) {
        console.error('Erro ao deletar imagem antiga:', error)
      }
    }

    return updatedTrip
  } catch (error) {
    throw error
  }
}

export async function deleteTrip(id: number) {
  const trip = await prisma.trip.findUnique({
    where: {
      id
    }
  })

  if (!trip) {
    throw new Error('Viagem não encontrada.')
  }

  deleteImage(trip.imageUrl)

  await prisma.trip.delete({
    where: {
      id
    }
  })

  return {
    message: 'Viagem removida com sucesso.'
  }
}