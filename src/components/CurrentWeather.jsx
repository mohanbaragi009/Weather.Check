import React, { useMemo, useState } from 'react'
import { Weatherstack } from '../api/weatherstack.js'

export default function CurrentWeather() {
  const [query, setQuery] = useState('New York')
  const [units, setUnits] = useState('m')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const fields = useMemo(() => {
    if (!data?.current) return []
    const c = data.current
    return [
      { k: 'Temperature', v: `${c.temperature}°` },
      { k: 'Feels Like', v: `${c.feelslike}°` },
      { k: 'Description', v: (c.weather_descriptions || []).join(', ') },
      { k: 'Wind', v: `${c.wind_speed} ${units === 'm' ? 'km/h' : 'mph'} ${c.wind_dir}` },
      { k: 'Humidity', v: `${c.humidity}%` },
      { k: 'Pressure', v: `${c.pressure} mb` },
      { k: 'UV Index', v: c.uv_index },
      { k: 'Visibility', v: `${c.visibility} ${units === 'm' ? 'km' : 'mi'}` }
    ]
  }, [data, units])

  async function fetchCurrent() {
    setLoading(true)
    setError('')
    try {
      const res = await Weatherstack.current({ query, units, language })
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
          <button className="primary" onClick={fetchCurrent} disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {data && (
        <div className="grid">
          <div className="card">
            <div style={{ fontSize: 28, fontWeight: 700 }}>
              {data.location?.name}, {data.location?.country}
            </div>
            <div style={{ color: 'var(--muted)', marginTop: 6 }}>
              {data.location?.region} • {data.location?.localtime}
            </div>
          </div>
          {fields.map(it => (
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
