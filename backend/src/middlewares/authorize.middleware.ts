import type { Request, Response, NextFunction } from 'express'
import type { AuthPayload } from './auth.middleware.js'

export function authorize(...roles: AuthPayload['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' })
    }
    next()
  }
}
