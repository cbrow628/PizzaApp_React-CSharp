import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../services/api'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const orderItems = items.map(item => {
      const numericId = parseInt(item.menuItem.id)
      return {
        pizzaId:             isNaN(numericId) ? null : numericId,
        name:                item.menuItem.name,
        size:                item.menuItem.size ?? '',
        quantity:            item.quantity,
        unitPrice:           item.menuItem.price,
        specialInstructions: item.specialInstructions || null,
      }
    })

    try {
      const order = await placeOrder({
        guestName:    form.name,
        guestPhone:   form.phone,
        guestEmail:   form.email || null,
        guestAddress: form.address,
        items:        orderItems,
      })
      clearCart()
      navigate(`/order/${order.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="page text-center">
        <div className="section-banner mb-8"><h2>Checkout</h2></div>
        <div className="empty-state">
          <p>Your cart is empty. <Link to="/menu" style={{ color: 'var(--red)' }}>Go back to the menu.</Link></p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="section-banner mb-8"><h2>Checkout</h2></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Order summary */}
        <div className="card p-6 flex flex-col gap-4">
          <h3 className="text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
            Order Summary
          </h3>

          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold" style={{ color: 'var(--black)' }}>
                    {item.menuItem.name}
                    {item.menuItem.size && (
                      <span className="font-normal ml-1" style={{ color: 'var(--gray)' }}>
                        ({item.menuItem.size})
                      </span>
                    )}
                    {' '}× {item.quantity}
                  </p>
                  {item.specialInstructions && (
                    <p className="text-xs italic mt-0.5" style={{ color: 'var(--brown)' }}>
                      {item.specialInstructions}
                    </p>
                  )}
                </div>
                <span className="whitespace-nowrap font-semibold" style={{ color: 'var(--brown)' }}>
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t-2 pt-4 flex justify-between items-center"
               style={{ borderColor: 'var(--gray-light)' }}>
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Guest info form */}
        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
          <h3 className="text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
            Your Details
          </h3>

          {error && <p className="error-msg">{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="John Smith" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="(555) 555-5555" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email <span style={{ color: 'var(--gray)', fontWeight: 400 }}>(optional)</span></label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <input id="address" name="address" required value={form.address} onChange={handleChange} placeholder="123 Main St, City, State" />
          </div>

          <button type="submit" className="btn btn-primary btn-lg mt-2" disabled={submitting}>
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  )
}
