import { z } from 'zod'

export const createChecklistSchema = z.object({
  title: z
    .string({
      required_error: 'O título é obrigatório.'
    })
    .trim()
    .min(2, 'O título deve conter pelo menos 2 caracteres.')
    .max(150, 'O título deve conter no máximo 150 caracteres.'),

  tripId: z.coerce
    .number()
    .int()
    .positive('O ID da viagem é inválido.')
})

export const updateChecklistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .optional(),

  completed: z
    .boolean()
    .optional()
})

export const checklistIdSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive('ID inválido.')
})

export type CreateChecklistDTO = z.infer<typeof createChecklistSchema>
export type UpdateChecklistDTO = z.infer<typeof updateChecklistSchema>
export type ChecklistIdDTO = z.infer<typeof checklistIdSchema>