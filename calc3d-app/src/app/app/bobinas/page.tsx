'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Spool {
  id: string; brand: string | null; material: string | null; color_name: string | null;
  color_hex: string; total_weight_g: number; remaining_weight_g: number;
  purchase_price: number | null; created_at: string
}

export default function BobinasPage() {
  const [spools, setSpools] = useState<Spool[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ brand: '', material: 'PLA', color_name: 'Blanco', color_hex: '#ffffff', total_weight_g: '1000', remaining_weight_g: '1000', purchase_price: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('spools').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setSpools(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = {
      user_id: user.id,
      brand: form.brand || null, material: form.material || null, color_name: form.color_name || null,
      color_hex: form.color_hex, total_weight_g: Number(form.total_weight_g),
      remaining_weight_g: Number(form.remaining_weight_g),
      purchase_price: form.purchase_price ? Number(form.purchase_price) : null,
    }
    if (editId) await supabase.from('spools').update(payload).eq('id', editId)
    else await supabase.from('spools').insert(payload)
    setSaving(false); setShowModal(false); resetForm(); load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('spools').delete().eq('id', id)
    load()
  }

  function resetForm() {
    setForm({ brand: '', material: 'PLA', color_name: 'Blanco', color_hex: '#ffffff', total_weight_g: '1000', remaining_weight_g: '1000', purchase_price: '' })
    setEditId(null)
  }

  function openEdit(s: Spool) {
    setForm({ brand: s.brand || '', material: s.material || 'PLA', color_name: s.color_name || '', color_hex: s.color_hex, total_weight_g: String(s.total_weight_g), remaining_weight_g: String(s.remaining_weight_g), purchase_price: s.purchase_price ? String(s.purchase_price) : '' })
    setEditId(s.id); setShowModal(true)
  }

  function getPct(s: Spool) { return Math.max(0, Math.min(100, (s.remaining_weight_g / s.total_weight_g) * 100)) }
  function getPctClass(p: number) { return p > 50 ? 'high' : p > 20 ? 'medium' : 'low' }

  return (
    <div className="animate-fade-in">
      <div className="section-header mb-6">
        <div><h1 className="page-title">🧵 Bobinas</h1><p className="page-subtitle">Inventario de filamentos</p></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true) }}>+ Añadir bobina</button>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>Cargando...</div>}
      {!loading && spools.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🧵</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Sin bobinas</h3>
          <p style={{ marginBottom: '1.5rem' }}>Añade tus bobinas de filamento para hacer seguimiento del material restante.</p>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true) }}>+ Añadir primera bobina</button>
        </div>
      )}

      <div className="cards-grid">
        {spools.map(s => {
          const pct = getPct(s)
          return (
            <div key={s.id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="color-swatch" style={{ background: s.color_hex, width: 32, height: 32, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 700 }}>{s.brand || '—'} {s.material}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.color_name}</div>
                </div>
              </div>
              <div className="progress-bar" style={{ marginBottom: '0.5rem' }}>
                <div className={`progress-fill ${getPctClass(pct)}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-sm" style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: pct < 20 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{s.remaining_weight_g}g restantes</span>
                <span className="text-muted">{Math.round(pct)}%</span>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)} style={{ flex: 1, justifyContent: 'center' }}>Editar</button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(s.id)}>🗑️</button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && (setShowModal(false), resetForm())}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Editar bobina' : 'Nueva bobina'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => { setShowModal(false); resetForm() }}>✕</button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Marca</label>
                  <input className="form-input" placeholder="eSUN, Bambu..." value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Material</label>
                  <select className="form-select" value={form.material} onChange={e => setForm({...form, material: e.target.value})}>
                    {['PLA','PLA+','PETG','ABS','ASA','TPU','Nylon','PC','PA-CF','PLA-CF'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <input className="form-input" placeholder="Blanco, Negro..." value={form.color_name} onChange={e => setForm({...form, color_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Color (hex)</label>
                  <div className="flex gap-2">
                    <input type="color" style={{ width: 42, height: 42, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8 }} value={form.color_hex} onChange={e => setForm({...form, color_hex: e.target.value})} />
                    <input className="form-input" value={form.color_hex} onChange={e => setForm({...form, color_hex: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Peso total (g)</label>
                  <input type="number" className="form-input" value={form.total_weight_g} onChange={e => setForm({...form, total_weight_g: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Restante (g)</label>
                  <input type="number" className="form-input" value={form.remaining_weight_g} onChange={e => setForm({...form, remaining_weight_g: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Precio de compra (€)</label>
                  <input type="number" step="0.01" className="form-input" placeholder="Opcional" value={form.purchase_price} onChange={e => setForm({...form, purchase_price: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }} onClick={() => { setShowModal(false); resetForm() }}>Cancelar</button>
                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
