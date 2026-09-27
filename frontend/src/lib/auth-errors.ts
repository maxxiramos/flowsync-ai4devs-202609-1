import { ApiError } from './api'

export type FieldErrors = Partial<Record<string, string>>

export type FormErrors = {
  /** Message shown above the form (not tied to a field). */
  form?: string
  fields: FieldErrors
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const NETWORK_MESSAGE =
  'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'
const GENERIC_MESSAGE = 'Algo salió mal. Inténtalo de nuevo en unos segundos.'

/** Spanish copy for the VineJS rules the auth validators can trigger. */
function messageForRule(
  field: string,
  rule: string | undefined,
  fallback?: string,
) {
  if (field === 'email') {
    if (rule?.includes('unique')) return 'Ya existe una cuenta con este email.'
    if (rule === 'required') return 'El email es obligatorio.'
    if (rule === 'maxLength') return 'El email no puede superar 254 caracteres.'
    return 'Introduce un email válido.'
  }
  if (field === 'password') {
    if (rule === 'required') return 'La contraseña es obligatoria.'
    if (rule === 'minLength')
      return 'La contraseña debe tener al menos 8 caracteres.'
    if (rule === 'maxLength')
      return 'La contraseña no puede superar 32 caracteres.'
  }
  if (field === 'passwordConfirmation') {
    if (rule === 'sameAs') return 'Las contraseñas no coinciden.'
    return 'Confirma tu contraseña.'
  }
  return fallback ?? GENERIC_MESSAGE
}

export function validateEmail(email: string) {
  if (!email) return 'El email es obligatorio.'
  if (!EMAIL_PATTERN.test(email)) return 'Introduce un email válido.'
  if (email.length > 254) return 'El email no puede superar 254 caracteres.'
  return undefined
}

export function validateNewPassword(password: string) {
  if (!password) return 'La contraseña es obligatoria.'
  if (password.length < 8)
    return 'La contraseña debe tener al menos 8 caracteres.'
  if (password.length > 32)
    return 'La contraseña no puede superar 32 caracteres.'
  return undefined
}

/** Turns anything thrown by the API client into user-facing messages. */
export function toFormErrors(
  error: unknown,
  context: 'login' | 'signup' | 'profile',
): FormErrors {
  if (!(error instanceof ApiError)) return { form: GENERIC_MESSAGE, fields: {} }
  if (error.status === 0) return { form: NETWORK_MESSAGE, fields: {} }

  // AdonisJS answers E_INVALID_CREDENTIALS with a bare 400 and no error code.
  if (context === 'login' && error.status === 400) {
    return { form: 'Email o contraseña incorrectos.', fields: {} }
  }

  if (error.status === 422) {
    const fields: FieldErrors = {}
    for (const [field, fieldError] of Object.entries(error.fieldErrors)) {
      fields[field] = messageForRule(field, fieldError.rule, fieldError.message)
    }
    if (Object.keys(fields).length > 0) return { fields }
  }

  if (error.status === 429) {
    return {
      form: 'Demasiados intentos. Espera un momento y vuelve a probar.',
      fields: {},
    }
  }

  return { form: GENERIC_MESSAGE, fields: {} }
}
