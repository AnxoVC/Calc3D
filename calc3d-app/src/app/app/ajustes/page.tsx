'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/contexts/I18nContext'
import { type Language } from '@/locales'

export default function AjustesPage() {
  const { t, language, setLanguage } = useTranslation()
  const [form, setForm] = useState({ default_kwh_price: '0.15', default_spool_weight_g: '1000' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  
  // Password change states
  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email || '')
      const { data } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single()
      if (data) setForm({ default_kwh_price: String(data.default_kwh_price), default_spool_weight_g: String(data.default_spool_weight_g) })
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { user_id: user.id, default_kwh_price: Number(form.default_kwh_price), default_spool_weight_g: Number(form.default_spool_weight_g), updated_at: new Date().toISOString() }
    const { error } = await supabase.from('user_settings').upsert(payload)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  async function handlePasswordChange() {
    if (!newPassword || newPassword.length < 6) {
      setPasswordError(t('settings.password.min'))
      return
    }
    setChangingPassword(true)
    setPasswordError('')
    setPasswordChanged(false)
    
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    
    setChangingPassword(false)
    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordChanged(true)
      setNewPassword('')
      setTimeout(() => setPasswordChanged(false), 3000)
    }
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('common.loading') || 'Cargando...'}</div>

  return (
    <div className="animate-fade-in" style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1 className="page-title">{t('settings.title')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      <div className="card mb-6">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{t('settings.profile')}</h3>
        <div className="form-group mb-4">
          <label className="form-label">{t('settings.email')}</label>
          <input className="form-input" value={userEmail} disabled style={{ opacity: 0.7 }} />
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

        <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{t('settings.language.title')}</h4>
        <p className="text-sm text-muted mb-4">{t('settings.language.desc')}</p>
        
        <div className="flex gap-2 mb-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {[
            { code: 'es', label: 'Español', flag: '🇪🇸' },
            { code: 'en', label: 'English', flag: '🇺🇸' },
            { code: 'gl', label: 'Galego', flag: '⬜🟦' },
            { code: 'pt', label: 'Português', flag: '🇵🇹' }
          ].map((l) => (
            <button 
              key={l.code}
              onClick={() => setLanguage(l.code as Language)}
              className={`btn ${language === l.code ? 'btn-primary' : 'btn-outline'}`}
              style={{ justifyContent: 'center', padding: '0.75rem' }}
            >
              <span style={{ marginRight: '0.5rem' }}>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />
        
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{t('settings.password.title')}</h4>
        <p className="text-sm text-muted mb-4">{t('settings.password.desc')}</p>
        
        {passwordError && <div className="alert alert-danger mb-4">{passwordError}</div>}
        {passwordChanged && <div className="alert alert-success mb-4">{t('settings.password.success')}</div>}

        <div className="form-group mb-4">
          <label className="form-label">{t('settings.password.new')}</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder={t('settings.password.min')}
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
          />
        </div>
        <button 
          className="btn btn-outline w-full" 
          style={{ justifyContent: 'center' }} 
          disabled={changingPassword || !newPassword}
          onClick={handlePasswordChange}
        >
          {changingPassword ? t('settings.password.updating') : t('settings.password.update')}
        </button>
      </div>

      <form className="card mb-10" onSubmit={handleSave}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{t('settings.defaults.title')}</h3>
        <p className="text-sm text-muted mb-6">{t('settings.defaults.desc')}</p>
        <div className="form-grid mb-6">
          <div className="form-group">
            <label className="form-label">{t('settings.defaults.elec')}</label>
            <div className="input-wrapper">
              <span className="input-prefix">€</span>
              <input type="number" step="0.001" className="form-input" value={form.default_kwh_price} onChange={e => setForm({...form, default_kwh_price: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('settings.defaults.weight')}</label>
            <input type="number" className="form-input" value={form.default_spool_weight_g} onChange={e => setForm({...form, default_spool_weight_g: e.target.value})} required />
          </div>
        </div>
        <div className="flex justify-between items-center">
          {saved ? <span className="alert alert-success" style={{ padding: '0.5rem 1rem' }}>{t('settings.defaults.saved')}</span> : <span />}
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? t('settings.defaults.saving') : t('settings.defaults.save')}</button>
        </div>
      </form>


      <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5 }}>
        <p className="text-xs">MyCalc3D by AnxoVC - Versión 1.0.0</p>
      </div>
    </div>
  )
}
