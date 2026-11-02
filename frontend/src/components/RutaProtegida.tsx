import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthStore } from '../stores/authStore'
import type { Rol } from '../types'

interface RutaProtegidaProps {
  rolesPermitidos?: Rol[]
  children?: ReactNode
}

export default function RutaProtegida({ rolesPermitidos, children }: RutaProtegidaProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const usuario = useAuthStore((s) => s.usuario)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (rolesPermitidos && (!usuario || !rolesPermitidos.includes(usuario.rol))) {
    return <Navigate to="/sin-acceso" replace />
  }

  return <>{children}</>
}
