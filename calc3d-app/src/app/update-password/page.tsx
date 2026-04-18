'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/contexts/I18nContext'

export default function UpdatePasswordPage() {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/app')
      }, 2000)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" style={{ background: 'var(--brand)', top: '-100px', left: '-100px' }} />
      <div className="auth-card animate-slide-up">
        <h2 style={{ marginBottom: '1rem' }}>{t('auth.update_password.title')}</h2>
        <p className="text-muted text-sm mb-6">{t('auth.update_password.desc')}</p>

        {success && <div className="alert alert-success mb-4">{t('auth.update_password.success')}</div>}
        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">{t('auth.update_password.label')}</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              minLength={6}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading || success}>
            {loading ? t('auth.update_password.updating') : t('auth.update_password.submit_btn')}
          </button>
        </form>
      </div>
    </div>
  )
}
