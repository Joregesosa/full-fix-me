import { z } from 'zod'

export const loanSchema = z.object({
  days: z.number().int().min(1, 'Mínimo 1 día').max(14, 'Máximo 14 días'),
})

export type LoanFormData = z.infer<typeof loanSchema>
