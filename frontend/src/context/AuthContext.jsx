import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useFetch } from '../hooks/Fetch'

const INACTIVITY_MS = 5 * 60 * 1000 // 5 minutes

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const timerRef = useRef(null)

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(logout, INACTIVITY_MS)
  }, [logout])

  useEffect(() => {
    if (!user) {
      clearTimeout(timerRef.current)
      return
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer() // start the clock as soon as the user logs in

    return () => {
      clearTimeout(timerRef.current)
      events.forEach(e => window.removeEventListener(e, resetTimer))
    }
  }, [user, resetTimer])

  const { data, error } = useFetch(token ? '/auth/me' : null, { token })

  useEffect(() => {
    if (data) setUser(data)
  }, [data])

  useEffect(() => {
    if (error) logout()
  }, [error, logout])

  function login(newToken, userData) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — import this in any component that needs auth
export function useAuth() {
  return useContext(AuthContext)
}