import { FastifyRequest, FastifyReply } from 'fastify'
import { getWeather } from '../services/weatherService.js'

interface Params {
  city: string
}

export async function getWeatherByCity(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  try {
    const { city } = request.params

    const weather = await getWeather(city)

    return reply.send(weather)
  } catch (error) {
    return reply.status(500).send({
      message: 'Erro ao buscar clima.'
    })
  }
}