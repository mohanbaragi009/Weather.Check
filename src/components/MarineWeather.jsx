import React, { useMemo, useState } from 'react'
import { Weatherstack } from '../api/weatherstack.js'

export default function MarineWeather() {
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [units, setUnits] = useState('m')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const items = useMemo(() => {
    const d = data?.data?.[0]
    if (!d) return []
    return [
      { k: 'Water Temp', v: `${d.water_temp}°` },
      { k: 'Wave Height', v: `${d.wave_height} m` },
      { k: 'Swell Height', v: `${d.swell_height} m` },
      { k: 'Wind Speed', v: `${d.wind?.speed} ${units === 'm' ? 'km/h' : 'mph'}` },
      { k: 'Wind Dir', v: d.wind?.direction },
      { k: 'Visibility', v: `${d.visibility} km` }
    ]
  }, [data, units])

  async function fetchMarine() {
    setLoading(true)
    setError('')
    setData(null)
    try {
      if (!lat || !lon) throw new Error('Enter latitude and longitude')
      const query = `${lat},${lon}`
      const res = await Weatherstack.marine({ query, units })
      setData(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="controls">
        <div className="control">
          <label>Latitude</label>
          <input value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g., 36.12" />
        </div>
        <div className="control">
          <label>Longitude</label>
          <input value={lon} onChange={e => setLon(e.target.value)} placeholder="e.g., -5.35" />
        </div>
        <div className="control">
          <label>Units</label>
          <select value={units} onChange={e => setUnits(e.target.value)}>
            <option value="m">Metric</option>
            <option value="f">Imperial</option>
            <option value="s">Scientific</option>
          </select>
        </div>
        <div className="control" style={{ alignSelf: 'end' }}>
          <button className="primary" onClick={fetchMarine} disabled={loading}>
            {loading ? 'Loading...' : 'Get Marine'}
          </button>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {data && (
        <div className="grid">
          <div className="card">
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {data.request?.query}
            </div>
            <div style={{ color: 'var(--muted)', marginTop: 6 }}>
              Marine conditions
            </div>
          </div>
          {items.map(it => (
            <div key={it.k} className="card">
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{it.k}</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{it.v}</div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="card" style={{ gridColumn: '1/-1' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Raw response</div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </>
  )
}
