import type { Request, Response } from 'express'
import { createLoan, getLoanById, getLoansByUser, OutOfStockError } from '../models/loan.model.js'

export async function getMyLoans(req: Request, res: Response) {
  /* #swagger.tags = ['Loans']
     #swagger.summary = 'Préstamos del usuario autenticado'
     #swagger.security = [{ "bearerAuth": [] }] */
  try {
    const loans = await getLoansByUser(req.user!.id)
    res.json(loans)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los préstamos' })
  }
}

export async function getLoan(req: Request, res: Response) {
  /* #swagger.tags = ['Loans']
     #swagger.summary = 'Detalle de un préstamo'
     #swagger.security = [{ "bearerAuth": [] }] */
  try {
    const loan = await getLoanById(Number(req.params.id))
    if (!loan || (req.user!.role === 'MIEMBRO' && loan.user_id !== req.user!.id)) {
      return res.status(404).json({ message: 'Préstamo no encontrado' })
    }
    res.json(loan)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener el préstamo' })
  }
}

export async function addLoan(req: Request, res: Response) {
  /* #swagger.tags = ['Loans']
     #swagger.summary = 'Registra un préstamo para el usuario autenticado (solo MIEMBRO)'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: { "application/json": { example: { bookId: 1, days: 7 } } }
     } */
  try {
    const { bookId, days } = req.body
    const loan = await createLoan(req.user!.id, bookId, days)
    if (!loan) {
      return res.status(404).json({ message: 'Libro no encontrado' })
    }
    res.status(201).json(loan)
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return res.status(409).json({ message: 'No hay ejemplares disponibles de este libro' })
    }
    console.error(error)
    res.status(500).json({ message: 'Error al registrar el préstamo' })
  }
}
