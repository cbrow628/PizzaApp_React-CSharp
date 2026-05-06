import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b-2"
      style={{ background: 'var(--cream)', borderColor: 'var(--brown)' }}
    >
      {/* Logo */}
      {/* <Link
        to="/"
        className="text-3xl"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}
      >
        Mac's Pizza
      </Link> */}

      {/* Nav links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) => isActive ? 'font-semibold' : ''}
          style={({ isActive }) => ({
            fontFamily: 'var(--font-ui)',
            color: isActive ? 'var(--red)' : 'var(--brown)',
          })}
        >
          Home
        </NavLink>

        <NavLink
          to="/story"
          className={({ isActive }) => isActive ? 'font-semibold' : ''}
          style={({ isActive }) => ({
            fontFamily: 'var(--font-ui)',
            color: isActive ? 'var(--red)' : 'var(--brown)',
          })}
        >
          My Story
        </NavLink>

        <NavLink
          to="/menu"
          className={({ isActive }) => isActive ? 'font-semibold' : ''}
          style={({ isActive }) => ({
            fontFamily: 'var(--font-ui)',
            color: isActive ? 'var(--red)' : 'var(--brown)',
          })}
        >
          Menu
        </NavLink>

        <NavLink
          to="/cart"
          className="relative"
          style={({ isActive }) => ({
            fontFamily: 'var(--font-ui)',
            color: isActive ? 'var(--red)' : 'var(--brown)',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          Cart
          {itemCount > 0 && (
            <span
              className="absolute -top-2 -right-4 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border"
              style={{ background: 'var(--red)', color: 'var(--white)', borderColor: 'var(--red-dark)' }}
            >
              {itemCount}
            </span>
          )}
        </NavLink>
      </div>

      {/* Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span style={{ fontFamily: 'var(--font-ui)', color: 'var(--brown)' }}>
              {user.name ?? user.email}
            </span>
            <button onClick={logout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
