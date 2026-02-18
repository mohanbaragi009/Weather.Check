const BASE = 'https://api.weatherstack.com'

export async function forward(res, endpoint, params) {
  const key = process.env.WEATHERSTACK_KEY
  if (!key) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Missing WEATHERSTACK_KEY on server' }))
    return
  }
  const usp = new URLSearchParams({ ...params, access_key: key })
  const url = `${BASE}${endpoint}?${usp.toString()}`
  const r = await fetch(url)
  const data = await r.json()
  res.statusCode = r.ok ? 200 : 502
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export function parseQuery(req) {
  const u = new URL(req.url, 'http://localhost')
  return Object.fromEntries(u.searchParams.entries())
}
