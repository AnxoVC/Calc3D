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
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
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
    setLoading(false)
  }

  useEffect(() => { checkAuth() }, [])

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
    await supabase.from('announcements').insert({ title: annTitle, content: annContent })
    setAnnTitle(''); setAnnContent(''); setAnnLoading(false)
    alert('Anuncio publicado con éxito')
  }

  if (authorized === false) return null
  if (loading) return <div className="p-8 text-center">Cargando panel de control...</div>

  return (
    <div className="animate-fade-in p-6">
      <div className="section-header mb-8">
        <div>
          <h1 className="page-title">Panel de Administración</h1>
          <p className="page-subtitle">Gestión global de la base de datos y comunidad</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-10">
        <button 
          onClick={() => setExpanded(expanded === 'users' ? null : 'users')}
          className={`card p-6 flex justify-between items-center hover:border-brand-light transition-all ${expanded === 'users' ? 'border-brand' : ''}`}
          style={{ cursor: 'pointer', textAlign: 'left', width: '100%', background: 'var(--bg-card)' }}
        >
          <span className="text-base font-semibold text-muted uppercase tracking-wider">Usuarios Totales</span>
          <div className="flex items-center gap-6">
            <span className="text-3xl font-bold">{stats.users}</span>
            <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{expanded === 'users' ? 'Cerrar' : 'Ver'}</span>
          </div>
        </button>
        {expanded === 'users' && (
          <div className="card p-6 border-t-0 rounded-t-none animate-slide-down mb-2">
            <h4 className="text-sm font-bold uppercase mb-4">Usuarios recientes</h4>
            <p className="text-sm text-muted mb-6">Próximamente: Lista detallada de usuarios y actividad reciente.</p>
            
            <div className="border-t border-white/5 pt-6">
              <h4 className="text-sm font-bold uppercase mb-4">Nuevo Anuncio Oficial</h4>
              <form onSubmit={postAnnouncement} className="flex flex-col gap-3">
                <input className="form-input" placeholder="Título del anuncio" value={annTitle} onChange={e => setAnnTitle(e.target.value)} required />
                <textarea className="form-input" placeholder="Contenido del mensaje..." rows={3} value={annContent} onChange={e => setAnnContent(e.target.value)} required />
                <button type="submit" className="btn btn-primary btn-sm" disabled={annLoading}>{annLoading ? 'Publicando...' : 'Publicar Anuncio'}</button>
              </form>
            </div>
          </div>
        )}

        <button 
          onClick={() => setExpanded(expanded === 'feedback' ? null : 'feedback')}
          className={`card p-6 flex justify-between items-center hover:border-brand-light transition-all ${expanded === 'feedback' ? 'border-brand' : ''}`}
          style={{ cursor: 'pointer', textAlign: 'left', width: '100%', background: 'var(--bg-card)' }}
        >
          <span className="text-base font-semibold text-muted uppercase tracking-wider">Sugerencias y Reportes</span>
          <div className="flex items-center gap-6">
            <span className={`text-3xl font-bold ${stats.pendingFeedback > 0 ? 'text-brand' : ''}`}>{stats.pendingFeedback}</span>
            <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{expanded === 'feedback' ? 'Cerrar' : 'Ver'}</span>
          </div>
        </button>
        {expanded === 'feedback' && (
          <div className="card p-6 border-t-0 rounded-t-none animate-slide-down mb-2">
            {feedbackItems.length === 0 ? (
              <div className="text-center text-muted py-4">No hay sugerencias vivas.</div>
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

        <button 
          onClick={() => setExpanded(expanded === 'printers' ? null : 'printers')}
          className={`card p-6 flex justify-between items-center hover:border-brand-light transition-all ${expanded === 'printers' ? 'border-brand' : ''}`}
          style={{ cursor: 'pointer', textAlign: 'left', width: '100%', background: 'var(--bg-card)' }}
        >
          <span className="text-base font-semibold text-muted uppercase tracking-wider">Impresoras Pendientes</span>
          <div className="flex items-center gap-6">
            <span className={`text-3xl font-bold ${stats.pendingP > 0 ? 'text-orange-500' : ''}`}>{stats.pendingP}</span>
            <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{expanded === 'printers' ? 'Cerrar' : 'Ver'}</span>
          </div>
        </button>
        {expanded === 'printers' && (
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

        <button 
          onClick={() => setExpanded(expanded === 'filaments' ? null : 'filaments')}
          className={`card p-6 flex justify-between items-center hover:border-brand-light transition-all ${expanded === 'filaments' ? 'border-brand' : ''}`}
          style={{ cursor: 'pointer', textAlign: 'left', width: '100%', background: 'var(--bg-card)' }}
        >
          <span className="text-base font-semibold text-muted uppercase tracking-wider">Filamentos Pendientes</span>
          <div className="flex items-center gap-6">
            <span className={`text-3xl font-bold ${stats.pendingF > 0 ? 'text-orange-500' : ''}`}>{stats.pendingF}</span>
            <span className="text-sm border border-white/10 px-3 py-1 rounded uppercase">{expanded === 'filaments' ? 'Cerrar' : 'Ver'}</span>
          </div>
        </button>
        {expanded === 'filaments' && (
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
  )
}


