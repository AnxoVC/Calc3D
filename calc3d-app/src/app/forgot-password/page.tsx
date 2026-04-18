'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useTranslation } from '@/contexts/I18nContext'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage(t('auth.forgot_password.success'))
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" style={{ background: 'var(--brand)', top: '-100px', left: '-100px' }} />
      <div className="auth-card animate-slide-up">
        <h2 style={{ marginBottom: '1rem' }}>{t('auth.forgot_password.title')}</h2>
        <p className="text-muted text-sm mb-6">{t('auth.forgot_password.desc')}</p>

        {message && <div className="alert alert-success mb-4">{message}</div>}
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">{t('auth.email')}</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="tu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? t('auth.forgot_password.sending') : t('auth.forgot_password.submit_btn')}
          </button>
        </form>

        <p className="text-center" style={{ marginTop: '1.5rem' }}>
          <Link href="/login" style={{ color: 'var(--brand)', fontSize: '0.9rem', fontWeight: 600 }}>{t('auth.forgot_password.back_login')}</Link>
        </p>
      </div>
    </div>
  )
}
