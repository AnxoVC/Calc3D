'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/app')
      router.refresh()
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" style={{ background: 'var(--brand)', top: '-100px', left: '-100px' }} />
      <div className="auth-bg-glow" style={{ background: 'var(--accent-purple)', bottom: '-100px', right: '-100px' }} />
      <div className="auth-card animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>Calc<span className="text-gradient">3D</span></span>
        </div>
        <h2 style={{ marginBottom: '0.25rem' }}>Bienvenido de vuelta</h2>
        <p className="text-muted text-sm mb-6">Inicia sesión en tu cuenta</p>
        {error && <div className="alert alert-danger mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
          </button>
        </form>
        <p className="text-center text-sm text-muted" style={{ marginTop: '1.5rem' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>Regístrate gratis</Link>
        </p>
        <p className="text-center" style={{ marginTop: '1rem' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>← Volver al inicio</Link>
        </p>
      </div>
    </div>
  )
}
