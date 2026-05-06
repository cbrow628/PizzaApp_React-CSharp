import { useState } from 'react'
import { useFetch } from '../hooks/Fetch'
import { useCart } from '../context/CartContext'

// Static topping options — expand when the backend gains a toppings endpoint
const STATIC_TOPPINGS = {
  Size:   ['Small', 'Medium', 'Large'],
  Sauce:   ['Tomato', 'BBQ', 'Alfredo', 'Buffalo', 'Garlic Butter', 'Pesto'],
  Cheese:  ['Mozzarella', 'Parmesan', 'Feta', 'Cheddar', 'Ricotta'],
  Meat:    ['Pepperoni', 'Italian Sausage', 'Bacon', 'Canadian Bacon', 'Ham', 'Chicken'],
  Veggies: ['Mushrooms', 'Bell Peppers', 'Red Onions', 'Black Olives', 'Jalapeños'],
  Drizzles: ['Hot Sauce', 'Honey', 'Hot Honey', 'Balsamic']
}

const CYO_BASE = { id: 'cyo', name: 'Create Your Own Pizza', price: 8.99 }

// ─── Static Topping Selector ──────────────────────────────────────────────────
function ToppingSelector({ selected, onToggle, onSelect, priceMap = {} }) {
  return (
    <div className="flex flex-col gap-6">
      {Object.entries(STATIC_TOPPINGS).map(([group, toppings]) => {
        const isRadio = group === 'Sauce' || group === 'Size'
        return (
          <div key={group}>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-3 flex items-baseline gap-2"
                style={{ color: 'var(--brown)' }}>
              {group}
              {priceMap[group] != null && (
                <span className="text-xs font-normal normal-case tracking-normal"
                      style={{ color: 'var(--gray)' }}>
                  +${priceMap[group].toFixed(2)} each
                </span>
              )}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {toppings.map(name => {
                const checked = selected.includes(name)
                return (
                  <label
                    key={name}
                    className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border-2 transition-colors select-none"
                    style={{
                      borderColor: checked ? 'var(--red)' : 'var(--gray-light)',
                      background:  checked ? '#fdecea' : 'var(--white)',
                    }}
                  >
                    {isRadio ? (
                      <input
                        type="radio"
                        name="sauce"
                        className="accent-red-700 w-1/3"
                        checked={checked}
                        onChange={() => onSelect(name, group)}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        className="accent-red-700 w-1/3"
                        checked={checked}
                        onChange={() => onToggle(name)}
                      />
                    )}
                    <span className="text-sm" style={{ fontFamily: 'var(--font-ui)', color: 'var(--black)' }}>
                      {name}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Customize Modal ──────────────────────────────────────────────────────────
function CustomizeModal({ pizza, onClose, onAdd }) {
  const [selected, setSelected] = useState([])

  function toggle(name) {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(26,26,26,0.6)' }}
         onClick={onClose}>
      <div className="card w-full max-w-lg max-h-[90vh] flex flex-col"
           onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b-2"
             style={{ borderColor: 'var(--gray-light)' }}>
          <div>
            <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
              {pizza.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--brown)' }}>
              Customize your toppings
            </p>
          </div>
          <button onClick={onClose} className="text-2xl leading-none ml-4"
                  style={{ color: 'var(--gray)' }}>✕</button>
        </div>

        {/* Scrollable toppings */}
        <div className="overflow-y-auto p-6 flex-1">
          <ToppingSelector
            selected={selected}
            onToggle={toggle}
            onSelect={(name, group) =>
              setSelected(prev => [...prev.filter(n => !STATIC_TOPPINGS[group].includes(n)), name])
            }
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t-2"
             style={{ borderColor: 'var(--gray-light)' }}>
          <span className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
            ${pizza.price.toFixed(2)}
          </span>
          <button
            className="btn btn-primary"
            onClick={() => {
              onAdd(pizza, selected)
              onClose()
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

const SIZE_OFFSETS = { Small: 0, Medium: 1.50, Large: 3 }
const TOPPING_OFFSETS = { Cheese: .75, Meat: 1, Veggies: .5 }

// ─── Pizza Card ───────────────────────────────────────────────────────────────
function PizzaCard({ pizza, onAdd, onCustomize }) {
  const [size, setSize] = useState('Small')
  const [items, setItems] = useState([])

  const toppingTotal = items.reduce((sum, item) => sum + (TOPPING_OFFSETS[item] ?? 0), 0)
  const adjustedPrice = pizza.price + SIZE_OFFSETS[size] + toppingTotal
  const pizzaWithSize = { ...pizza, price: adjustedPrice, size, id: `${pizza.id}-${size}` }

  return (
    <div className="card flex flex-col">
      <div className="w-full h-40 flex items-center justify-center text-6xl"
           style={{ background: 'var(--cream-dark)' }}>
        🍕
      </div>
      <div className="p-5 flex flex-col flex-1 gap-2">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
            {pizza.name}
          </h3>
          <span className="text-lg font-bold whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--brown)' }}>
            ${adjustedPrice.toFixed(2)}
          </span>
        </div>

        {/* Size selector */}
        <div className="flex gap-1">
          {Object.keys(SIZE_OFFSETS).map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className="flex-1 py-1 text-xs font-semibold rounded-md border-2 transition-colors"
              style={{
                fontFamily: 'var(--font-ui)',
                borderColor: size === s ? 'var(--red)' : 'var(--gray-light)',
                background:  size === s ? '#fdecea' : 'var(--white)',
                color:       size === s ? 'var(--red-dark)' : 'var(--brown)',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Description */}
        {pizza.description && (
          <p className="text-sm flex-1" style={{ color: 'var(--brown)', margin: '0 4px' }}>
            {pizza.description}
          </p>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 mx-3 mb-4 mt-1">
          <button
            className="btn btn-primary btn-sm"
            style={{ boxShadow: 'none' }}
            onClick={() => onAdd(pizzaWithSize, [])}
          >
            Add to Cart
          </button>
          <button
            className="btn btn-secondary btn-sm"
            style={{ boxShadow: 'none' }}
            onClick={() => onCustomize(pizzaWithSize)}
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Menu Page ────────────────────────────────────────────────────────────────
export default function Menu() {
  const { addItem } = useCart()

  const { data: pizzas, loading, error } = useFetch('/pizza')

  const [customizing, setCustomizing] = useState(null)
  const [cyoSelected, setCyoSelected]  = useState([])

  const availablePizzas = (pizzas ?? []).filter(p => p.isAvailable)

  const cyoToppingPrice = cyoSelected.reduce((sum, name) => {
    const group = Object.entries(STATIC_TOPPINGS).find(([, ts]) => ts.includes(name))?.[0]
    return sum + (TOPPING_OFFSETS[group] ?? 0)
  }, 0)
  const cyoPrice = CYO_BASE.price + cyoToppingPrice

  function handleAddToCart(pizza, toppings) {
    // Store toppings as a special instructions string until a toppings API exists
    const instructions = toppings.length ? `Toppings: ${toppings.join(', ')}` : ''
    addItem(pizza, 1, [], instructions)
  }

  function handleAddCyo() {
    const instructions = cyoSelected.length ? `Toppings: ${cyoSelected.join(', ')}` : ''
    addItem({ ...CYO_BASE, price: cyoPrice }, 1, [], instructions)
    setCyoSelected([])
  }

  return (
    <div className="page">
      {/* ── Specialty Pizzas ── */}
      <div className="section-banner mb-10">
        <h2>Specialty Pizzas</h2>
      </div>

      {loading && <div className="spinner" />}

      {error && (
        <p className="error-msg text-center">
          Could not load pizzas — make sure the PizzaApi is running on port 5021.
        </p>
      )}

      {!loading && !error && availablePizzas.length === 0 && (
        <p className="empty-state">No pizzas available right now.</p>
      )}

      {availablePizzas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {availablePizzas.map(pizza => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              onAdd={handleAddToCart}
              onCustomize={setCustomizing}
            />
          ))}
        </div>
      )}

      <hr className="divider" />

      {/* ── Create Your Own ── */}
      <div className="section-banner mt-10 mb-10">
        <h2>Create Your Own</h2>
      </div>

      <div className="card max-w-2xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
              Build Your Pizza
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--brown)' }}>
              Starts at ${CYO_BASE.price.toFixed(2)} — pick your toppings below
            </p>
          </div>
          <span className="text-3xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
            ${cyoPrice.toFixed(2)}
          </span>
        </div>

        <ToppingSelector
          selected={cyoSelected}
          priceMap={TOPPING_OFFSETS}
          onToggle={name =>
            setCyoSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
          }
          onSelect={(name, group) =>
            setCyoSelected(prev => [...prev.filter(n => !STATIC_TOPPINGS[group].includes(n)), name])
          }
        />

        <div className="flex items-center justify-between mt-8 pt-6 border-t-2"
             style={{ borderColor: 'var(--gray-light)' }}>
          {cyoSelected.length > 0 ? (
            <span className="text-sm" style={{ color: 'var(--brown)' }}>
              {cyoSelected.length} topping{cyoSelected.length !== 1 ? 's' : ''} selected
            </span>
          ) : (
            <span className="text-sm" style={{ color: 'var(--gray)' }}>No toppings selected yet</span>
          )}
          <button className="btn btn-primary btn-lg" onClick={handleAddCyo}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* ── Customize Modal ── */}
      {customizing && (
        <CustomizeModal
          pizza={customizing}
          onClose={() => setCustomizing(null)}
          onAdd={handleAddToCart}
        />
      )}
    </div>
  )
}
