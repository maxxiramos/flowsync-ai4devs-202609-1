import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/auth/auth-context'
import { FormAlert } from '@/components/AuthCard'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiError, getProfile, type User } from '@/lib/api'
import { toFormErrors } from '@/lib/auth-errors'

type ProfileState =
  | { status: 'loading' }
  | { status: 'ready'; user: User }
  | { status: 'error'; message: string }

export function ProfilePage() {
  const { token, logout, clearSession } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState<ProfileState>({ status: 'loading' })
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    getProfile(token)
      .then((user) => {
        if (!cancelled) setState({ status: 'ready', user })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        // Expired or revoked token: drop it and let RequireAuth send us to /login.
        if (error instanceof ApiError && error.status === 401) {
          clearSession()
          return
        }
        setState({
          status: 'error',
          message:
            toFormErrors(error, 'profile').form ??
            'No se pudo cargar tu perfil.',
        })
      })
    return () => {
      cancelled = true
    }
  }, [token, clearSession])

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Tu perfil</CardTitle>
          <CardDescription>
            Datos de la cuenta con la que has iniciado sesión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.status === 'loading' && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Cargando perfil…
            </p>
          )}
          {state.status === 'error' && <FormAlert message={state.message} />}
          {state.status === 'ready' && (
            <div className="flex items-center gap-4">
              <div
                aria-hidden
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground"
              >
                {state.user.initials}
              </div>
              <dl className="grid min-w-0 gap-1 text-sm">
                <dt className="sr-only">Nombre</dt>
                <dd className="truncate font-medium">
                  {state.user.fullName ?? 'Sin nombre'}
                </dd>
                <dt className="sr-only">Email</dt>
                <dd className="truncate text-muted-foreground">
                  {state.user.email}
                </dd>
              </dl>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
