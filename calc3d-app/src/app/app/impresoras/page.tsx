'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/contexts/I18nContext'

interface Printer { id: string; brand: string; model: string; wattage_w: number; type: string }
interface UserPrinter { id: string; printer_id: string | null; nickname: string | null; custom_wattage_w: number | null; printers: Printer | null }

export default function ImpresorasPage() {
  const { t } = useTranslation()
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
  const [error, setError] = useState('')

  // Estado para edición inline de consumo
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editWattage, setEditWattage] = useState('')
  const [editError, setEditError] = useState('')

  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    supabase.from('printers').select('*').order('brand').then(({ data }) => setDbPrinters(data || []))
    supabase.from('user_printers').select('*, printers(*)').eq('user_id', user.id).then(({ data }) => { setMyPrinters((data as UserPrinter[]) || []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const [manualType, setManualType] = useState('FDM')
  const [wattageError, setWattageError] = useState('')
  const [duplicates, setDuplicates] = useState<Printer[]>([])
  const [contributeToDb, setContributeToDb] = useState(false)

  function checkDuplicates(name: string) {
    if (!name || name.length < 3) { setDuplicates([]); return }
    const lower = name.toLowerCase()
    const matches = dbPrinters.filter(p =>
      `${p.brand} ${p.model}`.toLowerCase().includes(lower) ||
      lower.includes(p.model.toLowerCase())
    ).slice(0, 4)
    setDuplicates(matches)
  }

  function validateWattage(val: string) {
    const n = Number(val)
    if (!val || isNaN(n)) { setWattageError(t('printers.modal.save_error')); return false }
    if (n < 50) { setWattageError(t('printers.validation.low')); return false }
    if (n > 5000) { setWattageError(t('printers.validation.high')); return false }
    setWattageError(''); return true
  }

  function validateEditWattage(val: string) {
    const n = Number(val)
    if (!val || isNaN(n) || n <= 0) { setEditError(t('common.error')); return false }
    if (n > 5000) { setEditError(t('printers.validation.max')); return false }
    setEditError(''); return true
  }

  function startEdit(up: UserPrinter) {
    const currentW = up.custom_wattage_w || up.printers?.wattage_w || 0
    setEditingId(up.id)
    setEditWattage(String(currentW))
    setEditError('')
  }

  async function saveEdit(id: string) {
    if (!validateEditWattage(editWattage)) return
    const supabase = createClient()
    await supabase.from('user_printers').update({ custom_wattage_w: Number(editWattage) }).eq('id', id)
    setEditingId(null)
    setEditWattage('')
    setEditError('')
    load()
  }

  function cancelEdit() {
    setEditingId(null)
    setEditWattage('')
    setEditError('')
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (isManual && !validateWattage(manualWattage)) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setError('')
    if (isManual) {
      let newPublicId: string | null = null
      if (contributeToDb) {
        const parts = manualName.trim().split(' ')
        const brand = parts[0]
        const model = parts.slice(1).join(' ') || manualName
        const { data: inserted, error: insertErr } = await supabase.from('printers').insert({
          brand, model,
          wattage_w: Number(manualWattage),
          type: manualType,
          verified: false,
        }).select().single()
        
        if (insertErr) {
          setError(t('printers.modal.contrib_error') + ' ' + insertErr.message)
          setSaving(false)
          return
        }
        newPublicId = inserted?.id ?? null
      }
      const { error: userPrinterErr } = await supabase.from('user_printers').insert({
        user_id: user.id,
        printer_id: newPublicId,
        nickname: manualName,
        custom_wattage_w: Number(manualWattage),
      })
      if (userPrinterErr) {
          setError(t('printers.modal.save_error') + ' ' + userPrinterErr.message)
          setSaving(false)
          return
      }
    } else {
      const printer = dbPrinters.find(p => p.id === selectedId)
      await supabase.from('user_printers').insert({
        user_id: user.id,
        printer_id: selectedId || null,
        nickname: nickname || null,
        custom_wattage_w: printer?.wattage_w || null,
      })
    }
    
    setSaving(false); setShowModal(false); setSelectedId(''); setNickname('')
    setManualName(''); setDuplicates([]); setContributeToDb(false); load()
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
        <div><h1 className="page-title">{t('printers.title')}</h1><p className="page-subtitle">{t('printers.subtitle')}</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>{t('printers.add_btn')}</button>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>{t('common.loading')}</div>}

      {!loading && myPrinters.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h3 style={{ marginBottom: '0.5rem' }}>{t('printers.empty.title')}</h3>
          <p style={{ marginBottom: '1.5rem' }}>{t('printers.empty.desc')}</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>{t('printers.empty.btn')}</button>
        </div>
      )}

      <div className="cards-grid">
        {myPrinters.map(up => {
          const p = up.printers
          const isEditing = editingId === up.id
          const currentW = up.custom_wattage_w || p?.wattage_w || 0
          const defaultW = p?.wattage_w || 0
          const isCustom = up.custom_wattage_w !== null && up.custom_wattage_w !== defaultW

          return (
            <div key={up.id} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: 48, height: 48, background: 'rgba(249,115,22,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🖨️</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{up.nickname || (p ? `${p.brand} ${p.model}` : t('printers.card.custom'))}</div>
                  {p && <div className="text-muted text-sm">{p.brand} {p.model}</div>}
                </div>
              </div>

              {/* Consumo - modo visualización o edición */}
              {isEditing ? (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(249,115,22,0.06)', borderRadius: '8px', border: '1px solid rgba(249,115,22,0.15)' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>{t('printers.card.consumption')}</label>
                  <div className="flex gap-2" style={{ alignItems: 'center' }}>
                    <input
                      type="number"
                      className="form-input"
                      value={editWattage}
                      onChange={e => { setEditWattage(e.target.value); validateEditWattage(e.target.value) }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(up.id) } if (e.key === 'Escape') cancelEdit() }}
                      style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.875rem' }}
                      autoFocus
                      min={1}
                      max={5000}
                    />
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => saveEdit(up.id)} title={t('common.save')} style={{ padding: '0.4rem 0.6rem', minWidth: 'auto' }}>✓</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEdit} title={t('common.cancel')} style={{ padding: '0.4rem 0.6rem', minWidth: 'auto' }}>✕</button>
                  </div>
                  {editError && <p style={{ color: 'var(--accent-red)', fontSize: '0.7rem', marginTop: '0.25rem' }}>{editError}</p>}
                  {defaultW > 0 && <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>{t('printers.card.default_val')} {defaultW}W</p>}
                </div>
              ) : (
                <div className="flex gap-3 text-sm text-muted" style={{ marginBottom: '1rem', alignItems: 'center' }}>
                  <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={() => startEdit(up)} title={t('printers.card.edit_consumption')}>
                    ⚡ {currentW}W
                    {isCustom && <span style={{ fontSize: '0.65rem', background: 'rgba(249,115,22,0.15)', color: 'var(--accent-orange)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>{t('printers.card.manual_tag')}</span>}
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>✏️</span>
                  </span>
                  <span className={`badge ${p?.type === 'FDM' ? 'badge-orange' : p?.type === 'SLA' ? 'badge-blue' : 'badge-purple'}`}>{p?.type || 'FDM'}</span>
                </div>
              )}

              <button className="btn btn-danger btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => handleDelete(up.id)}>{t('common.delete')}</button>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{t('printers.modal.title')}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="flex gap-2 mb-2 p-1 bg-input" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <button type="button" className={`btn btn-sm ${!isManual ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsManual(false)}>{t('printers.modal.tab_db')}</button>
                <button type="button" className={`btn btn-sm ${isManual ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsManual(true)}>{t('printers.modal.tab_manual')}</button>
              </div>

              {!isManual ? (
                <>
                  <div className="form-group">
                    <label className="form-label">{t('printers.modal.search_label')}</label>
                    <input className="form-input" placeholder={t('printers.modal.search_placeholder')} value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('printers.modal.select_label')}</label>
                    <select className="form-select" value={selectedId} onChange={e => setSelectedId(e.target.value)} required={!isManual}>
                      <option value="">— {t('common.select')} —</option>
                      {filtered.map(p => <option key={p.id} value={p.id}>{p.brand} {p.model} ({p.wattage_w}W) [{p.type}]</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('printers.modal.nickname_label')}</label>
                    <input className="form-input" placeholder={t('printers.modal.nickname_placeholder')} value={nickname} onChange={e => setNickname(e.target.value)} />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">{t('printers.modal.manual_name')}</label>
                    <input
                      className="form-input"
                      placeholder={t('printers.modal.manual_name_placeholder')}
                      value={manualName}
                      onChange={e => { setManualName(e.target.value); checkDuplicates(e.target.value) }}
                      required={isManual}
                    />
                  </div>

                  {duplicates.length > 0 && (
                    <div className="alert alert-warn" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                      <strong>{t('printers.modal.duplicates_warn')}</strong>
                      {duplicates.map(d => (
                        <button key={d.id} type="button" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}
                          onClick={() => { setIsManual(false); setSelectedId(d.id); setDuplicates([]) }}>
                          {d.brand} {d.model} ({d.wattage_w}W) [{d.type}]
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">{t('printers.modal.wattage_label')}</label>
                      <input
                        type="number" className="form-input" placeholder={t('printers.modal.wattage_placeholder')}
                        value={manualWattage}
                        onChange={e => { setManualWattage(e.target.value); validateWattage(e.target.value) }}
                        required={isManual}
                      />
                      {wattageError && <p className="text-xs" style={{ color: 'var(--accent-red)', marginTop: '0.25rem' }}>{wattageError}</p>}
                      {!wattageError && <p className="text-xs text-muted mt-1">{t('printers.modal.wattage_hint')}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('printers.modal.type_label')}</label>
                      <select className="form-select" value={manualType} onChange={e => setManualType(e.target.value)}>
                        <option value="FDM">{t('printers.types.fdm')}</option>
                        <option value="Resina">{t('printers.types.resin')}</option>
                        <option value="SLA">{t('printers.types.sla')}</option>
                        <option value="SLS">{t('printers.types.sls')}</option>
                      </select>
                    </div>
                  </div>

                  {duplicates.length === 0 && manualName.length > 3 && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: 'rgba(249,115,22,0.06)', borderRadius: '8px', border: '1px solid rgba(249,115,22,0.15)' }}>
                      <input type="checkbox" checked={contributeToDb} onChange={e => setContributeToDb(e.target.checked)} />
                      <span style={{ fontSize: '0.875rem' }}>
                        <strong>{t('printers.modal.contribute_label')}</strong>
                        <span className="text-muted" style={{ display: 'block', fontSize: '0.75rem' }}>{t('printers.modal.contribute_desc')}</span>
                      </span>
                    </label>
                  )}
                </>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" className="btn btn-ghost w-full" style={{ justifyContent: 'center' }} onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={saving}>{saving ? t('common.saving') : t('common.add')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

