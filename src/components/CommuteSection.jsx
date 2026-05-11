import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AHM_AREAS = ['Satellite','Navrangpura','Bopal','Vastrapur','Maninagar',
  'Chandkheda','Gota','Paldi','Thaltej','Nikol','Iscon','CG Road',
  'Prahlad Nagar','Bodakdev','Ambawadi','Memnagar','Gurukul','Drive-In',
  'Thaltej Metro','Vastral','GIFT City','Motera','Sabarmati','Ranip',
  'New CG Road','Sindhu Bhavan','Shilaj','Shela','Ghuma']

const MODES = ['Carpool 🚗','Auto Share 🛺','Bike 🏍️','Bus Buddy 🚌','Any 🤝']
const DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const TIMES = ['6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM',
               '9:00 AM','9:30 AM','10:00 AM','5:00 PM','5:30 PM','6:00 PM',
               '6:30 PM','7:00 PM','7:30 PM','8:00 PM']

export default function CommuteSection({ onChat }) {
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [posting, setPosting]   = useState(false)
  const [filterMode, setFilterMode] = useState('')
  const [search, setSearch]     = useState('')

  const [form, setForm] = useState({
    from: '', to: '', mode: '', days: [],
    time: '', name: '', phone: '', note: ''
  })
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const toggleDay = d => setForm(p => ({
    ...p, days: p.days.includes(d) ? p.days.filter(x => x !== d) : [...p.days, d]
  }))

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('commutes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const ch = supabase
      .channel('commutes-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'commutes' }, p => {
        setPosts(prev => [p.new, ...prev])
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.from || !form.to || !form.mode || form.days.length === 0) return
    setPosting(true)
    const { error } = await supabase.from('commutes').insert([{
      from: form.from, to: form.to, mode: form.mode,
      days: form.days, time: form.time,
      name: form.name, phone: form.phone, note: form.note
    }])
    if (error) alert('Error: ' + error.message)
    else {
      setForm({ from:'', to:'', mode:'', days:[], time:'', name:'', phone:'', note:'' })
      setShowForm(false)
    }
    setPosting(false)
  }

  const filtered = posts.filter(p =>
    (filterMode === '' || p.mode === filterMode) &&
    (search === '' ||
      p.from.toLowerCase().includes(search.toLowerCase()) ||
      p.to.toLowerCase().includes(search.toLowerCase()) ||
      (p.note||'').toLowerCase().includes(search.toLowerCase()))
  )

  const modeColor = {
    'Carpool 🚗': '#6366f1',
    'Auto Share 🛺': '#f59e0b',
    'Bike 🏍️': '#10b981',
    'Bus Buddy 🚌': '#3b82f6',
    'Any 🤝': '#8b5cf6',
  }

  return (
    <div className="sec-wrap">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">🔄 Daily Commute Partners</h2>
          <p className="sec-sub">
            {loading ? 'Loading…' : `${filtered.length} commuter${filtered.length !== 1 ? 's' : ''} looking for partners`}
          </p>
        </div>
        <button className={`add-btn ${showForm ? 'cancel' : ''}`} onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Post My Commute'}
        </button>
      </div>

      {/* Info banner */}
      <div className="commute-banner">
        <span className="commute-banner-icon">💡</span>
        <div>
          <strong>Find your daily travel partner</strong>
          <p>Post your regular route — office, college, metro station — and find someone who travels the same way every day. Split auto fare, carpool, or just have a bus buddy.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="commute-filters">
        <input
          className="filter-search"
          placeholder="🔍  Search by area or route…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-chips">
          <button className={`fchip ${filterMode === '' ? 'fchip--on' : ''}`} onClick={() => setFilterMode('')}>All</button>
          {MODES.map(m => (
            <button key={m} className={`fchip ${filterMode === m ? 'fchip--on' : ''}`} onClick={() => setFilterMode(m)}>{m}</button>
          ))}
        </div>
      </div>

      {/* Post form */}
      {showForm && (
        <div className="glass-form">
          <h3>Post Your Daily Commute</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">From *</label>
                <input className="fi" list="cm-from" placeholder="e.g. Thaltej Metro Station" value={form.from} onChange={e => f('from', e.target.value)} required />
                <datalist id="cm-from">{AHM_AREAS.map(a => <option key={a} value={a} />)}</datalist>
              </div>
              <div className="fi-wrap">
                <label className="fi-label">To *</label>
                <input className="fi" list="cm-to" placeholder="e.g. SG Highway, GIFT City" value={form.to} onChange={e => f('to', e.target.value)} required />
                <datalist id="cm-to">{AHM_AREAS.map(a => <option key={a} value={a} />)}</datalist>
              </div>
            </div>

            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">Travel Mode *</label>
                <select className="fi" value={form.mode} onChange={e => f('mode', e.target.value)} required>
                  <option value="">Select mode</option>
                  {MODES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="fi-wrap">
                <label className="fi-label">Usual Time</label>
                <select className="fi" value={form.time} onChange={e => f('time', e.target.value)}>
                  <option value="">Select time</option>
                  {TIMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="fi-wrap">
              <label className="fi-label">Days *</label>
              <div className="day-toggle">
                {DAYS.map(d => (
                  <button type="button" key={d}
                    className={`day-btn ${form.days.includes(d) ? 'active' : ''}`}
                    onClick={() => toggleDay(d)}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="fi-wrap">
              <label className="fi-label">Note (optional)</label>
              <input className="fi" placeholder="e.g. Looking for auto partner, split fare. Near Thaltej crossroads." value={form.note} onChange={e => f('note', e.target.value)} />
            </div>

            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">Your Name</label>
                <input className="fi" placeholder="Full name" value={form.name} onChange={e => f('name', e.target.value)} />
              </div>
              <div className="fi-wrap">
                <label className="fi-label">Phone / WhatsApp</label>
                <input className="fi" placeholder="10-digit number" value={form.phone} onChange={e => f('phone', e.target.value)} />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={posting}>
              {posting ? 'Posting…' : 'Post Commute →'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="db-error">⚠️ {error}</div>}

      {loading ? (
        <div className="loading-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="commute-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span>🔄</span>
              <p>No commute posts yet. Be the first to find a travel partner!</p>
            </div>
          ) : filtered.map(p => {
            const color = modeColor[p.mode] || '#6366f1'
            return (
              <div key={p.id} className="commute-card">
                {/* Mode badge */}
                <div className="commute-card-top" style={{ background: `linear-gradient(135deg, ${color}18, ${color}30)` }}>
                  <span className="commute-mode-badge" style={{ background: color }}>{p.mode}</span>
                  <div className="commute-days">
                    {DAYS.map(d => (
                      <span key={d} className={`day-chip ${p.days?.includes(d) ? 'active' : ''}`}
                        style={p.days?.includes(d) ? { background: color, color: '#fff' } : {}}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="commute-card-body">
                  {/* Route */}
                  <div className="commute-route">
                    <div className="commute-point">
                      <span className="commute-dot" style={{ background: color }} />
                      <span className="commute-place">{p.from}</span>
                    </div>
                    <div className="commute-vline" style={{ background: `${color}44` }} />
                    <div className="commute-point">
                      <span className="commute-dot commute-dot--to" />
                      <span className="commute-place">{p.to}</span>
                    </div>
                  </div>

                  {p.time && (
                    <div className="commute-time">
                      <span>⏰</span> Usually at <strong>{p.time}</strong>
                    </div>
                  )}

                  {p.note && <p className="commute-note">"{p.note}"</p>}

                  {/* Footer */}
                  <div className="commute-footer">
                    <div className="ride-driver">
                      <div className="driver-avatar" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                        {p.name ? p.name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{p.name || 'Anonymous'}</div>
                        {p.phone && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.phone}</div>}
                      </div>
                    </div>
                    <button className="pc-btn-msg" onClick={() => onChat({
                      id: `commute-${p.id}`,
                      name: p.name || 'Commuter',
                      phone: p.phone,
                      context: `${p.mode} · ${p.from} → ${p.to}`,
                      color: `linear-gradient(135deg, ${color}, ${color}99)`
                    })}>
                      💬 Connect
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
