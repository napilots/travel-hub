import { FastifyRequest, FastifyReply } from 'fastify'

import {
  createChecklistSchema,
  updateChecklistSchema,
  checklistIdSchema
} from '../schemas/checklistSchema.js'

import {
  createChecklist as createChecklistService,
  getAllChecklists as getAllChecklistsService,
  getChecklistById as getChecklistByIdService,
  updateChecklist as updateChecklistService,
  deleteChecklist as deleteChecklistService
} from '../services/checklistService.js'

export async function createChecklist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const data = createChecklistSchema.parse(request.body)

    const checklist = await createChecklistService(data)

    return reply.status(201).send(checklist)
  } catch (error) {
    return reply.status(400).send({
      message:
        error instanceof Error ? error.message : 'Erro ao criar checklist.'
    })
  }
}

export async function getAllChecklists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const checklists = await getAllChecklistsService()

    return reply.send(checklists)
  } catch {
    return reply.status(500).send({
      message: 'Erro ao buscar checklists.'
    })
  }
}

export async function getChecklistById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = checklistIdSchema.parse(request.params)

    const checklist = await getChecklistByIdService(id)

    return reply.send(checklist)
  } catch (error) {
    return reply.status(404).send({
      message:
        error instanceof Error ? error.message : 'Checklist não encontrado.'
    })
  }
}

export async function updateChecklist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = checklistIdSchema.parse(request.params)

    const data = updateChecklistSchema.parse(request.body)

    const checklist = await updateChecklistService(id, data)

    return reply.send(checklist)
  } catch (error) {
    return reply.status(400).send({
      message:
        error instanceof Error ? error.message : 'Erro ao atualizar checklist.'
    })
  }
}

export async function deleteChecklist(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = checklistIdSchema.parse(request.params)

    const result = await deleteChecklistService(id)

    return reply.send(result)
  } catch (error) {
    return reply.status(404).send({
      message:
        error instanceof Error ? error.message : 'Erro ao excluir checklist.'
    })
  }
}