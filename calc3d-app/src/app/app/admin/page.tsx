'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Printer {
  id: string
  brand: string
  model: string
  wattage_w: number
  type: string
  verified: boolean
  created_at: string
}

interface Filament {
  id: string
  brand: string
  material: string
  color_name: string
  color_hex: string
  verified: boolean
  created_at: string
}

interface Feedback {
  id: string
  user_id: string | null
  type: string
  subject: string
  message: string
  status: string
  is_public: boolean
  created_at: string
}

export default function AdminPage() {
  const [stats, setStats] = useState({ printers: 0, filaments: 0, users: 0, pendingP: 0, pendingF: 0, pendingFeedback: 0 })
  const [pendingPrinters, setPendingPrinters] = useState<Printer[]>([])
  const [pendingFilaments, setPendingFilaments] = useState<Filament[]>([])
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([])
  const [activityData, setActivityData] = useState<{ hours: number[], days: number[] }>({ hours: Array(24).fill(0), days: Array(7).fill(0) })
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  
  // Independent toggles
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    users: true,
    announcements: false,
    feedback: false,
    printers: false,
    filaments: false
  })

  const [annTitle, setAnnTitle] = useState('')
  const [annContent, setAnnContent] = useState('')
  const [annLoading, setAnnLoading] = useState(false)
  const router = useRouter()

  async function checkAuth() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'vigoanxo000@gmail.com') {
      setAuthorized(false)
      router.push('/app')
      return
    }
    setAuthorized(true)
    loadData()
  }

  async function loadData() {
    const supabase = createClient()
    
    // Total Counts
    const { count: pCount } = await supabase.from('printers').select('*', { count: 'exact', head: true })
    const { count: fCount } = await supabase.from('filaments').select('*', { count: 'exact', head: true })
    const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    
    // Pending items
    const { data: pPending } = await supabase.from('printers').select('*').eq('verified', false).order('created_at', { ascending: false })
    const { data: fPending } = await supabase.from('filaments').select('*').eq('verified', false).order('created_at', { ascending: false })
    const { data: feedback } = await supabase.from('feedback').select('*').eq('status', 'pending').order('created_at', { ascending: false })

    // Activity Data
    const { data: logs } = await supabase.from('activity_logs').select('created_at')
    const hours = Array(24).fill(0)
    const days = Array(7).fill(0)
    if (logs) {
      logs.forEach(log => {
        const date = new Date(log.created_at)
        hours[date.getHours()]++
        days[date.getDay()]++
      })
    }

    setStats({ 
      printers: pCount || 0, 
      filaments: fCount || 0, 
      users: uCount || 0,
      pendingP: pPending?.length || 0,
      pendingF: fPending?.length || 0,
      pendingFeedback: feedback?.length || 0
    })
    setPendingPrinters(pPending || [])
    setPendingFilaments(fPending || [])
    setFeedbackItems(feedback || [])
    setActivityData({ hours, days })
    setLoading(false)
  }

  useEffect(() => { checkAuth() }, [])

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  async function handleVerify(type: 'printer' | 'filament', id: string) {
    const supabase = createClient()
    const table = type === 'printer' ? 'printers' : 'filaments'
    await supabase.from(table).update({ verified: true }).eq('id', id)
    loadData()
  }

  async function handleDelete(type: 'printer' | 'filament' | 'feedback', id: string) {
    if (!confirm('¿Seguro que quieres borrar esta entrada permanentemente?')) return
    const supabase = createClient()
    if (type === 'feedback') {
      await supabase.from('feedback').delete().eq('id', id)
    } else {
      const table = type === 'printer' ? 'printers' : 'filaments'
      await supabase.from(table).delete().eq('id', id)
    }
    loadData()
  }

  async function handleFeedbackStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('feedback').update({ status }).eq('id', id)
    loadData()
  }

  async function togglePublic(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('feedback').update({ is_public: !current }).eq('id', id)
    loadData()
  }

  async function postAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    if (!annTitle || !annContent) return
    setAnnLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('announcements').insert({ title: annTitle, content: annContent })
    setAnnLoading(false)
    if (!error) {
      setAnnTitle(''); setAnnContent('')
      alert('Anuncio publicado con éxito')
    }
  }

  if (authorized === false) return null
  if (loading) return <div className="p-8 text-center text-muted">Cargando panel de control...</div>

  return (
    <div className="animate-fade-in p-6">
      <div className="section-header mb-8">
        <div>
          <h1 className="page-title">Panel de Administración</h1>
          <p className="page-subtitle">Gestión global y analíticas de la comunidad</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-10">
        {/* USERS & ACTIVITY */}
        <div className="card-set">
          <button 
            onClick={() => toggleSection('users')}
            className={`card p-6 flex justify-between items-center transition-all ${openSections.users ? 'border-brand' : ''}`}
            style={{ cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: openSections.users ? 0 : '10px' }}
          >
            <span className="text-base font-semibold text-muted uppercase tracking-wider">Usuarios y Actividad</span>
            <div className="flex items-center gap-6">
              <span className="text-3xl font-bold">{stats.users}</span>
              <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{openSections.users ? 'Cerrar' : 'Ver'}</span>
            </div>
          </button>
          {openSections.users && (
            <div className="card p-6 border-t-0 rounded-t-none animate-slide-down mb-2">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* HOURS CHART (SVG AREA) */}
                <div style={{ flex: 1, maxWidth: '600px' }}>
                  <h4 className="text-xs font-bold uppercase text-muted mb-4">Conexiones por Hora (24h)</h4>
                  <div className="h-32 w-full bg-white/5 rounded-lg border border-white/5 relative overflow-hidden p-0">
                    <svg className="w-full h-full" viewBox="0 0 240 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradHour" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <path 
                        d={`M 0 100 ${activityData.hours.map((val, i) => {
                          const max = Math.max(...activityData.hours, 1)
                          const h = 100 - (val / max) * 80
                          return `L ${i * (240/23)} ${h}`
                        }).join(' ')} L 240 100 Z`}
                        fill="url(#gradHour)"
                      />
                      {/* Line */}
                      <path 
                        d={`M 0 ${100 - (activityData.hours[0] / Math.max(...activityData.hours, 1)) * 80} ${activityData.hours.map((val, i) => {
                          const max = Math.max(...activityData.hours, 1)
                          const h = 100 - (val / max) * 80
                          return `L ${i * (240/23)} ${h}`
                        }).join(' ')}`}
                        fill="none"
                        stroke="var(--brand)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {/* Tooltip Overlay */}
                    <div className="absolute inset-0 flex">
                      {activityData.hours.map((val, i) => (
                        <div key={i} className="flex-1 group relative h-full">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-brand/50 text-brand text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                            {i}:00 — {val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted mt-2 px-1">
                    <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                  </div>
                </div>

                {/* WEEKLY CHART (SVG AREA) */}
                <div style={{ flex: 1, maxWidth: '400px' }}>
                  <h4 className="text-xs font-bold uppercase text-muted mb-4">Actividad Semanal</h4>
                  <div className="h-32 w-full bg-white/5 rounded-lg border border-white/5 relative overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 70 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradWeek" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d={`M 0 100 ${activityData.days.map((val, i) => {
                          const max = Math.max(...activityData.days, 1)
                          const h = 100 - (val / max) * 80
                          return `L ${i * (70/6)} ${h}`
                        }).join(' ')} L 70 100 Z`}
                        fill="url(#gradWeek)"
                      />
                      <path 
                        d={`M 0 ${100 - (activityData.days[0] / Math.max(...activityData.days, 1)) * 80} ${activityData.days.map((val, i) => {
                          const max = Math.max(...activityData.days, 1)
                          const h = 100 - (val / max) * 80
                          return `L ${i * (70/6)} ${h}`
                        }).join(' ')}`}
                        fill="none"
                        stroke="var(--brand)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {/* Tooltip Overlay */}
                    <div className="absolute inset-0 flex px-2">
                      {activityData.days.map((val, i) => (
                        <div key={i} className="flex-1 group relative h-full">
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-brand/50 text-brand text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                            {val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted mt-2 px-2 font-bold">
                    <span>D</span><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ANNOUNCEMENTS */}
        <div className="card-set">
          <button 
            onClick={() => toggleSection('announcements')}
            className={`card p-6 flex justify-between items-center transition-all ${openSections.announcements ? 'border-brand' : ''}`}
            style={{ cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: openSections.announcements ? 0 : '10px' }}
          >
            <span className="text-base font-semibold text-muted uppercase tracking-wider">Gestión de Anuncios</span>
            <div className="flex items-center gap-6">
              <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{openSections.announcements ? 'Cerrar' : 'Nuevo Anuncio'}</span>
            </div>
          </button>
          {openSections.announcements && (
            <div className="card p-6 border-t-0 rounded-t-none animate-slide-down mb-2">
              <h4 className="text-sm font-bold uppercase mb-4 text-brand">Publicar Anuncio Oficial</h4>
              <form onSubmit={postAnnouncement} className="flex flex-col gap-3">
                <input className="form-input" placeholder="Título del anuncio" value={annTitle} onChange={e => setAnnTitle(e.target.value)} required />
                <textarea className="form-input" placeholder="Contenido del mensaje..." rows={3} value={annContent} onChange={e => setAnnContent(e.target.value)} required />
                <button type="submit" className="btn btn-primary btn-sm" disabled={annLoading}>{annLoading ? 'Publicando...' : 'Publicar Anuncio'}</button>
              </form>
            </div>
          )}
        </div>

        {/* FEEDBACK */}
        <div className="card-set">
          <button 
            onClick={() => toggleSection('feedback')}
            className={`card p-6 flex justify-between items-center transition-all ${openSections.feedback ? 'border-brand' : ''}`}
            style={{ cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: openSections.feedback ? 0 : '10px' }}
          >
            <span className="text-base font-semibold text-muted uppercase tracking-wider">Sugerencias y Reportes</span>
            <div className="flex items-center gap-6">
              <span className={`text-3xl font-bold ${stats.pendingFeedback > 0 ? 'text-brand' : ''}`}>{stats.pendingFeedback}</span>
              <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{openSections.feedback ? 'Cerrar' : 'Ver'}</span>
            </div>
          </button>
          {openSections.feedback && (
            <div className="card p-6 border-t-0 rounded-t-none animate-slide-down mb-2">
              {feedbackItems.length === 0 ? (
                <div className="text-center text-muted py-4">No hay sugerencias pendientes.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {feedbackItems.map(item => (
                    <div key={item.id} className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`badge ${item.type === 'bug' ? 'badge-danger' : 'badge-primary'}`}>{item.type}</span>
                        <span className="text-xs text-muted">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold mb-1">{item.subject}</h4>
                      <p className="text-sm text-muted mb-4 italic">"{item.message}"</p>
                      <div className="flex gap-2 justify-end">
                        <button className={`btn btn-sm ${item.is_public ? 'btn-primary' : 'btn-ghost'}`} onClick={() => togglePublic(item.id, !!item.is_public)}>
                          {item.is_public ? 'Público ✓' : 'Hacer Público'}
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => handleFeedbackStatus(item.id, 'resolved')}>Resolver</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete('feedback', item.id)}>Borrar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* PRINTERS */}
        <div className="card-set">
          <button 
            onClick={() => toggleSection('printers')}
            className={`card p-6 flex justify-between items-center transition-all ${openSections.printers ? 'border-brand' : ''}`}
            style={{ cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: openSections.printers ? 0 : '10px' }}
          >
            <span className="text-base font-semibold text-muted uppercase tracking-wider">Impresoras Pendientes</span>
            <div className="flex items-center gap-6">
              <span className={`text-3xl font-bold ${stats.pendingP > 0 ? 'text-brand' : ''}`}>{stats.pendingP}</span>
              <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{openSections.printers ? 'Cerrar' : 'Ver'}</span>
            </div>
          </button>
          {openSections.printers && (
            <div className="card p-0 border-t-0 rounded-t-none overflow-hidden animate-slide-down mb-2">
              {pendingPrinters.length === 0 ? (
                <div className="p-10 text-center text-muted">Limpio.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-muted uppercase text-xs">
                    <tr>
                      <th className="p-4">Modelo</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pendingPrinters.map(p => (
                      <tr key={p.id}>
                        <td className="p-4">{p.brand} {p.model}</td>
                        <td className="p-4">{p.type}</td>
                        <td className="p-4 text-right">
                          <button className="btn btn-primary btn-sm" onClick={() => handleVerify('printer', p.id)}>OK</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* FILAMENTS */}
        <div className="card-set">
          <button 
            onClick={() => toggleSection('filaments')}
            className={`card p-6 flex justify-between items-center transition-all ${openSections.filaments ? 'border-brand' : ''}`}
            style={{ cursor: 'pointer', textAlign: 'left', width: '100%', marginBottom: openSections.filaments ? 0 : '10px' }}
          >
            <span className="text-base font-semibold text-muted uppercase tracking-wider">Filamentos Pendientes</span>
            <div className="flex items-center gap-6">
              <span className={`text-3xl font-bold ${stats.pendingF > 0 ? 'text-brand' : ''}`}>{stats.pendingF}</span>
              <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{openSections.filaments ? 'Cerrar' : 'Ver'}</span>
            </div>
          </button>
          {openSections.filaments && (
            <div className="card p-0 border-t-0 rounded-t-none overflow-hidden animate-slide-down mb-2">
              {pendingFilaments.length === 0 ? (
                <div className="p-10 text-center text-muted">Limpio.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-muted uppercase text-xs">
                    <tr>
                      <th className="p-4">Material</th>
                      <th className="p-4">Color</th>
                      <th className="p-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pendingFilaments.map(f => (
                      <tr key={f.id}>
                        <td className="p-4">{f.brand} {f.material}</td>
                        <td className="p-4">{f.color_name}</td>
                        <td className="p-4 text-right">
                          <button className="btn btn-primary btn-sm" onClick={() => handleVerify('filament', f.id)}>OK</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


