import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { obtenerLibro } from '../services/books'
import { solicitarPrestamo } from '../services/loans'
import { loanSchema, type LoanFormData } from '../schemas/loanSchema'
import { useAuthStore } from '../stores/authStore'
import { extraerMensajeError } from '../lib/errors'
import type { Book } from '../types'

export default function PaginaDetalleLibro() {
  const { id } = useParams()
  const usuario = useAuthStore((s) => s.usuario)
  const [libro, setLibro] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormData>({ resolver: zodResolver(loanSchema), defaultValues: { days: 7 } })

  const cargarLibro = useCallback(() => {
    obtenerLibro(Number(id))
      .then(setLibro)
      .catch((err) => setError(extraerMensajeError(err)))
  }, [id])

  useEffect(cargarLibro, [cargarLibro])

  const onSubmit = async ({ days }: LoanFormData) => {
    setMensaje(null)
    try {
      const prestamo = await solicitarPrestamo(Number(id), days)
      setMensaje({ tipo: 'ok', texto: `Préstamo registrado. Devuélvelo antes del ${prestamo.due_date}.` })
      cargarLibro()
    } catch (err) {
      setMensaje({ tipo: 'error', texto: extraerMensajeError(err) })
    }
  }

  if (error) {
    return (
      <p role="alert" className="rounded-md bg-rose-50 px-4 py-3 text-rose-700">
        {error}
      </p>
    )
  }

  if (!libro) return <div className="h-48 animate-pulse rounded-lg bg-stone-200" />

  return (
    <article className="max-w-2xl">
      <Link to="/" className="text-sm text-amber-700 hover:underline">
        ← Volver al catálogo
      </Link>
      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-amber-700">{libro.category}</p>
      <h1 className="font-serif text-3xl font-semibold">{libro.title}</h1>
      <p className="text-lg text-stone-600">{libro.author}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:w-80">
        <dt className="text-stone-500">Año</dt>
        <dd>{libro.year ?? '—'}</dd>
        <dt className="text-stone-500">Ejemplares disponibles</dt>
        <dd data-testid="stock">{libro.stock}</dd>
      </dl>

      {usuario?.rol === 'MIEMBRO' && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-8 rounded-lg border border-stone-200 bg-white p-5"
        >
          <h2 className="font-medium">Pedir prestado</h2>
          <label htmlFor="days" className="mt-3 block text-sm text-stone-600">
            Días de préstamo
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="days"
              type="number"
              min={1}
              max={14}
              {...register('days')}
              className="w-24 rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isSubmitting || libro.stock === 0}
              className="rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-50"
            >
              Pedir prestado
            </button>
          </div>
          {errors.days && <p className="mt-2 text-sm text-rose-600">{errors.days.message}</p>}
          {libro.stock === 0 && <p className="mt-2 text-sm text-stone-500">No hay ejemplares disponibles.</p>}
          {mensaje && (
            <p
              role={mensaje.tipo === 'error' ? 'alert' : 'status'}
              className={`mt-3 rounded-md px-3 py-2 text-sm ${
                mensaje.tipo === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {mensaje.texto}
            </p>
          )}
        </form>
      )}
    </article>
  )
}
