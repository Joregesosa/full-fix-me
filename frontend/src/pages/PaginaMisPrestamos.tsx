import { useEffect, useState } from 'react'
import { obtenerMisPrestamos } from '../services/loans'
import { extraerMensajeError } from '../lib/errors'
import type { Loan } from '../types'

export default function PaginaMisPrestamos() {
  const [prestamos, setPrestamos] = useState<Loan[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    obtenerMisPrestamos()
      .then(setPrestamos)
      .catch((err) => setError(extraerMensajeError(err)))
      .finally(() => setCargando(false))
  }, [])

  return (
    <section>
      <h1 className="mb-6 font-serif text-3xl font-semibold">Mis préstamos</h1>

      {cargando && <div className="h-32 animate-pulse rounded-lg bg-stone-200" />}

      {error && (
        <p role="alert" className="rounded-md bg-rose-50 px-4 py-3 text-rose-700">
          {error}
        </p>
      )}

      {!cargando && !error && prestamos.length === 0 && (
        <p className="text-stone-500">Todavía no tienes préstamos.</p>
      )}

      {!cargando && !error && prestamos.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 text-stone-600">
              <tr>
                <th className="px-4 py-2 font-medium">Libro</th>
                <th className="px-4 py-2 font-medium">Prestado</th>
                <th className="px-4 py-2 font-medium">Devolver antes del</th>
                <th className="px-4 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
                <tr key={p.id} className="border-t border-stone-100">
                  <td className="px-4 py-2">
                    <span className="font-medium">{p.title}</span>
                    <span className="block text-stone-500">{p.author}</span>
                  </td>
                  <td className="px-4 py-2">{p.loan_date}</td>
                  <td className="px-4 py-2">{p.due_date}</td>
                  <td className="px-4 py-2">
                    {p.returned_at ? (
                      <span className="text-stone-500">Devuelto</span>
                    ) : (
                      <span className="text-amber-700">Activo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
