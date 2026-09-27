import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/auth/auth-context'
import { AuthCard, Field, FormAlert } from '@/components/AuthCard'
import { Button } from '@/components/ui/button'
import { toFormErrors, validateEmail, type FormErrors } from '@/lib/auth-errors'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({ fields: {} })
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedEmail = email.trim()
    const fields = {
      email: validateEmail(trimmedEmail),
      password: password ? undefined : 'La contraseña es obligatoria.',
    }
    if (fields.email || fields.password) {
      setErrors({ fields })
      return
    }

    setSubmitting(true)
    setErrors({ fields: {} })
    try {
      await login({ email: trimmedEmail, password })
      navigate('/profile', { replace: true })
    } catch (error) {
      setErrors(toFormErrors(error, 'login'))
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Inicia sesión"
      description="Accede a tu cuenta de FlowSync."
      footer={
        <p>
          ¿No tienes cuenta?{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Regístrate
          </Link>
        </p>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <FormAlert message={errors.form} />
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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.fields.password}
        />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthCard>
  )
}
