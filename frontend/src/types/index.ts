export type Rol = 'ADMIN' | 'MIEMBRO'

export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: Rol
}

export interface Book {
  id: number
  title: string
  author: string
  category: string
  year: number | null
  stock: number
}

export interface Loan {
  id: number
  user_id: number
  book_id: number
  title: string
  author: string
  loan_date: string
  due_date: string
  returned_at: string | null
}

export interface RespuestaPaginada<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}
