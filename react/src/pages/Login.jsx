import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { token, user } = await loginUser(form)
      login(token, user)
      navigate('/menu')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page flex items-center justify-center min-h-[70vh]">
      <div className="card w-full max-w-md p-8">
        <h2 className="text-3xl text-center mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
          Welcome Back
        </h2>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--brown)' }}>
          Sign in to your account
        </p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password" required
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg mt-2" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--brown)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--red)', fontWeight: 600 }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
