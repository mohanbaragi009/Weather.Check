import React, { useMemo, useState } from 'react'
import { Weatherstack } from '../api/weatherstack.js'

export default function HistoricalWeather() {
  const [query, setQuery] = useState('New York')
  const [date, setDate] = useState('')
  const [units, setUnits] = useState('m')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const items = useMemo(() => {
    const d = data?.historical?.[date]
    if (!d) return []
    return [
      { k: 'Avg Temp', v: `${d?.avgtemp}°` },
      { k: 'Max Temp', v: `${d?.maxtemp}°` },
      { k: 'Min Temp', v: `${d?.mintemp}°` },
      { k: 'Humidity', v: `${d?.avghumidity}%` },
      { k: 'Precip', v: `${d?.precip} mm` },
      { k: 'Sunrise', v: d?.astro?.sunrise },
      { k: 'Sunset', v: d?.astro?.sunset }
    ]
  }, [data, date])

  async function fetchHistorical() {
    setLoading(true)
    setError('')
    try {
      if (!date) throw new Error('Choose a date')
      const res = await Weatherstack.historical({
        query, historical_date: date, units, language
      })
      setData(res)
    } catch (e) {
      setError(e.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="controls">
        <div className="control" style={{ gridColumn: 'span 3' }}>
          <label>Location</label>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="City, Region, Country or IP" />
        </div>
        <div className="control">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="control">
          <label>Units</label>
          <select value={units} onChange={e => setUnits(e.target.value)}>
            <option value="m">Metric</option>
            <option value="f">Imperial</option>
            <option value="s">Scientific</option>
          </select>
        </div>
        <div className="control">
          <label>Language</label>
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="hi">हिन्दी</option>
            <option value="zh">中文</option>
          </select>
        </div>
        <div className="control" style={{ alignSelf: 'end' }}>
          <button className="primary" onClick={fetchHistorical} disabled={loading}>
            {loading ? 'Loading...' : 'Get Historical'}
          </button>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {data && (
        <div className="grid">
          <div className="card">
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {data.location?.name}, {data.location?.country}
            </div>
            <div style={{ color: 'var(--muted)', marginTop: 6 }}>
              {date}
            </div>
          </div>
          {items.map(it => (
            <div key={it.k} className="card">
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{it.k}</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{it.v}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
