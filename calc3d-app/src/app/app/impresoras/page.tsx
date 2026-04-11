'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Printer { id: string; brand: string; model: string; wattage_w: number; type: string }
interface UserPrinter { id: string; printer_id: string | null; nickname: string | null; custom_wattage_w: number | null; printers: Printer | null }

export default function ImpresorasPage() {
  const [dbPrinters, setDbPrinters] = useState<Printer[]>([])
  const [myPrinters, setMyPrinters] = useState<UserPrinter[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [nickname, setNickname] = useState('')
  const [saving, setSaving] = useState(false)
  const [isManual, setIsManual] = useState(false)
  const [manualName, setManualName] = useState('')
  const [manualWattage, setManualWattage] = useState('300')

  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    supabase.from('printers').select('*').order('brand').then(({ data }) => setDbPrinters(data || []))
    supabase.from('user_printers').select('*, printers(*)').eq('user_id', user.id).then(({ data }) => { setMyPrinters((data as UserPrinter[]) || []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (isManual) {
      await supabase.from('user_printers').insert({
        user_id: user.id,
        printer_id: null,
        nickname: manualName,
        custom_wattage_w: Number(manualWattage),
      })
    } else {
      const printer = dbPrinters.find(p => p.id === selectedId)
      await supabase.from('user_printers').insert({
        user_id: user.id,
        printer_id: selectedId || null,
        nickname: nickname || null,
        custom_wattage_w: printer?.wattage_w || null,
      })
    }
    
    setSaving(false); setShowModal(false); setSelectedId(''); setNickname(''); setManualName(''); load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('user_printers').delete().eq('id', id)
    load()
  }

  const filtered = dbPrinters.filter(p => `${p.brand} ${p.model}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="animate-fade-in">
      <div className="section-header mb-6">
        <div><h1 className="page-title">🖨️ Impresoras</h1><p className="page-subtitle">Tus equipos de impresión</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Añadir impresora</button>
      </div>

      {!loading && myPrinters.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🖨️</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Sin impresoras añadidas</h3>
          <p style={{ marginBottom: '1.5rem' }}>Añade tus impresoras desde nuestra base de datos para tenerlas disponibles al calcular.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Añadir tu primera impresora</button>
        </div>
      )}

      <div className="cards-grid">
        {myPrinters.map(up => {
          const p = up.printers
          return (
            <div key={up.id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🖨️</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{up.nickname || (p ? `${p.brand} ${p.model}` : 'Impresora personalizada')}</div>
                  {p && <div className="text-muted text-sm">{p.brand} {p.model}</div>}
                </div>
              </div>
              <div className="flex gap-3 text-sm text-muted" style={{ marginBottom: '1rem' }}>
                <span>⚡ {up.custom_wattage_w || p?.wattage_w || '—'}W</span>
                <span className={`badge ${p?.type === 'FDM' ? 'badge-orange' : p?.type === 'SLA' ? 'badge-blue' : 'badge-purple'}`}>{p?.type || 'FDM'}</span>
              </div>
              <button className="btn btn-danger btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => handleDelete(up.id)}>Eliminar</button>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Añadir impresora</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="flex gap-2 mb-2 p-1 bg-input" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <button type="button" className={`btn btn-sm ${!isManual ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsManual(false)}>Base de Datos</button>
                <button type="button" className={`btn btn-sm ${isManual ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsManual(true)}>Manual</button>
              </div>

              {!isManual ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Buscar en la base de datos</label>
                    <input className="form-input" placeholder="Bambu, Prusa, Creality, Artillery..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Seleccionar impresora</label>
                    <select className="form-select" value={selectedId} onChange={e => setSelectedId(e.target.value)} required={!isManual}>
                      <option value="">— Selecciona —</option>
                      {filtered.map(p => <option key={p.id} value={p.id}>{p.brand} {p.model} ({p.wattage_w}W) [{p.type}]</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apodo (opcional)</label>
                    <input className="form-input" placeholder="Mi Bambu, Impresora del taller..." value={nickname} onChange={e => setNickname(e.target.value)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Nombre de tu impresora</label>
                    <input className="form-input" placeholder="Ej: Artillery Genius Pro" value={manualName} onChange={e => setManualName(e.target.value)} required={isManual} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consumo estimado (W)</label>
                    <div className="input-wrapper">
                      <input type="number" className="form-input" placeholder="300" value={manualWattage} onChange={e => setManualWattage(e.target.value)} required={isManual} />
                      <span className="input-prefix" style={{ paddingRight: '1rem', borderRight: 'none', borderLeft: '1px solid var(--border)' }}>W</span>
                    </div>
                    <p className="text-xs text-muted mt-1">Suele estar entre 200W y 350W para impresoras estándar.</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={saving}>{saving ? 'Guardando...' : 'Añadir'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
