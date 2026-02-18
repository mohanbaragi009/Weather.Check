import { forward, parseQuery } from './_util.js'

export default async function handler(req, res) {
  const { query, units, language } = parseQuery(req)
  if (!query) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Missing query' }))
    return
  }
  await forward(res, '/current', { query, units, language })
}
