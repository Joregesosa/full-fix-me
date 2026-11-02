import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

const bookSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
  category: z.string().trim().min(1),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  stock: z.number().int().min(0),
})

export function validateBook(req: Request, res: Response, next: NextFunction) {
  const result = bookSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ message: 'Datos inválidos', errors: z.treeifyError(result.error) })
  }
  next()
}
