import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'

import DashboardLayout from './components/layouts/DashboardLayout.tsx'
import Overview from './components/Overview.tsx'
import PastSessions from './components/PastSessions.tsx'

import './App.css'

function LandingPage({ session, showAuthModal, setShowAuthModal, isSignUp, setIsSignUp, email, setEmail, password, setPassword, loading, authError, handleAuth, handleStartInterviewClick, heroRef }: any) {
  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="root">
      {/* Ambient background */}
      <div className="ambient" aria-hidden="true">
        <div className="amb-orb amb-orb-1" />
        <div className="amb-orb amb-orb-2" />
        <div className="amb-grid" />
      </div>

      {/* Nav */}
      <header className="nav">
        <a href="/" className="brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">CoPrep<em>AI</em></span>
        </a>
        <nav className="nav-center">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="nav-right">
          <button className="btn-ghost" onClick={() => { setIsSignUp(false); setShowAuthModal(true) }}>Log in</button>
          <button className="btn-pill" onClick={() => { setIsSignUp(true); setShowAuthModal(true) }}>Get started →</button>
        </div>
      </header>

      {/* Hero */}
      <main className="hero" ref={heroRef}>
        <div className="hero-eyebrow">
          <span className="dot" /> Live interview copilot · Powered by AI
        </div>
        <h1 className="hero-h1">
          Ace every<br />
          <span className="gradient-text">interview.</span>
        </h1>
        <p className="hero-sub">
          Real-time AI answers. On-screen. Invisible to interviewers.<br />
          From coding rounds to system design — CoPrep has you covered.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={handleStartInterviewClick}>
            Start interview session
          </button>
        </div>

        {/* Terminal mockup */}
        <div className="terminal">
          <div className="terminal-bar">
            <span className="tbar-dot r" /><span className="tbar-dot y" /><span className="tbar-dot g" />
            <span className="tbar-title">CoPrep — Live session</span>
          </div>
          <div className="terminal-body">
            <div className="t-line"><span className="t-q">Q</span> Explain the difference between BFS and DFS.</div>
            <div className="t-divider" />
            <div className="t-ans">
              <div className="t-tag">Answer</div>
              <p><strong>BFS (Breadth-First Search)</strong> explores level by level using a queue — ideal for shortest path.</p>
              <p><strong>DFS (Depth-First Search)</strong> explores depth-first using a stack/recursion — better for detecting cycles or paths.</p>
              <div className="t-code">
                {`// BFS  O(V+E)
const bfs = (root) => {
  const queue = [root]
  while (queue.length) {
    const node = queue.shift()
    queue.push(...node.children)
  }
}`}
              </div>
            </div>
            <div className="t-cursor">█</div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="section" id="features">
        <div className="section-label">Capabilities</div>
        <h2 className="section-h2">Everything you need in the hot seat</h2>
        <div className="features-grid">
          {[
            { icon: '⚡', title: 'Real-time answers', desc: 'Responses in under 2 seconds. Coding, behavioral, system design — all handled instantly.' },
            { icon: '👁', title: 'Screen analysis', desc: 'Share your screen and CoPrep reads the question directly — no typing needed.' },
            { icon: '🎯', title: 'Role-targeted', desc: 'Configure your target role, company, and level. Answers are tuned to match expectations.' },
            { icon: '🧩', title: 'STAR method', desc: 'Behavioral questions answered with structured Situation, Task, Action, Result format.' },
            { icon: '🏗', title: 'System design', desc: 'Components, trade-offs, and scalability — delivered as clear, structured breakdowns.' },
            { icon: '🔒', title: 'Stays private', desc: 'Invisible overlay that interviewers cannot detect. Your secret weapon, always.' },
          ].map(f => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section alt-section" id="how-it-works">
        <div className="section-label">Process</div>
        <h2 className="section-h2">Three steps to your offer</h2>
        <div className="steps">
          {[
            { n: '01', title: 'Configure your session', desc: 'Set your target role, company, interview type, and experience level.' },
            { n: '02', title: 'Launch the desktop app', desc: 'One click opens the CoPrep overlay — a floating panel invisible to screen share.' },
            { n: '03', title: 'Get real-time answers', desc: 'Questions appear on screen or type them in. AI responds in seconds. Ace it.' },
          ].map(s => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <div className="section-label">Pricing</div>
        <h2 className="section-h2">Simple, honest pricing</h2>
        <div className="pricing-grid">
          {[
            { name: 'Starter', price: '$0', period: 'forever', desc: 'Try CoPrep with no commitment.', features: ['5 sessions / month', 'Text-based answers', 'Standard response speed'], cta: 'Get started free', primary: false },
            { name: 'Pro', price: '$19', period: 'per month', desc: 'For serious candidates who want every edge.', features: ['Unlimited sessions', 'Screen analysis', 'Priority AI responses', 'Role & company targeting', 'Behavioral STAR templates'], cta: 'Start Pro trial', primary: true },
          ].map(plan => (
            <div className={`price-card ${plan.primary ? 'price-card--featured' : ''}`} key={plan.name}>
              {plan.primary && <div className="price-badge">Most popular</div>}
              <div className="price-name">{plan.name}</div>
              <div className="price-amount">{plan.price}<span>/{plan.period}</span></div>
              <p className="price-desc">{plan.desc}</p>
              <ul className="price-features">
                {plan.features.map(f => <li key={f}><span className="check">✓</span>{f}</li>)}
              </ul>
              <button className={plan.primary ? 'btn-primary btn-block' : 'btn-outline btn-block'} onClick={handleStartInterviewClick}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">CoPrep<em>AI</em></span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} CoPrep AI · All rights reserved</p>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setShowAuthModal(false)}>✕</button>
            <div className="modal-icon">◈</div>
            <h2>{isSignUp ? 'Create account' : 'Welcome back'}</h2>
            <p className="modal-sub">{isSignUp ? 'Start your interview journey.' : 'Sign in to your session.'}</p>
            {authError && <div className="auth-err">{authError}</div>}
            <form onSubmit={handleAuth}>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              <button type="submit" className="btn-primary btn-block" disabled={loading}>
                {loading ? 'Processing…' : (isSignUp ? 'Create account' : 'Sign in')}
              </button>
            </form>
            <p className="modal-switch">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button className="link-btn" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState('')
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    try {
      let error
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password })
        error = signUpError
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        error = signInError
      }
      if (error) setAuthError(error.message)
      else setShowAuthModal(false)
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  const handleStartInterviewClick = () => {
    if (!session) { setShowAuthModal(true); return }
  }

  const landingProps = {
    session, showAuthModal, setShowAuthModal, isSignUp, setIsSignUp, email, setEmail, password, setPassword, loading, authError, handleAuth, handleStartInterviewClick, heroRef
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage {...landingProps} />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={session ? <DashboardLayout session={session} /> : <Navigate to="/" replace />}
        >
          <Route index element={<Overview />} />
          <Route path="sessions" element={<PastSessions />} />
          <Route path="settings" element={<div className="dashboard-content"><h1 className="section-h2">Settings</h1><p>Coming soon...</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App