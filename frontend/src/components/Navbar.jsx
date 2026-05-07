import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function AccountIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
  )
}

export default function Navbar() {
  const { itemCount } = useCart()
  const { user } = useAuth()

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b-2"
      style={{ background: 'var(--cream)', borderColor: 'var(--brown)' }}
    >
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
          <NavLink
            to="/account"
            title={user.name ?? user.email}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: isActive ? 'var(--red)' : 'var(--brown)',
              color: isActive ? 'var(--red)' : 'var(--brown)',
              background: 'var(--cream-dark)',
              transition: 'border-color 0.15s, color 0.15s',
            })}
          >
            <AccountIcon />
          </NavLink>
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
