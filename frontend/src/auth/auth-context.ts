import { createContext, useContext } from 'react'
import type { LoginInput, SignupInput, User } from '@/lib/api'

export type AuthContextValue = {
  token: string | null
  login: (input: LoginInput) => Promise<User>
  signup: (input: SignupInput) => Promise<User>
  logout: () => Promise<void>
  /** Drops the local session without calling the backend (e.g. after a 401). */
  clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
