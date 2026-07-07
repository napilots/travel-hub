import { z } from 'zod'

export const createTripSchema = z.object({
  title: z
    .string({
      required_error: 'O título é obrigatório.'
    })
    .trim()
    .min(3, 'O título deve possuir pelo menos 3 caracteres.')
    .max(100, 'O título deve possuir no máximo 100 caracteres.'),

  destination: z
    .string({
      required_error: 'O destino é obrigatório.'
    })
    .trim()
    .min(2, 'O destino deve possuir pelo menos 2 caracteres.')
    .max(100),

  country: z
    .string({
      required_error: 'O país é obrigatório.'
    })
    .trim()
    .min(2)
    .max(100),

  city: z
    .string({
      required_error: 'A cidade é obrigatória.'
    })
    .trim()
    .min(2)
    .max(100),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),

  budget: z.coerce
    .number()
    .positive('O orçamento deve ser maior que zero.'),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal(''))
})

export const updateTripSchema = createTripSchema.partial()

export const tripIdSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
})

export type CreateTripDTO = z.infer<typeof createTripSchema>
export type UpdateTripDTO = z.infer<typeof updateTripSchema>
export type TripIdDTO = z.infer<typeof tripIdSchema>