import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from './auth-context'

/** Only renders its children with a session; otherwise sends the user to /login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}

/** Login and signup screens make no sense with an active session. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  if (token) return <Navigate to="/profile" replace />
  return children
}
