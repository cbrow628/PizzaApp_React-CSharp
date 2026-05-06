import { useState, useEffect, useCallback } from 'react'

const BASE_URL = 'http://localhost:5021'

export function useFetch(path, options = {}) {
  const { token, headers: optHeaders, ...restOptions } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!!path)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!path) return
    setLoading(true)
    setError(null)
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...optHeaders,
      }
      const res = await fetch(`${BASE_URL}${path}`, { ...restOptions, headers })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }))
        throw new Error(err.detail ?? 'Request failed')
      }
      setData(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [path, token])

  useEffect(() => {
    if (path) fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
