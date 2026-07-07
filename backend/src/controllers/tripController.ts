import { FastifyRequest, FastifyReply } from 'fastify'

import {
  createTripSchema,
  updateTripSchema,
  tripIdSchema
} from '../schemas/tripSchema.js'

import {
  createTrip as createTripService,
  getAllTrips as getAllTripsService,
  getTripById as getTripByIdService,
  updateTrip as updateTripService,
  deleteTrip as deleteTripService
} from '../services/tripService.js'

import { uploadImage } from '../utils/uploadImage.js'

export async function createTrip(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parts = request.parts()

    const data: Record<string, unknown> = {}
    let imageUrl: string | null = null

    for await (const part of parts) {
      if (part.type === 'file') {
        imageUrl = await uploadImage(part)
      } else {
        if (part.fieldname === 'budget') {
          data[part.fieldname] = Number(part.value)
        } else {
          data[part.fieldname] = part.value
        }
      }
    }

    const tripData = createTripSchema.parse(data)

    const trip = await createTripService(tripData, imageUrl)

    return reply.status(201).send(trip)
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : 'Erro ao criar viagem.'
    })
  }
}

export async function getAllTrips(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const trips = await getAllTripsService()
    return reply.send(trips)
  } catch {
    return reply.status(500).send({
      message: 'Erro ao buscar viagens.'
    })
  }
}

export async function getTripById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = tripIdSchema.parse(request.params)
    const trip = await getTripByIdService(id)
    return reply.send(trip)
  } catch (error) {
    return reply.status(404).send({
      message: error instanceof Error ? error.message : 'Viagem não encontrada.'
    })
  }
}

export async function updateTrip(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = tripIdSchema.parse(request.params)
    const parts = request.parts()

    const data: Record<string, unknown> = {}
    let imageUrl: string | null = null

    for await (const part of parts) {
      if (part.type === 'file') {
        // Correção aplicada ao update também!
        imageUrl = await uploadImage(part)
      } else {
        if (part.fieldname === 'budget') {
          data[part.fieldname] = Number(part.value)
        } else {
          data[part.fieldname] = part.value
        }
      }
    }

    const tripData = updateTripSchema.parse(data)

    const trip = await updateTripService(id, tripData, imageUrl)

    return reply.send(trip)
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : 'Erro ao atualizar viagem.'
    })
  }
}

export async function deleteTrip(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = tripIdSchema.parse(request.params)
    const result = await deleteTripService(id)
    return reply.send(result)
  } catch (error) {
    return reply.status(404).send({
      message: error instanceof Error ? error.message : 'Erro ao excluir viagem.'
    })
  }
}