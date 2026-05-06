import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartItem({ item, index, onUpdateQuantity, onRemove }) {
  const { menuItem, quantity, specialInstructions } = item
  const lineTotal = menuItem.price * quantity

  return (
    <div className="card p-4 flex gap-4 items-start">
      <div className="text-4xl flex-shrink-0">🍕</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-base leading-tight"
               style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
              {menuItem.name}
            </p>
            {menuItem.size && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--gray)' }}>{menuItem.size}</p>
            )}
            {specialInstructions && (
              <p className="text-xs mt-1 italic" style={{ color: 'var(--brown)' }}>
                {specialInstructions}
              </p>
            )}
          </div>
          <span className="font-bold whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--brown)' }}>
            ${lineTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(index, quantity - 1)}
              className="w-7 h-7 rounded-md border-2 font-bold text-sm flex items-center justify-center"
              style={{ borderColor: 'var(--brown)', color: 'var(--brown)' }}
            >−</button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(index, quantity + 1)}
              className="w-7 h-7 rounded-md border-2 font-bold text-sm flex items-center justify-center"
              style={{ borderColor: 'var(--brown)', color: 'var(--brown)' }}
            >+</button>
          </div>

          <button
            onClick={() => onRemove(index)}
            className="text-xs font-semibold"
            style={{ color: 'var(--red)', fontFamily: 'var(--font-ui)' }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Cart() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart()

  if (itemCount === 0) {
    return (
      <div className="page text-center">
        <div className="section-banner mb-8"><h2>Your Cart</h2></div>
        <div className="empty-state">
          <p className="text-5xl mb-4">🛒</p>
          <h3>Your cart is empty</h3>
          <p className="mt-2 mb-6">Add some pizzas from the menu to get started.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="section-banner mb-8"><h2>Your Cart</h2></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item, i) => (
            <CartItem
              key={i}
              item={item}
              index={i}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        {/* Order summary */}
        <div className="card p-6 flex flex-col gap-4">
          <h3 className="text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
            Order Summary
          </h3>

          <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--brown)' }}>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.menuItem.name} × {item.quantity}</span>
                <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 pt-4 flex justify-between items-center"
               style={{ borderColor: 'var(--gray-light)' }}>
            <span className="font-semibold" style={{ fontFamily: 'var(--font-ui)' }}>Total</span>
            <span className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
              ${total.toFixed(2)}
            </span>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-lg text-center">
            Proceed to Checkout
          </Link>

          <Link to="/menu" className="btn btn-secondary text-center" style={{ boxShadow: 'none' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
