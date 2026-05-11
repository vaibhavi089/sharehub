import { useState } from 'react'

const SAMPLE = [
  { id: 1, item: 'Power Drill', category: 'Tools', condition: 'Like New', description: 'Bosch 18V cordless drill. Comes with 2 batteries and a charger. Available on weekends.', name: 'Karan D.', postedAt: '10/05/2026' },
  { id: 2, item: 'Camping Tent (4-person)', category: 'Camping', condition: 'Good', description: 'Quechua 4-person tent. Easy to set up, waterproof. Used twice. Perfect for weekend trips.', name: 'Meera J.', postedAt: '09/05/2026' },
  { id: 3, item: 'DSLR Camera', category: 'Electronics', condition: 'Good', description: 'Canon 200D with 18-55mm kit lens. Great for events and travel. Security deposit required.', name: 'Rohan V.', postedAt: '11/05/2026' },
]

const CAT_ICONS = { Tools: '🔧', Electronics: '📷', Sports: '⚽', Camping: '⛺', Kitchen: '🍳', Books: '📚', Other: '📦' }

export default function ItemSection({ posts, setPosts }) {
  const [form, setForm] = useState({ item: '', category: '', condition: '', description: '', name: '' })
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [showForm, setShowForm] = useState(false)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.item || !form.description) return
    setPosts(p => [{ ...form, id: Date.now(), postedAt: new Date().toLocaleDateString() }, ...p])
    setForm({ item: '', category: '', condition: '', description: '', name: '' })
    setShowForm(false)
  }

  const allPosts = [...posts, ...SAMPLE]
  const filtered = allPosts.filter(p =>
    (p.item.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) &&
    (filterCat === '' || p.category === filterCat)
  )

  return (
    <div className="sec-wrap">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">📦 Item Sharing</h2>
          <p className="sec-sub">{filtered.length} item{filtered.length !== 1 ? 's' : ''} available to borrow</p>
        </div>
        <button className={`add-btn ${showForm ? 'cancel' : ''}`} onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Share an Item'}
        </button>
      </div>

      <div className="filter-row">
        <input className="filter-search" placeholder="🔍  Search items…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-chips">
          {['', 'Tools', 'Electronics', 'Sports', 'Camping', 'Kitchen', 'Books'].map(c => (
            <button key={c} className={`fchip ${filterCat === c ? 'fchip--on' : ''}`} onClick={() => setFilterCat(c)}>
              {c ? `${CAT_ICONS[c]} ${c}` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="glass-form">
          <h3>Share an Item</h3>
          <form onSubmit={handleSubmit}>
            <input className="fi" placeholder="Item name *" value={form.item} onChange={e => f('item', e.target.value)} required />
            <div className="form-row">
              <select className="fi" value={form.category} onChange={e => f('category', e.target.value)}>
                <option value="">Category</option>
                {Object.keys(CAT_ICONS).map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="fi" value={form.condition} onChange={e => f('condition', e.target.value)}>
                <option value="">Condition</option>
                <option>Like New</option><option>Good</option><option>Fair</option>
              </select>
            </div>
            <textarea className="fi" placeholder="Description — how to use, availability, any deposit… *" rows="3" value={form.description} onChange={e => f('description', e.target.value)} required />
            <input className="fi" placeholder="Your name" value={form.name} onChange={e => f('name', e.target.value)} />
            <button type="submit" className="submit-btn">Share Item →</button>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {filtered.length === 0
          ? <div className="empty-state"><span>📦</span><p>No items found. Share something you're not using!</p></div>
          : filtered.map(p => (
            <div key={p.id} className="item-card">
              <div className="item-icon-wrap">
                <span>{CAT_ICONS[p.category] || '📦'}</span>
              </div>
              <div className="item-body">
                <div className="item-top">
                  <span className="item-name">{p.item}</span>
                  {p.condition && <span className={`cond-badge cond--${p.condition.replace(' ', '').toLowerCase()}`}>{p.condition}</span>}
                </div>
                {p.category && <span className="item-cat">{CAT_ICONS[p.category]} {p.category}</span>}
                <p className="item-desc">{p.description}</p>
                <div className="item-footer">
                  <div className="ride-driver">
                    <div className="driver-avatar">{p.name ? p.name[0] : '?'}</div>
                    <span>{p.name || 'Anonymous'}</span>
                  </div>
                  <button className="pc-btn">Request</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
