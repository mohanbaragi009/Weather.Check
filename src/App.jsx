import React, { useMemo, useState } from 'react'
import CurrentWeather from './components/CurrentWeather.jsx'
import HistoricalWeather from './components/HistoricalWeather.jsx'
import MarineWeather from './components/MarineWeather.jsx'

const tabs = [
  { id: 'current', label: 'Current' },
  { id: 'historical', label: 'Historical' },
  { id: 'marine', label: 'Marine' }
]

export default function App() {
  const [active, setActive] = useState('current')
  const title = useMemo(() => {
    if (active === 'current') return 'Current Weather'
    if (active === 'historical') return 'Historical Weather'
    return 'Marine Weather'
  }, [active])

  return (
    <div className="container">
      <div className="glass">
        <div className="header">
          <div className="title">{title}</div>
          <div className="tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`tab ${active === t.id ? 'active' : ''}`}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="content">
          {active === 'current' && <CurrentWeather />}
          {active === 'historical' && <HistoricalWeather />}
          {active === 'marine' && <MarineWeather />}
        </div>
        <div className="footer">
          <div>Glass Morphic Theme</div>
          <div>Powered by Weatherstack</div>
        </div>
      </div>
    </div>
  )
}
