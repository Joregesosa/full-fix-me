import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { useBooksStore } from '../stores/booksStore'
import BookCard from '../components/BookCard'
import Paginacion from '../components/Paginacion'

export default function PaginaCatalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') ?? ''

  const libros = useBooksStore((s) => s.libros)
  const total = useBooksStore((s) => s.total)
  const totalPages = useBooksStore((s) => s.totalPages)
  const cargando = useBooksStore((s) => s.cargando)
  const error = useBooksStore((s) => s.error)
  const cargar = useBooksStore((s) => s.cargar)

  const [texto, setTexto] = useState(search)

  useEffect(() => {
    cargar({ page, search })
  }, [cargar, search])

  const buscar = (e: FormEvent) => {
    e.preventDefault()
    const params: Record<string, string> = { page: '1' }
    if (texto.trim()) params.search = texto.trim()
    setSearchParams(params)
  }

  const cambiarPagina = (nueva: number) => {
    const params: Record<string, string> = { page: String(nueva) }
    if (search) params.search = search
    setSearchParams(params)
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">Catálogo</h1>
        <form onSubmit={buscar} className="flex gap-2">
          <input
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por título o autor"
            aria-label="Buscar"
            className="w-64 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
          />
          <button type="submit" className="rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800">
            Buscar
          </button>
        </form>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-rose-50 px-4 py-3 text-rose-700">
          No se pudo cargar el catálogo: {error}
        </p>
      )}

      {cargando && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
      )}

      {!cargando && !error && libros.length === 0 && (
        <p className="text-stone-500">No se encontraron libros.</p>
      )}

      {!cargando && !error && libros.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {libros.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {!error && <Paginacion page={page} totalPages={totalPages} total={total} onChange={cambiarPagina} />}
    </section>
  )
}
