'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Consumable { id: string; name: string; category: string; price: number | null; stock_qty: number | null; unit: string; notes: string | null; created_at: string }

export default function ConsumiblesPage() {
  const [items, setItems] = useState<Consumable[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', category: 'other', price: '', stock_qty: '', unit: 'ud', notes: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('consumables').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setItems(data || [])
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
      user_id: user.id, name: form.name, category: form.category, unit: form.unit, notes: form.notes || null,
      price: form.price ? Number(form.price) : null, stock_qty: form.stock_qty ? Number(form.stock_qty) : null,
    }
    if (editId) await supabase.from('consumables').update(payload).eq('id', editId)
    else await supabase.from('consumables').insert(payload)
    setSaving(false); setShowModal(false); resetForm(); load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('consumables').delete().eq('id', id)
    load()
  }

  function resetForm() { setForm({ name: '', category: 'other', price: '', stock_qty: '', unit: 'ud', notes: '' }); setEditId(null) }

  const cats: Record<string, { label: string, icon: string, color: string }> = {
    glue: { label: 'Adhesivos/Lacas', icon: '🧴', color: 'badge-blue' },
    resin: { label: 'Resinas', icon: '🧪', color: 'badge-purple' },
    parts: { label: 'Repuestos', icon: '⚙️', color: 'badge-orange' },
    tools: { label: 'Herramientas', icon: '🔧', color: 'badge-green' },
    other: { label: 'Otros', icon: '📦', color: '' }
  }

  return (
    <div className="animate-fade-in">
      <div className="section-header mb-6">
        <div><h1 className="page-title">📦 Consumibles</h1><p className="page-subtitle">Gestión de piezas y materiales</p></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true) }}>+ Añadir consumible</button>
      </div>

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Inventario vacío</h3>
          <p style={{ marginBottom: '1.5rem' }}>Añade tus consumibles (boquillas, lacas, resinas...) para llevar el control del stock.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Añadir primer consumible</button>
        </div>
      )}

      <div className="cards-grid">
        {items.map(item => {
          const c = cats[item.category] || cats.other
          return (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.name}</h4>
                <span className={`badge ${c.color}`}>{c.icon} {c.label}</span>
              </div>
              <p className="text-muted text-sm mb-4" style={{ minHeight: '20px' }}>{item.notes}</p>
              <div className="flex justify-between items-center bg-input" style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                <div className="flex flex-col"><span className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>Stock</span><span className="font-semibold">{item.stock_qty ?? '—'} {item.unit}</span></div>
                <div className="flex flex-col" style={{ textAlign: 'right' }}><span className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>Precio unitario</span><span className="font-semibold" style={{ color: 'var(--brand)' }}>{item.price ? `${item.price}€` : '—'}</span></div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm" onClick={() => { setForm({ name: item.name, category: item.category, price: String(item.price || ''), stock_qty: String(item.stock_qty || ''), unit: item.unit, notes: item.notes || '' }); setEditId(item.id); setShowModal(true) }} style={{ flex: 1, justifyContent: 'center' }}>Editar</button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)}>🗑️</button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && (setShowModal(false), resetForm())}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Editar consumible' : 'Añadir consumible'}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => { setShowModal(false); resetForm() }}>✕</button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" placeholder="Ej: Boquilla latón 0.4, Laca 3DLac..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {Object.entries(cats).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Unidad de medida</label>
                  <select className="form-select" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                    <option value="ud">Unidades (ud)</option><option value="ml">Mililitros (ml)</option><option value="L">Litros (L)</option><option value="g">Gramos (g)</option><option value="kg">Kilos (kg)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Stock actual</label>
                  <input type="number" step="0.1" className="form-input" value={form.stock_qty} onChange={e => setForm({...form, stock_qty: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio (€)</label>
                  <input type="number" step="0.01" className="form-input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notas</label>
                <textarea className="form-textarea" placeholder="Opcional..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ minHeight: 60 }} />
              </div>
              <div className="flex gap-3 mt-2">
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
