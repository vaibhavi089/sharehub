import { useState } from 'react'

const ROUTES = ['Satellite → Navrangpura','Bopal → CG Road','Chandkheda → Vastrapur','Gota → Prahlad Nagar','Thaltej → Paldi','Nikol → Iscon']
const AREAS  = ['Navrangpura','Satellite','Bopal','Vastrapur','Chandkheda','Gota','Prahlad Nagar','Paldi']
const STATS  = [{ v:'2.4K+', l:'Members' },{ v:'800+', l:'Rides Shared' },{ v:'320+', l:'Rooms Listed' },{ v:'₹0', l:'Platform Fee' }]
const TESTIMONIALS = [
  { name:'Riya Shah', role:'Student, Gujarat University', text:'Found my PG in Navrangpura within a day. No broker, no commission. Saved ₹8,000!', avatar:'R', color:'#6366f1' },
  { name:'Mihir Patel', role:'Software Engineer, Bopal', text:'Carpooling daily from Bopal to Prahlad Nagar. Saving ₹2,400 a month on fuel.', avatar:'M', color:'#10b981' },
  { name:'Priya Joshi', role:'PG Owner, Vastrapur', text:'Listed my PG and got 3 inquiries the same day. The messaging feature is great!', avatar:'P', color:'#f59e0b' },
]

