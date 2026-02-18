const BASE = 'https://api.weatherstack.com'

function key() {
  const k = import.meta?.env?.VITE_WEATHERSTACK_KEY
  if (!k) throw new Error('Missing VITE_WEATHERSTACK_KEY')
  return k
}

async function call(path, params) {
  const usp = new URLSearchParams({ access_key: key(), ...params })
  const url = `${BASE}${path}?${usp.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data?.error) {
    const msg = data.error?.info || data.error?.type || 'API error'
    const code = data.error?.code
    const err = new Error(`${msg}${code ? ` (${code})` : ''}`)
    err.code = code
    throw err
  }
  return data
}

export const Weatherstack = {
  current: async ({ query, units, language }) =>
    call('/current', { query, units, language }),
  historical: async ({ query, historical_date, units, language }) =>
    call('/historical', { query, historical_date, units, language }),
  marine: async ({ query, units }) =>
    call('/marine', { query, units })
}
