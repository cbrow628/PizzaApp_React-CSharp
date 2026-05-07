import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/Fetch'

const STATUS_LABEL = {
  Pending:        'Order Received',
  Confirmed:      'Confirmed',
  Preparing:      'Being Prepared',
  Ready:          'Ready for Pickup',
  OutForDelivery: 'Out for Delivery',
  Delivered:      'Delivered',
  Cancelled:      'Cancelled',
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

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--gray)', fontFamily: 'var(--font-ui)' }}>
        {label}
      </p>
      <p className="font-medium" style={{ color: 'var(--black)', fontFamily: 'var(--font-ui)' }}>
        {value || '—'}
      </p>
    </div>
  )
}

function OrderCard({ order }) {
  const date = new Date(order.placedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const statusColor = STATUS_COLOR[order.status] ?? 'var(--gray)'
  const statusLabel = STATUS_LABEL[order.status] ?? order.status

  return (
    <Link
      to={`/order/${order.id}`}
      className="card p-5 flex justify-between items-center gap-4"
      style={{ display: 'flex', textDecoration: 'none', transition: 'transform 0.1s, box-shadow 0.1s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)', fontSize: '1.1rem' }}>
            Order #{order.id}
          </span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full border"
            style={{ color: statusColor, borderColor: statusColor, background: 'transparent', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap' }}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-sm truncate" style={{ color: 'var(--brown)', fontFamily: 'var(--font-ui)' }}>
          {order.items.map(i => i.name).join(', ')}
        </p>
        <p className="text-xs" style={{ color: 'var(--gray)', fontFamily: 'var(--font-ui)' }}>{date}</p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
          ${order.total.toFixed(2)}
        </span>
        <span className="text-xs" style={{ color: 'var(--gray)', fontFamily: 'var(--font-ui)' }}>
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </span>
      </div>
    </Link>
  )
}

export default function Account() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
  }, [user, navigate])

  const { data: orders, loading: ordersLoading } = useFetch(
    user ? `/order/account/${user.id}` : null,
    { token }
  )

  if (!user) return null

  const sortedOrders = orders
    ? [...orders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
    : []

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="page max-w-3xl mx-auto">
      <div className="section-banner mb-8"><h2>My Account</h2></div>

      {/* Account details card */}
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)', fontSize: '1.4rem' }}>
            Account Details
          </h3>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <InfoRow label="Name"    value={user.name} />
          <InfoRow label="Email"   value={user.email} />
          <InfoRow label="Phone"   value={user.phone} />
          <InfoRow label="Address" value={user.address} />
        </div>
      </div>

      {/* Order history */}
      <h3 className="mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)', fontSize: '1.6rem' }}>
        Order History
      </h3>

      {ordersLoading ? (
        <div className="spinner" />
      ) : sortedOrders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {sortedOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="empty-state card p-8">
          <h3>No orders yet</h3>
          <p className="mt-2 mb-6">Looks like you haven't ordered anything yet.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      )}
    </div>
  )
}
