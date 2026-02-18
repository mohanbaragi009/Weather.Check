import { forward, parseQuery } from './_util.js'

export default async function handler(req, res) {
  const { query, historical_date, units, language } = parseQuery(req)
  if (!query || !historical_date) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Missing query or historical_date' }))
    return
  }
  await forward(res, '/historical', { query, historical_date, units, language })
}
