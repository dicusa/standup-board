import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { BoardData, DailyUpdate } from './models'
import { readBoard, writeBoard } from './storage'

type View = 'board' | 'update' | 'blockers'

export default function App() {
  const [view, setView] = useState<View>('board')
  const [data, setData] = useState<BoardData | null>(null)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [yesterday, setYesterday] = useState('')
  const [today, setToday] = useState('')
  const [blocker, setBlocker] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    try {
      const saved = readBoard()
      setData(saved)
      setName(saved.personName)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not load your saved board.')
    }
  }, [])

  const todaysUpdates = useMemo(() => {
    const date = new Date().toLocaleDateString('en-CA')
    return (data?.updates ?? []).filter(update => update.updateDate === date)
  }, [data])
  const openBlockers = todaysUpdates.filter(update => update.blocker.trim() && !update.blockerResolved)

  function save(next: BoardData) {
    try {
      writeBoard(next)
      setData(next)
      setError('')
      return true
    } catch {
      setError('Your changes could not be saved. Check browser storage settings and try again.')
      return false
    }
  }

  function submitUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!data) return
    const cleanName = name.trim()
    if (!cleanName) return
    const update: DailyUpdate = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now()),
      personName: cleanName, yesterday: yesterday.trim(), today: today.trim(), blocker: blocker.trim(),
      blockerResolved: false, updateDate: new Date().toLocaleDateString('en-CA'),
    }
    if (save({ personName: cleanName, updates: [...data.updates.filter(item => !(item.personName.toLowerCase() === cleanName.toLowerCase() && item.updateDate === update.updateDate)), update] })) {
      setYesterday(''); setToday(''); setBlocker(''); setNotice('Your update is on today’s board.'); setView('board')
    }
  }

  function resolve(update: DailyUpdate) {
    if (!data) return
    save({ ...data, updates: data.updates.map(item => item.id === update.id ? { ...item, blockerResolved: true } : item) })
  }

  const title = view === 'board' ? 'Today’s board' : view === 'update' ? 'Post an update' : 'Blockers'
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="topbar">
      <a className="brand" href="#board" onClick={(event) => { event.preventDefault(); setView('board') }} aria-label="Standup Board home"><span className="brand-mark" aria-hidden="true">S</span><span>standup<span className="brand-light">board</span></span></a>
      <div className="topbar-right"><span className="today-label"><span className="status-dot" /> Team workspace</span><span className="avatar" aria-hidden="true">{name.trim().charAt(0).toUpperCase() || 'Y'}</span></div>
    </header>
    <div className="workspace">
      <aside className="sidebar" aria-label="Main navigation">
        <p className="nav-label">WORKSPACE</p>
        <nav className="nav-list">
          <button className={`nav-item ${view === 'board' ? 'active' : ''}`} onClick={() => { setView('board'); setNotice('') }}><span className="nav-icon" aria-hidden="true">▦</span><span>Today’s board</span><span className="nav-count">{todaysUpdates.length}</span></button>
          <button className={`nav-item ${view === 'update' ? 'active' : ''}`} onClick={() => { setView('update'); setNotice('') }}><span className="nav-icon" aria-hidden="true">＋</span><span>Post an update</span></button>
          <button className={`nav-item ${view === 'blockers' ? 'active' : ''}`} onClick={() => { setView('blockers'); setNotice('') }}><span className="nav-icon" aria-hidden="true">⚑</span><span>Blockers</span>{openBlockers.length > 0 && <span className="nav-count alert-count">{openBlockers.length}</span>}</button>
        </nav>
        <div className="sidebar-foot"><span className="privacy-icon" aria-hidden="true">◉</span><div><strong>Private by design</strong><p>Your updates stay in this browser.</p></div></div>
      </aside>
      <main id="main" className="main-content">
        <div className="page-heading"><div><p className="eyebrow">YOUR TEAM · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</p><h1>{title}</h1><p className="page-subtitle">{view === 'board' ? 'A little progress, shared every day.' : view === 'update' ? 'Share what moved, what’s next, and where you need a hand.' : 'Keep the team moving by surfacing what’s in the way.'}</p></div>{view !== 'update' && <button className="button button-primary" onClick={() => setView('update')}><span aria-hidden="true">＋</span> Post an update</button>}</div>
        {error && <div className="state-banner error-state" role="alert"><span className="state-symbol" aria-hidden="true">!</span><div><strong>We couldn’t access your saved board</strong><p>{error}</p><button className="text-button" onClick={() => { setError(''); setData(null); try { const saved = readBoard(); setData(saved); setName(saved.personName) } catch (cause) { setError(cause instanceof Error ? cause.message : 'Please try again.') } }}>Try again</button></div></div>}
        {!data && !error && <div className="loading-state" role="status"><span className="spinner" aria-hidden="true" /> Loading your board…</div>}
        {data && !error && view === 'board' && <>
          {notice && <div className="state-banner success-state" role="status"><span aria-hidden="true">✓</span>{notice}<button className="dismiss" aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}
          <section className="summary-row" aria-label="Today at a glance"><article className="summary-card"><span className="summary-icon purple" aria-hidden="true">▦</span><div><span className="summary-title">UPDATES SHARED</span><strong>{todaysUpdates.length}<small> today</small></strong></div></article><article className="summary-card"><span className="summary-icon orange" aria-hidden="true">⚑</span><div><span className="summary-title">OPEN BLOCKERS</span><strong>{openBlockers.length}<small> need attention</small></strong></div></article><article className="summary-card encouragement"><span className="summary-icon green" aria-hidden="true">✳</span><div><span className="summary-title">TEAM MOMENTUM</span><strong>{todaysUpdates.length ? 'In motion' : 'Ready to start'}</strong></div></article></section>
          <div className="section-heading"><div><h2>Team updates</h2><p>See what everyone is working on today.</p></div><span className="date-chip"><span aria-hidden="true">◷</span> Today</span></div>
          {todaysUpdates.length === 0 ? <section className="empty-card"><div className="empty-art" aria-hidden="true"><span className="art-sun" /><span className="art-card art-card-back" /><span className="art-card art-card-front"><i /><i /><i /></span><span className="art-sparkle">✦</span></div><h3>A fresh day starts here</h3><p>No updates yet. Share your progress and help your team see what’s moving.</p><button className="button button-primary" onClick={() => setView('update')}><span aria-hidden="true">＋</span> Share your update</button><span className="empty-footnote">It only takes a minute</span></section> : <div className="updates-list">{todaysUpdates.map(update => <article className="update-card" key={update.id}><div className="update-person"><span className="person-avatar">{update.personName.charAt(0).toUpperCase()}</span><strong>{update.personName}</strong><span className="posted-label">Posted today</span></div><div className="update-columns"><div><h3>Yesterday</h3><p>{update.yesterday || 'No update provided.'}</p></div><div><h3>Today</h3><p>{update.today || 'No update provided.'}</p></div></div>{update.blocker.trim() && <div className={`blocker-callout ${update.blockerResolved ? 'resolved' : ''}`}><span aria-hidden="true">⚑</span><span><strong>{update.blockerResolved ? 'Resolved blocker' : 'Blocker'}</strong>{update.blocker}</span>{!update.blockerResolved && <button className="text-button" onClick={() => resolve(update)}>Mark resolved</button>}</div>}</article>)}</div>}
        </>}
        {data && !error && view === 'update' && <form className="form-card" onSubmit={submitUpdate}><div className="form-intro"><span className="form-icon" aria-hidden="true">✎</span><div><h2>Your daily update</h2><p>Keep it brief. Your team will see this on today’s board.</p></div></div><label className="field-label" htmlFor="person-name">Your name <span className="required">*</span></label><input id="person-name" className="text-input" autoComplete="name" placeholder="e.g. Alex Morgan" value={name} onChange={event => setName(event.target.value)} required maxLength={80} /><p className="field-hint">We’ll remember your name in this browser.</p><label className="field-label" htmlFor="yesterday">What did you work on yesterday? <span className="required">*</span></label><textarea id="yesterday" className="text-input textarea" placeholder="A few highlights from your day…" value={yesterday} onChange={event => setYesterday(event.target.value)} required maxLength={1000} /><label className="field-label" htmlFor="today">What are you working on today? <span className="required">*</span></label><textarea id="today" className="text-input textarea" placeholder="What’s your main focus today?" value={today} onChange={event => setToday(event.target.value)} required maxLength={1000} /><label className="field-label" htmlFor="blocker">Any blockers? <span className="optional">OPTIONAL</span></label><textarea id="blocker" className="text-input textarea short-textarea" placeholder="Anything slowing you down?" value={blocker} onChange={event => setBlocker(event.target.value)} maxLength={1000} /><div className="form-actions"><span className="privacy-note"><span aria-hidden="true">◉</span> Saved only in this browser</span><button className="button button-primary" type="submit">Share update <span aria-hidden="true">→</span></button></div></form>}
        {data && !error && view === 'blockers' && <><div className="section-heading blockers-heading"><div><h2>Open blockers <span className="heading-count">{openBlockers.length}</span></h2><p>Things that could use a little help from the team.</p></div></div>{openBlockers.length === 0 ? <section className="empty-card blockers-empty"><div className="clear-art" aria-hidden="true"><span>✓</span></div><h3>All clear for now</h3><p>No open blockers on today’s board. If something gets in the way, add it to your update.</p><button className="button button-secondary" onClick={() => setView('board')}>Back to the board</button></section> : <div className="updates-list">{openBlockers.map(update => <article className="blocker-card" key={update.id}><div className="blocker-top"><span className="blocker-flag" aria-hidden="true">⚑</span><span className="open-label">OPEN</span><span className="blocker-owner">Raised by <strong>{update.personName}</strong></span></div><p>{update.blocker}</p><button className="button button-secondary" onClick={() => resolve(update)}>✓ Mark as resolved</button></article>)}</div>}</>}
        <footer className="page-footer"><span>Made for teams that move together <span aria-hidden="true">✳</span></span><span>Standup Board <span className="footer-dot">·</span> Your team, in sync</span></footer>
      </main>
    </div>
  </div>
}
