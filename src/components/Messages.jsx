import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function Messages({ chats, setChats, currentUser = 'You' }) {
  const [activeId, setActiveId] = useState(null)
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const bottomRef = useRef(null)

  const active = chats.find(c => c.id === activeId)

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages?.length])

  // Load messages from DB when chat is opened
  useEffect(() => {
    if (!activeId) return
    const load = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', activeId)
        .order('created_at', { ascending: true })
      if (data) {
        setChats(prev => prev.map(c =>
          c.id === activeId
            ? { ...c, messages: data.map(m => ({ from: m.sender, text: m.text, time: new Date(m.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) })), unread: 0 }
            : c
        ))
      }
    }
    load()

    // Realtime for this chat
    const channel = supabase
      .channel(`messages-${activeId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${activeId}` }, payload => {
        const m = payload.new
        setChats(prev => prev.map(c =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, { from: m.sender, text: m.text, time: new Date(m.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }] }
            : c
        ))
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [activeId])

  const send = async () => {
    if (!input.trim() || !activeId || sending) return
    setSending(true)
    const { error } = await supabase.from('messages').insert([{
      chat_id: activeId,
      sender: currentUser,
      text: input.trim()
    }])
    if (!error) setInput('')
    setSending(false)
  }

  const markRead = (id) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
    setActiveId(id)
  }

  const totalUnread = chats.reduce((s, c) => s + (c.unread || 0), 0)

  if (chats.length === 0) {
    return (
      <div className="sec-wrap">
        <div className="sec-header">
          <div><h2 className="sec-title">💬 Messages</h2><p className="sec-sub">Your conversations will appear here</p></div>
        </div>
        <div className="empty-state" style={{ gridColumn:'unset' }}>
          <span>💬</span>
          <p>No messages yet. Click "Message" on any ride or room listing to start a conversation.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sec-wrap">
      <div className="sec-header">
        <div>
          <h2 className="sec-title">💬 Messages {totalUnread > 0 && <span className="msg-badge">{totalUnread}</span>}</h2>
          <p className="sec-sub">{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="msg-layout">
        {/* Sidebar */}
        <div className="msg-sidebar">
          {chats.map(c => (
            <button key={c.id} className={`msg-thread ${activeId === c.id ? 'active' : ''}`} onClick={() => markRead(c.id)}>
              <div className="msg-avatar" style={{ background: c.color || 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {c.name[0].toUpperCase()}
              </div>
              <div className="msg-thread-info">
                <div className="msg-thread-top">
                  <span className="msg-thread-name">{c.name}</span>
                  {c.messages?.length > 0 && (
                    <span className="msg-thread-time">{c.messages[c.messages.length - 1].time}</span>
                  )}
                </div>
                <div className="msg-thread-preview">
                  <span>{c.context}</span>
                  {c.unread > 0 && <span className="msg-unread-dot">{c.unread}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="msg-window">
          {!active ? (
            <div className="msg-empty">
              <span>💬</span>
              <p>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div className="msg-win-header">
                <div className="msg-avatar" style={{ background: active.color || 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                  {active.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="msg-win-name">{active.name}</div>
                  <div className="msg-win-context">{active.context}</div>
                </div>
                {active.phone && (
                  <a href={`tel:${active.phone}`} className="pc-btn-call" style={{ marginLeft:'auto' }}>📞 Call</a>
                )}
              </div>

              <div className="msg-bubbles">
                {(active.messages || []).map((m, i) => (
                  <div key={i} className={`msg-bubble-wrap ${m.from === currentUser ? 'mine' : 'theirs'}`}>
                    <div className="msg-bubble">
                      <p>{m.text}</p>
                      <span className="msg-time">{m.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="msg-input-row">
                <input
                  className="msg-input"
                  placeholder="Type a message…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                />
                <button className="msg-send-btn" onClick={send} disabled={sending}>
                  {sending ? '…' : '↑'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
