import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/api'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', password: '', confirmPassword: ''
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const { token, user } = await registerUser({
        name:     form.name,
        phone:    form.phone,
        email:    form.email,
        address:  form.address,
        password: form.password,
      })
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
          Create Account
        </h2>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--brown)' }}>
          Join Mac's Pizza today
        </p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name" name="name" required
              value={form.name} onChange={handleChange}
              placeholder="John Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone" name="phone" type="tel" required
              value={form.phone} onChange={handleChange}
              placeholder="(555) 555-5555"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <input
              id="address" name="address" required
              value={form.address} onChange={handleChange}
              placeholder="123 Main St, City, State"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password" required
              value={form.confirmPassword} onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg mt-2" disabled={submitting}>
            {submitting ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--brown)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--red)', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
