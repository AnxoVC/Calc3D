'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/formatters'
import { useTranslation } from '@/contexts/I18nContext'

interface PrintEntry {
  id: string
  name: string
  description: string | null
  weight_g: number | null
  time_hours: number | null
  cost_total: number | null
  status: string
  rating: number | null
  created_at: string
}

export default function DiarioPage() {
  const { t } = useTranslation()
  const [prints, setPrints] = useState<PrintEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', weight_g: '', time_hours: '', cost_total: '', status: 'completed', rating: '5' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('print_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setPrints(data || [])
    setLoading(false)
  }

  useEffect(() => { 
    load() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('print_history').insert({
      user_id: user.id,
      name: form.name,
      description: form.description || null,
      weight_g: form.weight_g ? Number(form.weight_g) : null,
      time_hours: form.time_hours ? Number(form.time_hours) : null,
      cost_total: form.cost_total ? Number(form.cost_total) : null,
      status: form.status,
      rating: Number(form.rating),
    })
    setSaving(false)
    setShowModal(false)
    setForm({ name: '', description: '', weight_g: '', time_hours: '', cost_total: '', status: 'completed', rating: '5' })
    load()
  }

  const statusColors: Record<string, string> = { completed: 'badge-green', failed: 'badge-red', in_progress: 'badge-orange' }
  const statusLabels: Record<string, string> = { 
    completed: t('chronicle.status.completed'), 
    failed: t('chronicle.status.failed'), 
    in_progress: t('chronicle.status.in_progress') 
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="section-header">
          <div>
            <h1 className="page-title">{t('chronicle.title')}</h1>
            <p className="page-subtitle">{t('chronicle.subtitle')}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>{t('chronicle.add_btn')}</button>
        </div>
      </div>

      {loading && <div style={{ color: 'var(--text-muted)', padding: '4rem', textAlign: 'center' }}>{t('common.loading')}</div>}

      {!loading && prints.length === 0 && (
        <div className="empty-state">
          <h3 style={{ marginBottom: '0.5rem' }}>{t('chronicle.empty.title')}</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>{t('chronicle.empty.desc')}</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>{t('chronicle.empty.btn')}</button>
        </div>
      )}

      {!loading && prints.length > 0 && (
        <div className="flex flex-col gap-3">
          {prints.map((p) => (
            <div key={p.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 style={{ fontSize: '1rem' }}>{p.name}</h4>
                  <span className={`badge ${statusColors[p.status] || 'badge-blue'}`}>{statusLabels[p.status] || p.status}</span>
                </div>
                {p.description && <p className="text-muted text-sm mb-2">{p.description}</p>}
                <div className="flex gap-4" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {p.weight_g && <span>{t('chronicle.card.weight')} {p.weight_g}g</span>}
                  {p.time_hours && <span>{t('chronicle.card.time')} {p.time_hours}h</span>}
                  {p.cost_total && <span style={{ color: 'var(--brand)', fontWeight: 600 }}>{t('chronicle.card.cost')} {formatCurrency(p.cost_total)}</span>}
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('chronicle.card.rating')} {p.rating || 0}/5</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{t('chronicle.modal.title')}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">{t('chronicle.modal.name_label')}</label>
                <input className="form-input" placeholder={t('chronicle.modal.name_placeholder')} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('chronicle.modal.desc_label')}</label>
                <textarea className="form-textarea" placeholder={t('chronicle.modal.desc_placeholder')} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">{t('chronicle.modal.weight_label')}</label>
                  <input type="number" className="form-input" placeholder="100" value={form.weight_g} onChange={e => setForm({...form, weight_g: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('chronicle.modal.time_label')}</label>
                  <input type="number" step="0.1" className="form-input" placeholder="3.5" value={form.time_hours} onChange={e => setForm({...form, time_hours: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('chronicle.modal.cost_label')}</label>
                  <input type="number" step="0.01" className="form-input" placeholder="2.50" value={form.cost_total} onChange={e => setForm({...form, cost_total: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('chronicle.modal.status_label')}</label>
                  <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="completed">{t('chronicle.status.completed')}</option>
                    <option value="failed">{t('chronicle.status.failed')}</option>
                    <option value="in_progress">{t('chronicle.status.in_progress')}</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('chronicle.modal.rating_label')}</label>
                <select className="form-select" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}>
                  <option value="5">{t('chronicle.modal.ratings.5')}</option>
                  <option value="4">{t('chronicle.modal.ratings.4')}</option>
                  <option value="3">{t('chronicle.modal.ratings.3')}</option>
                  <option value="2">{t('chronicle.modal.ratings.2')}</option>
                  <option value="1">{t('chronicle.modal.ratings.1')}</option>
                </select>
              </div>
              <div className="flex gap-3" style={{ marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }} onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={saving}>{saving ? t('common.saving') : t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
