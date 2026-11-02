import type { Request, Response } from 'express'
import { getAllBooks, getBookById, insertBook } from '../models/book.model.js'

export async function getBooks(req: Request, res: Response) {
  /* #swagger.tags = ['Books']
     #swagger.summary = 'Lista paginada de libros, con búsqueda por título o autor'
     #swagger.parameters['search'] = { in: 'query', type: 'string' }
     #swagger.parameters['page'] = { in: 'query', type: 'integer' }
     #swagger.parameters['limit'] = { in: 'query', type: 'integer' } */
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50)

    const { rows, total } = await getAllBooks({ search, page, limit })
    res.json({
      data: rows,
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los libros' })
  }
}

export async function getBook(req: Request, res: Response) {
  /* #swagger.tags = ['Books']
     #swagger.summary = 'Detalle de un libro' */
  try {
    const book = await getBookById(Number(req.params.id))
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' })
    }
    res.json(book)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener el libro' })
  }
}

export async function createBook(req: Request, res: Response) {
  /* #swagger.tags = ['Books']
     #swagger.summary = 'Registra un libro nuevo (solo ADMIN)'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
       required: true,
       content: { "application/json": { example: { title: "Rebelión en la granja", author: "George Orwell", category: "Novela", year: 1945, stock: 3 } } }
     } */
  try {
    const book = await insertBook(req.body)
    res.status(201).json(book)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al registrar el libro' })
  }
}
