import { useState } from 'react'
import './App.css'
import Landing from './components/Landing'
import CarpoolSection from './components/CarpoolSection'
import RoomSection from './components/RoomSection'
import CommuteSection from './components/CommuteSection'
import Messages from './components/Messages'

export default function App() {
  const [page, setPage] = useState('landing')
  const [tab, setTab]   = useState('carpool')
  const [chats, setChats] = useState([])

  const totalUnread = chats.reduce((s, c) => s + (c.unread || 0), 0)

  const startChat = ({ id, name, phone, context, color }) => {
    setChats(prev => {
      const exists = prev.find(c => c.id === id)
      if (exists) { setTab('messages'); return prev }
      return [...prev, { id, name, phone, context, color, unread: 1, messages: [] }]
    })
    setTab('messages')
    setPage('app')
  }

  if (page === 'landing') {
    return <Landing onGetStarted={(t) => { setTab(t || 'carpool'); setPage('app') }} />
  }

  const navItems = [
    { id: 'carpool',  icon: '🚗', label: 'Carpooling' },
    { id: 'commute',  icon: '🔄', label: 'Daily Commute' },
    { id: 'room',     icon: '🏠', label: 'PG & Rooms' },
    { id: 'messages', icon: '💬', label: 'Messages', badge: totalUnread },
  ]

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <button className="app-logo" onClick={() => setPage('landing')}>
            <span className="logo-mark">◈</span> ShareHub
          </button>
          <nav className="app-nav">
            {navItems.map(t => (
              <button key={t.id} className={`app-nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.icon} {t.label}
                {t.badge > 0 && <span className="nav-badge">{t.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="app-header-right">
            <span className="city-badge">📍 Ahmedabad</span>
            <button className="post-btn" onClick={() => setTab(tab === 'room' ? 'room' : tab === 'commute' ? 'commute' : 'carpool')}>+ Post</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {tab === 'carpool'  && <CarpoolSection  onChat={startChat} />}
        {tab === 'commute'  && <CommuteSection  onChat={startChat} />}
        {tab === 'room'     && <RoomSection     onChat={startChat} />}
        {tab === 'messages' && <Messages chats={chats} setChats={setChats} />}
      </main>

      <footer className="app-footer">
        © 2026 ShareHub Ahmedabad &nbsp;·&nbsp; Connecting the city
      </footer>
    </div>
  )
}


