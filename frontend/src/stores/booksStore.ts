import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { obtenerLibros, type FiltrosLibros } from '../services/books'
import { extraerMensajeError } from '../lib/errors'
import type { Book } from '../types'

interface BooksState {
  libros: Book[]
  total: number
  totalPages: number
  cargando: boolean
  error: string | null
  cargar: (filtros: FiltrosLibros) => Promise<void>
}

export const useBooksStore = create<BooksState>()(
  devtools(
    (set) => ({
      libros: [],
      total: 0,
      totalPages: 1,
      cargando: false,
      error: null,
      cargar: async (filtros) => {
        set({ cargando: true, error: null })
        try {
          const res = await obtenerLibros(filtros)
          set({ libros: res.data, total: res.total, totalPages: res.totalPages, cargando: false })
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false })
        }
      },
    }),
    { name: 'BooksStore' }
  )
)
