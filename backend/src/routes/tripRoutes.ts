import { FastifyInstance } from 'fastify'

import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip
} from '../controllers/tripController.js'

export default async function tripRoutes(app: FastifyInstance) {
  app.get('/', getAllTrips)

  app.get('/:id', getTripById)

  app.post('/', createTrip)

  app.put('/:id', updateTrip)

  app.delete('/:id', deleteTrip)
}