import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

const loanSchema = z.object({
  bookId: z.number().int().positive(),
  days: z.number().int().min(1).max(14),
})

export function validateLoan(req: Request, res: Response, next: NextFunction) {
  const result = loanSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: z.treeifyError(result.error) })
  }
  next()
}
