import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import rateLimit from '@fastify/rate-limit'
import { ZodError } from 'zod'

import tripRoutes from './routes/tripRoutes.js'
import checklistRoutes from './routes/checklistRoutes.js'
import weatherRoutes from './routes/weatherRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = Fastify({
  logger: true
})

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

await app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
})

await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  allowList: ['127.0.0.1'],
  redis: undefined,
  skipOnError: true,
  keyGenerator: (request) => {
    return request.ip
  }
})

await app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'uploads'),
  prefix: '/uploads/'
})

app.get('/', async () => {
  return {
    message: 'TravelHub API',
    version: '1.0.0',
    status: 'online'
  }
})


await app.register(tripRoutes, {
  prefix: '/trips'
})

await app.register(checklistRoutes, {
  prefix: '/checklists'
})

await app.register(weatherRoutes, {
  prefix: '/weather'
})


app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Erro de validação.',
      errors: error.flatten()
    })
  }

  request.log.error(error)

  return reply.status(500).send({
    message: 'Erro interno do servidor.'
  })
})

const PORT = Number(process.env.PORT) || 3333

const start = async () => {
  try {
    await app.listen({
      port: PORT,
      host: '0.0.0.0'
    })

    console.log(`🚀 TravelHub em http://localhost:${PORT}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()