import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuthStore } from '../stores/authStore'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'
  }`

export default function Layout() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-serif text-xl font-semibold text-amber-800">Biblioteca Comunitaria</span>
            <nav className="flex gap-1">
              <NavLink to="/" end className={linkClass}>
                Catálogo
              </NavLink>
              {usuario?.rol === 'MIEMBRO' && (
                <NavLink to="/prestamos" className={linkClass}>
                  Mis préstamos
                </NavLink>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-600">
              {usuario?.nombre} <span className="text-stone-400">· {usuario?.rol}</span>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-stone-300 px-3 py-1.5 hover:bg-stone-100"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
