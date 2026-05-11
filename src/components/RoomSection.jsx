import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AHM_AREAS = ['Navrangpura','Satellite','Bopal','Vastrapur','Maninagar',
  'Chandkheda','Gota','Paldi','Thaltej','Nikol','Prahlad Nagar',
  'Bodakdev','Ambawadi','Memnagar','Gurukul','Drive-In','Iscon','Vejalpur']

const TYPE_COLORS = { 'PG':'#6366f1','Private Room':'#8b5cf6','Shared Room':'#f59e0b','Full Flat':'#10b981' }
const TYPE_ICONS  = { 'PG':'🏢','Private Room':'🚪','Shared Room':'👥','Full Flat':'🏠' }
const AMENITY_ICONS = { WiFi:'📶',AC:'❄️',Meals:'🍽️',Laundry:'👕',Parking:'🅿️',CCTV:'📹',Geyser:'🚿',Kitchen:'🍳',Gym:'💪',Security:'🔒' }

export default function RoomSection({ onChat }) {
  const [rooms, setRooms]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [form, setForm]         = useState({ type:'', area:'', address:'', price:'', deposit:'', gender:'', amenities:[], description:'', name:'', phone:'' })
  const [search, setSearch]     = useState('')
  const [filterType, setFilterType]     = useState('')
  const [filterArea, setFilterArea]     = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [posting, setPosting]   = useState(false)

  const f = (k,v) => setForm(p => ({ ...p, [k]: v }))
  const toggleAmenity = a => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
  }))

  const loadRooms = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setRooms(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadRooms()
    const channel = supabase
      .channel('rooms-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rooms' }, payload => {
        setRooms(prev => [payload.new, ...prev])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.area || !form.price || !form.description || !form.type) return
    setPosting(true)
    const { error } = await supabase.from('rooms').insert([{
      type: form.type, area: form.area, address: form.address,
      price: parseInt(form.price), deposit: form.deposit ? parseInt(form.deposit) : null,
      gender: form.gender, amenities: form.amenities,
      description: form.description, name: form.name, phone: form.phone
    }])
    if (error) alert('Error posting room: ' + error.message)
    else {
      setForm({ type:'', area:'', address:'', price:'', deposit:'', gender:'', amenities:[], description:'', name:'', phone:'' })
      setShowForm(false)
    }
    setPosting(false)
  }

  const filtered = rooms.filter(p =>
    (search === '' || p.area.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.address||'').toLowerCase().includes(search.toLowerCase())) &&
    (filterType === '' || p.type === filterType) &&
    (filterArea === '' || p.area === filterArea) &&
    (filterGender === '' || p.gender === filterGender || p.gender === 'Any')
  )

  return (
    <div className="sec-wrap">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">🏠 PG & Room Listings</h2>
          <p className="sec-sub">{loading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} in Ahmedabad`}</p>
        </div>
        <button className={`add-btn ${showForm ? 'cancel' : ''}`} onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ List Your PG / Room'}
        </button>
      </div>

      {/* Filters */}
      <div className="room-filters">
        <input className="filter-search" placeholder="🔍  Search by area, address…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-row-inner">
          <div className="filter-group">
            <span className="filter-label">Type</span>
            <div className="filter-chips">
              {['','PG','Private Room','Shared Room','Full Flat'].map(t => (
                <button key={t} className={`fchip ${filterType === t ? 'fchip--on' : ''}`} onClick={() => setFilterType(t)}>
                  {t ? `${TYPE_ICONS[t]} ${t}` : 'All'}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">Area</span>
            <div className="filter-chips">
              <button className={`fchip ${filterArea === '' ? 'fchip--on' : ''}`} onClick={() => setFilterArea('')}>All Areas</button>
              {['Navrangpura','Satellite','Bopal','Vastrapur','Chandkheda','Prahlad Nagar'].map(a => (
                <button key={a} className={`fchip ${filterArea === a ? 'fchip--on' : ''}`} onClick={() => setFilterArea(a)}>{a}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="filter-label">For</span>
            <div className="filter-chips">
              {['','Boys','Girls','Any'].map(g => (
                <button key={g} className={`fchip ${filterGender === g ? 'fchip--on' : ''}`} onClick={() => setFilterGender(g)}>
                  {g || 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="glass-form">
          <h3>List Your PG / Room</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">Type *</label>
                <select className="fi" value={form.type} onChange={e => f('type', e.target.value)} required>
                  <option value="">Select type</option>
                  <option>PG</option><option>Private Room</option><option>Shared Room</option><option>Full Flat</option>
                </select>
              </div>
              <div className="fi-wrap">
                <label className="fi-label">Area *</label>
                <input className="fi" list="ahm-room" placeholder="e.g. Navrangpura" value={form.area} onChange={e => f('area', e.target.value)} required />
                <datalist id="ahm-room">{AHM_AREAS.map(a => <option key={a} value={a} />)}</datalist>
              </div>
            </div>
            <div className="fi-wrap">
              <label className="fi-label">Full Address / Landmark</label>
              <input className="fi" placeholder="e.g. Near Gujarat College, Navrangpura" value={form.address} onChange={e => f('address', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">Monthly Rent (₹) *</label>
                <input className="fi" type="number" placeholder="e.g. 6500" value={form.price} onChange={e => f('price', e.target.value)} required />
              </div>
              <div className="fi-wrap">
                <label className="fi-label">Security Deposit (₹)</label>
                <input className="fi" type="number" placeholder="e.g. 13000" value={form.deposit} onChange={e => f('deposit', e.target.value)} />
              </div>
            </div>
            <div className="fi-wrap">
              <label className="fi-label">Preferred For</label>
              <div className="gender-toggle">
                {['Boys','Girls','Any'].map(g => (
                  <button type="button" key={g} className={`gender-btn ${form.gender === g ? 'active' : ''}`} onClick={() => f('gender', g)}>{g}</button>
                ))}
              </div>
            </div>
            <div className="fi-wrap">
              <label className="fi-label">Amenities</label>
              <div className="amenity-grid">
                {Object.keys(AMENITY_ICONS).map(a => (
                  <button type="button" key={a} className={`amenity-btn ${form.amenities.includes(a) ? 'active' : ''}`} onClick={() => toggleAmenity(a)}>
                    {AMENITY_ICONS[a]} {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="fi-wrap">
              <label className="fi-label">Description *</label>
              <textarea className="fi" placeholder="Describe the room — furnishing, rules, nearby landmarks…" rows="3" value={form.description} onChange={e => f('description', e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="fi-wrap">
                <label className="fi-label">Your Name</label>
                <input className="fi" placeholder="PG owner / landlord name" value={form.name} onChange={e => f('name', e.target.value)} />
              </div>
              <div className="fi-wrap">
                <label className="fi-label">Phone / WhatsApp</label>
                <input className="fi" placeholder="10-digit number" value={form.phone} onChange={e => f('phone', e.target.value)} />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={posting}>
              {posting ? 'Posting…' : 'List Room →'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="db-error">⚠️ {error}</div>}

      {loading ? (
        <div className="room-cards-grid">
          {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="room-cards-grid">
          {filtered.length === 0
            ? <div className="empty-state"><span>🏠</span><p>No listings found. Try different filters or list your room!</p></div>
            : filtered.map(p => {
              const color = TYPE_COLORS[p.type] || '#6366f1'
              const icon  = TYPE_ICONS[p.type]  || '🏠'
              const isExp = expandedId === p.id
              return (
                <div key={p.id} className="room-card-v2">
                  <div className="rcv2-strip" style={{ background:`linear-gradient(135deg,${color}22,${color}44)` }}>
                    <span className="rcv2-type-badge" style={{ background: color }}>{icon} {p.type}</span>
                    {p.gender && p.gender !== 'Any' && (
                      <span className="rcv2-gender">{p.gender === 'Boys' ? '👦' : '👧'} {p.gender} only</span>
                    )}
                  </div>
                  <div className="rcv2-body">
                    <div className="rcv2-top">
                      <div>
                        <div className="rcv2-area">📍 {p.area}</div>
                        {p.address && <div className="rcv2-address">{p.address}</div>}
                      </div>
                      <div className="rcv2-price-block">
                        <span className="rcv2-price">₹{Number(p.price).toLocaleString()}</span>
                        <span className="rcv2-price-label">/month</span>
                        {p.deposit && <span className="rcv2-deposit">Deposit: ₹{Number(p.deposit).toLocaleString()}</span>}
                      </div>
                    </div>
                    {p.amenities?.length > 0 && (
                      <div className="rcv2-amenities">
                        {p.amenities.map(a => (
                          <span key={a} className="amenity-chip">{AMENITY_ICONS[a] || '•'} {a}</span>
                        ))}
                      </div>
                    )}
                    <p className={`rcv2-desc ${isExp ? 'expanded' : ''}`}>{p.description}</p>
                    {p.description?.length > 100 && (
                      <button className="rcv2-more" onClick={() => setExpandedId(isExp ? null : p.id)}>
                        {isExp ? 'Show less ↑' : 'Read more ↓'}
                      </button>
                    )}
                    <div className="rcv2-footer">
                      <div className="ride-driver">
                        <div className="driver-avatar" style={{ background:`linear-gradient(135deg,${color},${color}99)` }}>
                          {p.name ? p.name[0].toUpperCase() : '?'}
                        </div>
                        <div>
                          <div style={{ fontSize:'14px', fontWeight:600, color:'var(--text)' }}>{p.name || 'Owner'}</div>
                          {p.phone && <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>📞 {p.phone}</div>}
                        </div>
                      </div>
                      <div className="rcv2-actions">
                        <a className="pc-btn-call" href={`tel:${p.phone}`}>📞 Call</a>
                        <button className="pc-btn-msg" onClick={() => onChat({ id:`room-${p.id}`, name: p.name||'Owner', phone: p.phone, context:`${p.type} in ${p.area} — ₹${Number(p.price).toLocaleString()}/mo`, color:`linear-gradient(135deg,${color},${color}99)` })}>
                          💬 Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      )}
    </div>
  )
}
