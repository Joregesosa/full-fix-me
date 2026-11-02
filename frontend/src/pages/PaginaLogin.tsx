import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { loginSchema, type LoginFormData } from '../schemas/loginSchema'
import { login } from '../services/auth'
import { useAuthStore } from '../stores/authStore'
import { extraerMensajeError } from '../lib/errors'

export default function PaginaLogin() {
  const setAuth = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (datos: LoginFormData) => {
    setErrorServidor(null)
    try {
      const { token, usuario } = await login(datos)
      setAuth(token, usuario)
      navigate('/', { replace: true })
    } catch (err) {
      setErrorServidor(extraerMensajeError(err))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-8 shadow-sm"
      >
        <h1 className="font-serif text-2xl font-semibold text-amber-800">Biblioteca Comunitaria</h1>
        <p className="mb-6 text-sm text-stone-500">Inicia sesión para continuar</p>

        <label htmlFor="email" className="block text-sm font-medium">
          Correo
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-amber-500"
        />
        {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}

        <label htmlFor="password" className="mt-4 block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-amber-500"
        />
        {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>}

        {errorServidor && (
          <p role="alert" className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorServidor}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-amber-700 py-2 font-medium text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}
