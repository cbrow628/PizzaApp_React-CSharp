const BASE_URL = 'http://localhost:5021'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Request failed')
  }
  return res.json()
}

export const placeOrder = (body) =>
  request('/order', { method: 'POST', body: JSON.stringify(body) })

export const getOrder = (id) => request(`/order/${id}`)

export const loginUser = (body) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify(body) })

export const registerUser = (body) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify(body) })
