import { useState } from 'react'

const SAMPLE = [
  { id: 1, skill: 'Guitar Lessons', level: 'Advanced', offering: 'Teaching', description: 'Classical and western guitar. 8 years experience. Beginner to intermediate students welcome. Weekday evenings.', name: 'Aditya N.', postedAt: '10/05/2026' },
  { id: 2, skill: 'Web Development', level: 'Expert', offering: 'Teaching', description: 'React, Node.js, full-stack. Can help with projects or teach from scratch. Open to skill exchange for design work.', name: 'Pooja M.', postedAt: '09/05/2026' },
  { id: 3, skill: 'Yoga & Meditation', level: 'Intermediate', offering: 'Exchange', description: 'Certified yoga instructor. Looking to exchange for cooking lessons or language tutoring. Morning sessions.', name: 'Divya K.', postedAt: '11/05/2026' },
]

const LEVEL_COLORS = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#6366f1', Expert: '#ef4444' }
const OFFER_ICONS = { Teaching: '🎓', 'Looking to Learn': '📖', Exchange: '🔄' }

export default function SkillSection({ posts, setPosts }) {
  const [form, setForm] = useState({ skill: '', level: '', offering: '', description: '', name: '' })
  const [search, setSearch] = useState('')
  const [filterOffer, setFilterOffer] = useState('')
  const [showForm, setShowForm] = useState(false)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.skill || !form.description) return
    setPosts(p => [{ ...form, id: Date.now(), postedAt: new Date().toLocaleDateString() }, ...p])
    setForm({ skill: '', level: '', offering: '', description: '', name: '' })
    setShowForm(false)
  }

  const allPosts = [...posts, ...SAMPLE]
  const filtered = allPosts.filter(p =>
    (p.skill.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) &&
    (filterOffer === '' || p.offering === filterOffer)
  )

  return (
    <div className="sec-wrap">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">💡 Skill Exchange</h2>
          <p className="sec-sub">{filtered.length} skill{filtered.length !== 1 ? 's' : ''} listed</p>
        </div>
        <button className={`add-btn ${showForm ? 'cancel' : ''}`} onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Share a Skill'}
        </button>
      </div>

      <div className="filter-row">
        <input className="filter-search" placeholder="🔍  Search skills…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-chips">
          {['', 'Teaching', 'Looking to Learn', 'Exchange'].map(o => (
            <button key={o} className={`fchip ${filterOffer === o ? 'fchip--on' : ''}`} onClick={() => setFilterOffer(o)}>
              {o ? `${OFFER_ICONS[o]} ${o}` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="glass-form">
          <h3>Share Your Skill</h3>
          <form onSubmit={handleSubmit}>
            <input className="fi" placeholder="Skill name *" value={form.skill} onChange={e => f('skill', e.target.value)} required />
            <div className="form-row">
              <select className="fi" value={form.level} onChange={e => f('level', e.target.value)}>
                <option value="">Your level</option>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
              </select>
              <select className="fi" value={form.offering} onChange={e => f('offering', e.target.value)}>
                <option value="">I am…</option>
                <option>Teaching</option><option>Looking to Learn</option><option>Exchange</option>
              </select>
            </div>
            <textarea className="fi" placeholder="Describe what you can teach or want to learn, your availability… *" rows="3" value={form.description} onChange={e => f('description', e.target.value)} required />
            <input className="fi" placeholder="Your name" value={form.name} onChange={e => f('name', e.target.value)} />
            <button type="submit" className="submit-btn">Post Skill →</button>
          </form>
        </div>
      )}

      <div className="cards-grid">
        {filtered.length === 0
          ? <div className="empty-state"><span>💡</span><p>No skills listed yet. Share what you know!</p></div>
          : filtered.map(p => (
            <div key={p.id} className="skill-card">
              <div className="skill-top">
                <span className="skill-name">{p.skill}</span>
                {p.level && <span className="skill-level" style={{ background: LEVEL_COLORS[p.level] || '#6366f1' }}>{p.level}</span>}
              </div>
              {p.offering && (
                <span className="skill-offer">{OFFER_ICONS[p.offering]} {p.offering}</span>
              )}
              <p className="skill-desc">{p.description}</p>
              <div className="skill-footer">
                <div className="ride-driver">
                  <div className="driver-avatar">{p.name ? p.name[0] : '?'}</div>
                  <span>{p.name || 'Anonymous'}</span>
                </div>
                <button className="pc-btn">Connect</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
