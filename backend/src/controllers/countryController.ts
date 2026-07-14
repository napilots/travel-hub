import { FastifyReply, FastifyRequest } from 'fastify'
import { getCountryInfo } from '../services/countryService.js'

interface Params {
  country: string
}

export async function getCountry(
  request: FastifyRequest<{ Params: Params }>,
  reply: FastifyReply
) {
  const { country } = request.params

  const countryInfo = await getCountryInfo(country)

  return reply.status(200).send(countryInfo)
}