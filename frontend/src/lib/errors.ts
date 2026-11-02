import { isAxiosError } from 'axios'

export function extraerMensajeError(error: unknown): string {
  if (isAxiosError(error)) {
    const mensaje = error.response?.data?.message
    if (typeof mensaje === 'string') return mensaje
    if (error.response) return `Error ${error.response.status}`
    return 'No se pudo conectar con el servidor'
  }
  return 'Ocurrió un error inesperado'
}
