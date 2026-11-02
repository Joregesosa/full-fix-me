import { api } from '../lib/axios'
import type { Book, RespuestaPaginada } from '../types'

export interface FiltrosLibros {
  page: number
  search: string
}

export async function obtenerLibros({ page, search }: FiltrosLibros) {
  const { data } = await api.get<RespuestaPaginada<Book>>('/books', {
    params: { page, limit: 8, search: search || undefined },
  })
  return data
}

export async function obtenerLibro(id: number) {
  const { data } = await api.get<Book>(`/books/${id}`)
  return data
}
