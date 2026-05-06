import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '../services/api'

const STATUS_STEPS = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'OutForDelivery', 'Delivered']

const STATUS_LABEL = {
  Pending:       'Order Received',
  Confirmed:     'Confirmed',
  Preparing:     'Being Prepared',
  Ready:         'Ready for Pickup',
  OutForDelivery:'Out for Delivery',
  Delivered:     'Delivered',
  Cancelled:     'Cancelled',
}

const STATUS_COLOR = {
  Pending:        'var(--brown)',
  Confirmed:      'var(--brown)',
  Preparing:      'var(--red)',
  Ready:          'var(--green)',
  OutForDelivery: 'var(--red)',
  Delivered:      'var(--green)',
  Cancelled:      'var(--gray)',
}

export default function OrderStatus() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  async function fetchOrder() {
    try {
      setOrder(await getOrder(id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchOrder()
    // Poll every 30s while order is active
    const interval = setInterval(() => {
      if (order && (order.status === 'Delivered' || order.status === 'Cancelled')) return
      fetchOrder()
    }, 30000)
    return () => clearInterval(interval)
  }, [id])

  if (error) {
    return (
      <div className="page text-center">
        <div className="section-banner mb-8"><h2>Order Status</h2></div>
        <p className="error-msg max-w-md mx-auto">{error}</p>
        <Link to="/menu" className="btn btn-primary mt-4">Back to Menu</Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="page text-center">
        <div className="section-banner mb-8"><h2>Order Status</h2></div>
        <div className="spinner" />
      </div>
    )
  }

  const isCancelled = order.status === 'Cancelled'
  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="page max-w-2xl mx-auto">
      <div className="section-banner mb-8"><h2>Order #{order.id}</h2></div>

      {/* Status card */}
      <div className="card p-6 mb-6 text-center">
        <p className="text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--gray)', fontFamily: 'var(--font-ui)' }}>
          Status
        </p>
        <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: STATUS_COLOR[order.status] }}>
          {STATUS_LABEL[order.status] ?? order.status}
        </p>

        {/* Progress bar — hidden if cancelled */}
        {!isCancelled && (
          <div className="flex items-center justify-between mt-6 gap-1">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-4 h-4 rounded-full border-2 transition-colors"
                  style={{
                    background:   i <= currentStep ? 'var(--red)' : 'var(--gray-light)',
                    borderColor:  i <= currentStep ? 'var(--red-dark)' : 'var(--gray-light)',
                  }}
                />
                {i < STATUS_STEPS.length - 1 && (
                  <div className="w-full h-0.5 mt-1.5 -mb-2.5 absolute" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="card p-6 mb-6">
        <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
          Items
        </h3>
        <div className="flex flex-col gap-3">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div>
                <p className="font-semibold" style={{ color: 'var(--black)' }}>
                  {item.name}
                  {item.size && <span className="font-normal ml-1" style={{ color: 'var(--gray)' }}>({item.size})</span>}
                  {' '}× {item.quantity}
                </p>
                {item.specialInstructions && (
                  <p className="text-xs italic mt-0.5" style={{ color: 'var(--brown)' }}>
                    {item.specialInstructions}
                  </p>
                )}
              </div>
              <span className="font-semibold whitespace-nowrap" style={{ color: 'var(--brown)' }}>
                ${item.lineTotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t-2 mt-4 pt-4 flex justify-between"
             style={{ borderColor: 'var(--gray-light)' }}>
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
            ${order.total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Delivery info */}
      <div className="card p-6 text-sm" style={{ color: 'var(--brown)' }}>
        <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
          Delivery Details
        </h3>
        <p><strong>Name:</strong> {order.customerName}</p>
        <p className="mt-1"><strong>Phone:</strong> {order.customerPhone}</p>
        {order.customerEmail && <p className="mt-1"><strong>Email:</strong> {order.customerEmail}</p>}
        <p className="mt-1"><strong>Address:</strong> {order.customerAddress}</p>
        <p className="mt-1"><strong>Placed:</strong> {new Date(order.placedAt).toLocaleString()}</p>
      </div>

      <div className="text-center mt-8">
        <Link to="/menu" className="btn btn-secondary">Back to Menu</Link>
      </div>
    </div>
  )
}
