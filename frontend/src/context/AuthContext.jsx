import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useFetch } from '../hooks/Fetch'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

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