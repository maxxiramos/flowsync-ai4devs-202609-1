import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/auth/auth-context'
import { AuthCard, Field, FormAlert } from '@/components/AuthCard'
import { Button } from '@/components/ui/button'
import {
  toFormErrors,
  validateEmail,
  validateNewPassword,
  type FormErrors,
} from '@/lib/auth-errors'

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<FormErrors>({ fields: {} })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedEmail = email.trim()
    const fields = {
      email: validateEmail(trimmedEmail),
      password: validateNewPassword(password),
      passwordConfirmation:
        password === passwordConfirmation
          ? undefined
          : 'Las contraseñas no coinciden.',
    }
    if (fields.email || fields.password || fields.passwordConfirmation) {
      setErrors({ fields })
      return
    }

    setSubmitting(true)
    setErrors({ fields: {} })
    try {
      await signup({
        fullName: fullName.trim() || null,
        email: trimmedEmail,
        password,
        passwordConfirmation,
      })
      navigate('/profile', { replace: true })
    } catch (error) {
      setErrors(toFormErrors(error, 'signup'))
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Crea tu cuenta"
      description="Regístrate con tu email para empezar a usar FlowSync."
      footer={
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <FormAlert message={errors.form} />
        <Field
          id="fullName"
          label="Nombre (opcional)"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={errors.fields.fullName}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.fields.email}
        />
        <Field
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.fields.password}
        />
        <Field
          id="passwordConfirmation"
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          error={errors.fields.passwordConfirmation}
        />
        <p className="-mt-2 text-xs text-muted-foreground">
          Entre 8 y 32 caracteres.
        </p>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthCard>
  )
}