export default function Landing({ onGetStarted }) {
  const [mode, setMode] = useState('carpool')
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')
  const [date, setDate] = useState('')
  const [area, setArea] = useState('')

  return (
    <div className="land">

      {/* NAV */}
      <nav className="land-nav">
        <div className="land-nav-inner">
          <span className="land-logo">◈ ShareHub</span>
          <div className="land-nav-links">
            <span className="land-city-pill">📍 Ahmedabad</span>
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <button className="land-nav-btn" onClick={() => onGetStarted()}>Open App →</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="land-hero">
        <div className="land-hero-inner">
          <span className="land-badge">✦ Ahmedabad's Community Platform</span>
          <h1 className="land-h1">Find a ride.<br /><span className="land-accent">Find a room.</span><br />Right here.</h1>
          <p className="land-sub">Carpooling and PG listings built for Ahmedabad. No brokers, no middlemen — connect directly.</p>

          <div className="land-toggle">
            <button className={mode === 'carpool' ? 'on' : ''} onClick={() => setMode('carpool')}>🚗 Find a Ride</button>
            <button className={mode === 'room' ? 'on' : ''} onClick={() => setMode('room')}>🏠 Find a PG / Room</button>
          </div>

          {mode === 'carpool' ? (
            <div className="land-search">
              <div className="land-sf">
                <label>From</label>
                <input placeholder="e.g. Satellite, Bopal" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div className="land-sdiv" />
              <div className="land-sf">
                <label>To</label>
                <input placeholder="e.g. Navrangpura, CG Road" value={to} onChange={e => setTo(e.target.value)} />
              </div>
              <div className="land-sdiv" />
              <div className="land-sf">
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <button className="land-search-btn" onClick={() => onGetStarted('carpool')}>Search</button>
            </div>
          ) : (
            <div className="land-search">
              <div className="land-sf" style={{flex:2}}>
                <label>Area in Ahmedabad</label>
                <input placeholder="e.g. Navrangpura, Vastrapur, Bopal" value={area} onChange={e => setArea(e.target.value)} />
              </div>
              <div className="land-sdiv" />
              <div className="land-sf">
                <label>Type</label>
                <select className="land-select">
                  <option value="">Any type</option>
                  <option>PG</option><option>Private Room</option><option>Shared Room</option><option>Full Flat</option>
                </select>
              </div>
              <button className="land-search-btn" onClick={() => onGetStarted('room')}>Search</button>
            </div>
          )}

          <div className="land-chips">
            <span className="land-chips-label">{mode === 'carpool' ? 'Popular:' : 'Areas:'}</span>
            {(mode === 'carpool' ? ROUTES : AREAS).map(r => (
              <button key={r} className="land-chip" onClick={() => onGetStarted(mode)}>{r}</button>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="land-stats">
        {STATS.map(s => (
          <div key={s.l} className="land-stat">
            <span className="land-stat-v">{s.v}</span>
            <span className="land-stat-l">{s.l}</span>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="land-section" id="features">
        <p className="land-label">What We Offer</p>
        <h2 className="land-sh2">Two ways to save in Ahmedabad</h2>
        <div className="land-feat-grid">
          <div className="land-feat-card">
            <div className="land-feat-icon" style={{background:'rgba(99,102,241,0.15)'}}>🚗</div>
            <h3>Carpooling</h3>
            <p>Share your daily commute. Split fuel costs, reduce traffic, meet great people. Drivers post routes — passengers book seats.</p>
            <ul>
              <li>✓ Daily office commutes</li>
              <li>✓ Intercity trips from Ahmedabad</li>
              <li>✓ Split fuel costs fairly</li>
              <li>✓ In-app chat with drivers</li>
            </ul>
            <button onClick={() => onGetStarted('carpool')}>Find a Ride →</button>
          </div>
          <div className="land-feat-card">
            <div className="land-feat-icon" style={{background:'rgba(139,92,246,0.15)'}}>🏠</div>
            <h3>PG & Room Listings</h3>
            <p>PG owners list rooms. Students and professionals browse, filter by area and budget, contact directly — zero brokerage.</p>
            <ul>
              <li>✓ PGs, private rooms & full flats</li>
              <li>✓ All areas of Ahmedabad</li>
              <li>✓ Zero brokerage</li>
              <li>✓ In-app chat with owners</li>
            </ul>
            <button onClick={() => onGetStarted('room')}>Browse Rooms →</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="land-section land-section--alt" id="how">
        <p className="land-label">Simple Process</p>
        <h2 className="land-sh2">Up and running in minutes</h2>
        <div className="land-how-grid">
          <div className="land-how-col">
            <div className="land-how-title">🚗 For Carpooling</div>
            {[['01','Post your route','Enter pickup, destination, date, time and seats.'],
              ['02','Passengers find you','People searching that route see your listing.'],
              ['03','Chat & go','Confirm in-app and share the ride.']].map(([n,t,d]) => (
              <div key={n} className="land-step">
                <span className="land-step-n">{n}</span>
                <div><strong>{t}</strong><p>{d}</p></div>
              </div>
            ))}
          </div>
          <div className="land-how-col">
            <div className="land-how-title">🏠 For PG / Rooms</div>
            {[['01','List your property','Add area, rent, amenities and contact.'],
              ['02','Tenants browse','Filter by area, budget and type.'],
              ['03','Chat & finalize','Message in-app, visit and close the deal.']].map(([n,t,d]) => (
              <div key={n} className="land-step">
                <span className="land-step-n">{n}</span>
                <div><strong>{t}</strong><p>{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="land-section" id="testimonials">
        <p className="land-label">Real People</p>
        <h2 className="land-sh2">What Ahmedabad says</h2>
        <div className="land-test-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="land-test-card">
              <p className="land-test-text">"{t.text}"</p>
              <div className="land-test-author">
                <div className="land-test-av" style={{background:t.color}}>{t.avatar}</div>
                <div>
                  <div className="land-test-name">{t.name}</div>
                  <div className="land-test-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="land-cta">
        <h2>Built for Ahmedabad.</h2>
        <p>Join your neighbors already saving money and time every day.</p>
        <div className="land-cta-btns">
          <button className="land-cta-btn" onClick={() => onGetStarted('carpool')}>🚗 Find a Ride</button>
          <button className="land-cta-btn land-cta-outline" onClick={() => onGetStarted('room')}>🏠 Find a Room</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div>
            <div className="land-logo" style={{marginBottom:8}}>◈ ShareHub</div>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.45)',lineHeight:1.6}}>Connecting Ahmedabad — one ride and one room at a time.</p>
          </div>
          <div className="land-footer-cols">
            <div className="land-footer-col">
              <h4>Platform</h4>
              <button onClick={() => onGetStarted('carpool')}>Carpooling</button>
              <button onClick={() => onGetStarted('room')}>PG & Rooms</button>
            </div>
            <div className="land-footer-col">
              <h4>Areas</h4>
              {AREAS.slice(0,4).map(a => <span key={a}>{a}</span>)}
            </div>
            <div className="land-footer-col">
              <h4>Contact</h4>
              <span>hello@sharehub.in</span>
              <span>Ahmedabad, Gujarat</span>
            </div>
          </div>
        </div>
        <div className="land-footer-bottom">
          <span>© 2026 ShareHub Ahmedabad</span>
          <span>Zero brokerage · Free platform</span>
        </div>
      </footer>
    </div>
  )
}
