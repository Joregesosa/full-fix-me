import { Link } from 'react-router'

export default function PaginaSinAcceso() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-stone-50 px-4 text-center">
      <h1 className="font-serif text-2xl font-semibold">No tienes acceso a esta sección</h1>
      <p className="text-stone-600">Tu rol no tiene permiso para ver esta página.</p>
      <Link to="/" className="text-amber-700 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
