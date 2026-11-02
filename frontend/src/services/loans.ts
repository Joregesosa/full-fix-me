import { api } from '../lib/axios'
import type { Loan } from '../types'

export async function obtenerMisPrestamos() {
  const { data } = await api.get<Loan[]>('/loans/me')
  return data
}

export async function solicitarPrestamo(bookId: number, days: number) {
  const { data } = await api.post<Loan>('/loans', { bookId, days })
  return data
}
