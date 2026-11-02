interface PaginacionProps {
  page: number
  totalPages: number
  total: number
  onChange: (page: number) => void
}

export default function Paginacion({ page, totalPages, total, onChange }: PaginacionProps) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4 text-sm">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 disabled:opacity-40"
      >
        ← Anterior
      </button>
      <span className="text-stone-600">
        Página {page} de {totalPages} — {total} libros
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md border border-stone-300 bg-white px-3 py-1.5 disabled:opacity-40"
      >
        Siguiente →
      </button>
    </div>
  )
}
