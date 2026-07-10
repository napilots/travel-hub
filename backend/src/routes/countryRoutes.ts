import { FastifyInstance } from 'fastify'
import { getCountry } from '../controllers/countryController.js'

export default async function countryRoutes(app: FastifyInstance) {
  app.get('/:country', getCountry)
}