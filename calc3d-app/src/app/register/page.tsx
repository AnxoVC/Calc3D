'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/contexts/I18nContext'

export default function RegisterPage() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError(t('auth.pass_min')); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card animate-slide-up" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📩</div>
          <h2 style={{ marginBottom: '0.5rem' }}>¡Casi listo!</h2>
          <div className="alert alert-orange" style={{ margin: '1rem 0', textAlign: 'left', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '1rem', borderRadius: '8px' }}>
            <p style={{ fontWeight: 600, color: 'var(--brand)', marginBottom: '0.5rem' }}>⚠️ ¡Por favor, revisa tu correo electrónico!</p>
            <p className="text-sm">Te hemos enviado un enlace de confirmación. <strong>Debes verificar tu cuenta primero</strong> antes de poder iniciar sesión (revisa la carpeta de Spam/Correo no deseado por si acaso).</p>
          </div>
          <Link href="/login" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Ir a iniciar sesión →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" style={{ background: 'var(--brand)', top: '-100px', right: '-100px' }} />
      <div className="auth-bg-glow" style={{ background: 'var(--accent-cyan)', bottom: '-100px', left: '-100px' }} />
      <div className="auth-card animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>Calc<span className="text-gradient">3D</span></span>
        </div>
        <h2 style={{ marginBottom: '0.25rem' }}>{t('auth.register_title')}</h2>
        <p className="text-muted text-sm mb-6">{t('auth.register_subtitle')}</p>
        {error && <div className="alert alert-danger mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">{t('auth.name')}</label>
            <input type="text" className="form-input" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input type="email" className="form-input" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('auth.password')}</label>
            <input type="password" className="form-input" placeholder={t('auth.pass_min')} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? t('auth.creating') : t('auth.register_btn')}
          </button>
        </form>
        <p className="text-center text-sm text-muted" style={{ marginTop: '1.5rem' }}>
          {t('auth.have_account')}{' '}
          <Link href="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>{t('auth.login_link')}</Link>
        </p>
      </div>
    </div>
  )
}
