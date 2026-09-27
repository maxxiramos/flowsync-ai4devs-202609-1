const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export type User = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string | null
  initials: string
}

export type AuthResponse = {
  user: User
  token: string
}

export type SignupInput = {
  fullName?: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export type LoginInput = {
  email: string
  password: string
}

type BackendError = {
  message?: string
  field?: string
  rule?: string
}

/**
 * Error thrown for any non-2xx response or network failure.
 * `status` is 0 when the backend could not be reached.
 */
export class ApiError extends Error {
  readonly status: number
  readonly errors: BackendError[]

  constructor(status: number, errors: BackendError[], message?: string) {
    super(message ?? errors[0]?.message ?? `Request failed (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }

  /** Validation errors keyed by field (first message wins). */
  get fieldErrors(): Record<string, BackendError> {
    const byField: Record<string, BackendError> = {}
    for (const error of this.errors) {
      if (error.field && !byField[error.field]) byField[error.field] = error
    }
    return byField
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
}

async function apiFetch<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1/${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, [], 'Network error')
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const errors =
      payload && typeof payload === 'object' && 'errors' in payload
        ? (payload.errors as BackendError[])
        : []
    throw new ApiError(response.status, Array.isArray(errors) ? errors : [])
  }

  return (payload as { data: T }).data
}

export function signup(input: SignupInput) {
  return apiFetch<AuthResponse>('auth/signup', { method: 'POST', body: input })
}

export function login(input: LoginInput) {
  return apiFetch<AuthResponse>('auth/login', { method: 'POST', body: input })
}

export function getProfile(token: string) {
  return apiFetch<User>('account/profile', { token })
}

export function logout(token: string) {
  return apiFetch<unknown>('account/logout', { method: 'POST', token })
}
