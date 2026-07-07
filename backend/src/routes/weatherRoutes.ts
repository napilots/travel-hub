import { FastifyInstance } from 'fastify'

import { getWeatherByCity } from '../controllers/weatherController.js'

export default async function weatherRoutes(app: FastifyInstance) {
  app.get('/:city', getWeatherByCity)
}