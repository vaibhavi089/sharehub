import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AHM_AREAS = ['Satellite','Navrangpura','Bopal','Vastrapur','Maninagar',
  'Chandkheda','Gota','Paldi','Thaltej','Nikol','Iscon','CG Road',
  'Prahlad Nagar','Bodakdev','Ambawadi','Memnagar','Gurukul','Drive-In']

export default function CarpoolSection({ onChat }) {
  const [rides, setRides]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [form, setForm]         = useState({ from:'', to:'', date:'', time:'', seats:'', price:'', name:'', phone:'' })
  const [search, setSearch]     = useState({ from:'', to:'', date:'' })
  const [showForm, setShowForm] = useState(false)
  const [posting, setPosting]   = useState(false)
  const f = (k,v) => setForm(p => ({ ...p, [k]: v }))

  // Load rides
  const loadRides = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setRides(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadRides()
    // Realtime subscription
    const channel = supabase
      .channel('rides-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rides' }, payload => {
        setRides(prev => [payload.new, ...prev])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.from || !form.to || !form.date || !form.seats) return
    setPosting(true)
    const { error } = await supabase.from('rides').insert([{
      from: form.from, to: form.to, date: form.date,
      time: form.time, seats: parseInt(form.seats),
      price: form.price, name: form.name, phone: form.phone
    }])
    if (error) alert('Error posting ride: ' + error.message)
    else {
      setForm({ from:'', to:'', date:'', time:'', seats:'', price:'', name:'', phone:'' })
      setShowForm(false)
    }
    setPosting(false)
  }

  const filtered = rides.filter(p =>
    p.from.toLowerCase().includes(search.from.toLowerCase()) &&
    p.to.toLowerCase().includes(search.to.toLowerCase()) &&
    (search.date === '' || p.date === search.date)
  )

  return (
    <div className="sec-wrap">
      {/* Search bar */}
      <div className="cp-search-bar">
        <div className="cp-sf">
          <label>Leaving from</label>
          <input list="ahm-from" placeholder="Area in Ahmedabad" value={search.from} onChange={e => setSearch(s => ({ ...s, from: e.target.value }))} />
          <datalist id="ahm-from">{AHM_AREAS.map(a => <option key={a} value={a} />)}</datalist>
        </div>
        <div className="cp-sf-div" />
        <div className="cp-sf">
          <label>Going to</label>
          <input list="ahm-to" placeholder="Area in Ahmedabad" value={search.to} onChange={e => setSearch(s => ({ ...s, to: e.target.value }))} />
          <datalist id="ahm-to">{AHM_AREAS.map(a => <option key={a} value={a} />)}</datalist>
        </div>
        <div className="cp-sf-div" />
        <div className="cp-sf">
          <label>Date</label>
          <input type="date" value={search.date} onChange={e => setSearch(s => ({ ...s, date: e.target.value }))} />
        </div>
        <button className="cp-search-btn">Search</button>
      </div>

      <div className="sec-header">
        <div>
          <h2 className="sec-title">🚗 Available Rides</h2>
          <p className="sec-sub">{loading ? 'Loading…' : `${filtered.length} ride${filtered.length !== 1 ? 's' : ''} in Ahmedabad`}</p>
        </div>
        <button className={`add-btn ${showForm ? 'cancel' : ''}`} onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Offer a Ride'}
        </button>
      </div>

      {showForm && (
        <div className="glass-form">
          <h3>Post Your Ride</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">From *</label>
                <input className="fi" list="ahm-f" placeholder="Pickup area" value={form.from} onChange={e => f('from', e.target.value)} required />
                <datalist id="ahm-f">{AHM_AREAS.map(a => <option key={a} value={a} />)}</datalist>
              </div>
              <div className="fi-wrap">
                <label className="fi-label">To *</label>
                <input className="fi" list="ahm-t" placeholder="Drop area" value={form.to} onChange={e => f('to', e.target.value)} required />
                <datalist id="ahm-t">{AHM_AREAS.map(a => <option key={a} value={a} />)}</datalist>
              </div>
            </div>
            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">Date *</label>
                <input className="fi" type="date" value={form.date} onChange={e => f('date', e.target.value)} required />
              </div>
              <div className="fi-wrap">
                <label className="fi-label">Time</label>
                <input className="fi" type="time" value={form.time} onChange={e => f('time', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">Seats available *</label>
                <input className="fi" type="number" min="1" max="6" placeholder="1–6" value={form.seats} onChange={e => f('seats', e.target.value)} required />
              </div>
              <div className="fi-wrap">
                <label className="fi-label">Price per seat (₹)</label>
                <input className="fi" type="number" placeholder="e.g. 80" value={form.price} onChange={e => f('price', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">Your name</label>
                <input className="fi" placeholder="Full name" value={form.name} onChange={e => f('name', e.target.value)} />
              </div>
              <div className="fi-wrap">
                <label className="fi-label">Phone / WhatsApp</label>
                <input className="fi" placeholder="10-digit number" value={form.phone} onChange={e => f('phone', e.target.value)} />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={posting}>
              {posting ? 'Posting…' : 'Post Ride →'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="db-error">⚠️ {error} — showing cached data</div>}

      {loading ? (
        <div className="loading-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.length === 0
            ? <div className="empty-state"><span>🚗</span><p>No rides found. Try different areas or offer a ride!</p></div>
            : filtered.map(p => (
              <div key={p.id} className="ride-card">
                <div className="ride-card-top">
                  <div className="ride-route">
                    <div className="ride-point">
                      <span className="ride-dot ride-dot--from" />
                      <span className="ride-city">{p.from}</span>
                    </div>
                    <div className="ride-line" />
                    <div className="ride-point">
                      <span className="ride-dot ride-dot--to" />
                      <span className="ride-city">{p.to}</span>
                    </div>
                  </div>
                  {p.price && <span className="ride-price">₹{p.price}<small>/seat</small></span>}
                </div>
                <div className="ride-card-bottom">
                  <div className="ride-meta">
                    <span className="chip">📅 {p.date}</span>
                    {p.time && <span className="chip">⏰ {p.time}</span>}
                    <span className="chip">💺 {p.seats} seat{p.seats > 1 ? 's' : ''}</span>
                  </div>
                  <div className="ride-footer">
                    <div className="ride-driver">
                      <div className="driver-avatar">{p.name ? p.name[0].toUpperCase() : '?'}</div>
                      <div>
                        <div style={{ fontSize:'14px', fontWeight:600, color:'var(--text)' }}>{p.name || 'Anonymous'}</div>
                        {p.phone && <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{p.phone}</div>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button className="pc-btn-msg" onClick={() => onChat({ id:`ride-${p.id}`, name: p.name || 'Driver', phone: p.phone, context:`${p.from} → ${p.to} on ${p.date}`, color:'linear-gradient(135deg,#6366f1,#4f46e5)' })}>
                        💬 Message
                      </button>
                      <button className="pc-btn">Book Seat</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}
