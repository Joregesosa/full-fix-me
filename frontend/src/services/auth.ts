import { api } from '../lib/axios'
import type { LoginFormData } from '../schemas/loginSchema'
import type { Usuario } from '../types'

export interface LoginResponse {
  token: string
  usuario: Usuario
}

export async function login(datos: LoginFormData): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', datos)
  return data
}
