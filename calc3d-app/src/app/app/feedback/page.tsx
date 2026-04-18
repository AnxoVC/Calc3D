'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/contexts/I18nContext'

export default function FeedbackPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ type: 'suggestion', subject: '', message: '' })
  const [honeyPot, setHoneyPot] = useState('') // Bot trap
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // If honeyPot is filled, it's a bot
    if (honeyPot) {
      console.log('Bot detected')
      setSuccess(true) // Pretend success to fool the bot
      return
    }

    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('feedback').insert({
      user_id: user?.id || null,
      type: form.type,
      subject: form.subject,
      message: form.message,
      status: 'pending'
    })

    setLoading(false)
    if (insertError) {
      setError(t('feedback.error_sending') + insertError.message)
      return
    }
    setSuccess(true)
    setForm({ type: 'suggestion', subject: '', message: '' })
  }

  return (
    <div className="animate-fade-in p-6 max-w-2xl mx-auto">
      <div className="section-header mb-8">
        <div>
          <h1 className="page-title">{t('feedback.title')}</h1>
          <p className="page-subtitle">{t('feedback.subtitle')}</p>
        </div>
      </div>

      {success ? (
        <div className="card p-12 text-center animate-slide-up">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
          <h2 style={{ marginBottom: '1rem' }}>{t('feedback.success.title')}</h2>
          <p className="text-muted mb-8">{t('feedback.success.desc')}</p>
          <button className="btn btn-primary" onClick={() => setSuccess(false)}>{t('feedback.success.send_another')}</button>
        </div>
      ) : (
        <div className="card">
          {error && <div className="alert alert-danger mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="form-group">
              <label className="form-label">{t('feedback.form.type_label')}</label>
              <div className="flex gap-4">
                <label className={`form-input flex items-center gap-2 cursor-pointer ${form.type === 'suggestion' ? 'bg-primary/10 border-primary' : ''}`} style={{ flex: 1 }}>
                  <input type="radio" name="type" value="suggestion" checked={form.type === 'suggestion'} onChange={e => setForm({...form, type: e.target.value})} />
                  <span>{t('feedback.form.suggestion')}</span>
                </label>
                <label className={`form-input flex items-center gap-2 cursor-pointer ${form.type === 'bug' ? 'bg-primary/10 border-primary' : ''}`} style={{ flex: 1 }}>
                  <input type="radio" name="type" value="bug" checked={form.type === 'bug'} onChange={e => setForm({...form, type: e.target.value})} />
                  <span>{t('feedback.form.bug')}</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('feedback.form.subject_label')}</label>
              <input 
                className="form-input" 
                placeholder={t('feedback.form.subject_placeholder')} 
                value={form.subject} 
                onChange={e => setForm({...form, subject: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('feedback.form.message_label')}</label>
              <textarea 
                className="form-input" 
                rows={6} 
                placeholder={t('feedback.form.message_placeholder')} 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})} 
                required 
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* HoneyPot Bot Trap */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input 
                type="text" 
                name="full_name_verification" 
                value={honeyPot} 
                onChange={e => setHoneyPot(e.target.value)} 
                tabIndex={-1} 
                autoComplete="off" 
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-4 text-lg" style={{ justifyContent: 'center' }} disabled={loading}>
              {loading ? t('common.sending') : t('feedback.form.submit_btn')}
            </button>
          </form>
        </div>
      )}

      <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">{t('feedback.info.title')}</h3>
        <p className="text-sm text-muted leading-relaxed">
          {t('feedback.info.desc')}
        </p>
      </div>
    </div>
  )
}
