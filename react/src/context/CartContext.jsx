import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // Initialize cart from localStorage so it survives page refreshes
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Add an item to the cart.
  // Each item looks like: { menuItem, quantity, toppings, specialInstructions }
  // If the same menuItem + same toppings already exists, increment quantity instead.
  function addItem(menuItem, quantity = 1, toppings = [], specialInstructions = '') {
    setItems(prev => {
      const existingIndex = prev.findIndex(i =>
        i.menuItem.id === menuItem.id &&
        JSON.stringify(i.toppings.map(t => t.id).sort()) ===
        JSON.stringify(toppings.map(t => t.id).sort())
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        }
        return updated
      }

      return [...prev, { menuItem, quantity, toppings, specialInstructions }]
    })
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function updateQuantity(index, quantity) {
    if (quantity <= 0) {
      removeItem(index)
      return
    }
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], quantity }
      return updated
    })
  }

  function clearCart() {
    setItems([])
  }

  // Compute total price: (base price + topping prices) * quantity for each item
  const total = items.reduce((sum, item) => {
    const toppingTotal = item.toppings.reduce((t, topping) => t + topping.price, 0)
    return sum + (item.menuItem.price + toppingTotal) * item.quantity
  }, 0)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, total, itemCount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook — import this in any component that needs the cart
export function useCart() {
  return useContext(CartContext)
}
