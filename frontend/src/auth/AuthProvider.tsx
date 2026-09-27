import { useCallback, useMemo, useState, type ReactNode } from 'react'
import * as api from '@/lib/api'
import { AuthContext, type AuthContextValue } from './auth-context'

const TOKEN_KEY = 'flowsync.token'

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage unavailable (private mode, blocked): the session lives in memory only.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken)

  const startSession = useCallback(({ token, user }: api.AuthResponse) => {
    writeToken(token)
    setToken(token)
    return user
  }, [])

  const clearSession = useCallback(() => {
    writeToken(null)
    setToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      login: async (input) => startSession(await api.login(input)),
      signup: async (input) => startSession(await api.signup(input)),
      logout: async () => {
        try {
          if (token) await api.logout(token)
        } catch {
          // The token may already be invalid; the local session is cleared anyway.
        } finally {
          clearSession()
        }
      },
      clearSession,
    }),
    [token, startSession, clearSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
