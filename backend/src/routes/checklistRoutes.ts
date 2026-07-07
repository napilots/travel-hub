import { FastifyInstance } from 'fastify'

import {
  createChecklist,
  getAllChecklists,
  getChecklistById,
  updateChecklist,
  deleteChecklist
} from '../controllers/checklistController.js'

export default async function checklistRoutes(app: FastifyInstance) {
  app.get('/', getAllChecklists)

  app.get('/:id', getChecklistById)

  app.post('/', createChecklist)

  app.put('/:id', updateChecklist)

  app.delete('/:id', deleteChecklist)
}