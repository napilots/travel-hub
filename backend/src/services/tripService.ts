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

export async function getAllTrips() {
  const trips = await prisma.trip.findMany({
    include: {
      checklists: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const tripsWithInfo = await Promise.all(
    trips.map(async (trip) => {
      const [countryInfo, weather] = await Promise.all([
        getCountryInfo(trip.country),
        getWeather(trip.city)
      ])

      return {
        ...trip,
        countryInfo,
        weather
      }
    })
  )

  return tripsWithInfo
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

  const [countryInfo, weather] = await Promise.all([
    getCountryInfo(trip.country),
    getWeather(trip.city)
  ])

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

  if (imageUrl) {
    deleteImage(trip.imageUrl)
  }

  return prisma.trip.update({
    where: {
      id
    },
    data: {
      ...data,
      imageUrl: imageUrl ?? trip.imageUrl
    }
  })
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