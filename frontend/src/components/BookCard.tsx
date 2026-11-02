import { Link } from 'react-router'
import type { Book } from '../types'

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link
      to={`/libros/${book.id}`}
      className="flex flex-col rounded-lg border border-stone-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-amber-700">{book.category}</span>
      <h3 className="mt-1 font-serif text-lg font-semibold leading-snug">{book.title}</h3>
      <p className="text-sm text-stone-600">{book.author}</p>
      <p className={`mt-auto pt-3 text-sm ${book.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
        {book.stock > 0 ? `${book.stock} disponible(s)` : 'Sin ejemplares'}
      </p>
    </Link>
  )
}
