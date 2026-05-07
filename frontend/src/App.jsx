import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderStatus from './pages/OrderStatus'
import Login from './pages/Login'
import Register from './pages/Register'
import Story from './pages/Story'
import Account from './pages/Account'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/story"       element={<Story />} />
            <Route path="/menu"        element={<Menu />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/checkout"    element={<Checkout />} />
            <Route path="/order/:id"   element={<OrderStatus />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/account"     element={<Account />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}