'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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

  useEffect(() => { load() }, [])

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
  const statusLabels: Record<string, string> = { completed: 'Completada', failed: 'Fallida', in_progress: 'En curso' }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="section-header">
          <div>
            <h1 className="page-title">Diario</h1>
            <p className="page-subtitle">Historial de tus impresiones</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nueva entrada</button>
        </div>
      </div>

      {loading && <div style={{ color: 'var(--text-muted)', padding: '4rem', textAlign: 'center' }}>Cargando...</div>}

      {!loading && prints.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h3 style={{ marginBottom: '0.5rem' }}>Sin impresiones aún</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Registra tu primera impresión para empezar a llevar el historial.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Añadir impresión</button>
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
                  {p.weight_g && <span>Peso: {p.weight_g}g</span>}
                  {p.time_hours && <span>Tiempo: {p.time_hours}h</span>}
                  {p.cost_total && <span style={{ color: 'var(--brand)', fontWeight: 600 }}>Coste: {p.cost_total.toFixed(2)}€</span>}
                  <span>{new Date(p.created_at).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Puntuación: {p.rating || 0}/5</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Nueva entrada en el diario</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" placeholder="Ej: Soporte monitor" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción (opcional)</label>
                <textarea className="form-textarea" placeholder="Notas sobre esta impresión..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Peso (g)</label>
                  <input type="number" className="form-input" placeholder="100" value={form.weight_g} onChange={e => setForm({...form, weight_g: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tiempo (h)</label>
                  <input type="number" step="0.1" className="form-input" placeholder="3.5" value={form.time_hours} onChange={e => setForm({...form, time_hours: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Coste total (€)</label>
                  <input type="number" step="0.01" className="form-input" placeholder="2.50" value={form.cost_total} onChange={e => setForm({...form, cost_total: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="completed">Completada</option>
                    <option value="failed">Fallida</option>
                    <option value="in_progress">En curso</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Valoración</label>
                <select className="form-select" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}>
                  <option value="5">5 - Excelente</option>
                  <option value="4">4 - Muy bien</option>
                  <option value="3">3 - Bien</option>
                  <option value="2">2 - Regular</option>
                  <option value="1">1 - Mal</option>
                </select>
              </div>
              <div className="flex gap-3" style={{ marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
