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

export default function AdminPage() {
  const [stats, setStats] = useState({ printers: 0, filaments: 0, pendingP: 0, pendingF: 0 })
  const [pendingPrinters, setPendingPrinters] = useState<Printer[]>([])
  const [pendingFilaments, setPendingFilaments] = useState<Filament[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
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
    
    // Pending Printers
    const { data: pPending } = await supabase
      .from('printers')
      .select('*')
      .eq('verified', false)
      .order('created_at', { ascending: false })

    // Pending Filaments
    const { data: fPending } = await supabase
      .from('filaments')
      .select('*')
      .eq('verified', false)
      .order('created_at', { ascending: false })

    setStats({ 
      printers: pCount || 0, 
      filaments: fCount || 0, 
      pendingP: pPending?.length || 0,
      pendingF: fPending?.length || 0
    })
    setPendingPrinters(pPending || [])
    setPendingFilaments(fPending || [])
    setLoading(false)
  }

  useEffect(() => { checkAuth() }, [])

  async function handleVerify(type: 'printer' | 'filament', id: string) {
    const supabase = createClient()
    const table = type === 'printer' ? 'printers' : 'filaments'
    await supabase.from(table).update({ verified: true }).eq('id', id)
    loadData()
  }

  async function handleDelete(type: 'printer' | 'filament', id: string) {
    if (!confirm('¿Seguro que quieres borrar esta entrada permanentemente?')) return
    const supabase = createClient()
    const table = type === 'printer' ? 'printers' : 'filaments'
    await supabase.from(table).delete().eq('id', id)
    loadData()
  }

  if (authorized === false) return null
  if (loading) return <div className="p-8 text-center">Cargando panel de control...</div>

  return (
    <div className="animate-fade-in p-6">
      <div className="section-header mb-8">
        <div>
          <h1 className="page-title">🛡️ Panel de Administración</h1>
          <p className="page-subtitle">Gestión global de la base de datos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="card">
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Impresoras</div>
          <div className="text-3xl font-bold">{stats.printers}</div>
        </div>
        <div className="card">
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Filamentos</div>
          <div className="text-3xl font-bold">{stats.filaments}</div>
        </div>
        <div className="card" style={{ border: stats.pendingP > 0 ? '1px solid var(--accent-orange)' : '' }}>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Impresoras Pend.</div>
          <div className={`text-3xl font-bold ${stats.pendingP > 0 ? 'text-orange-500' : ''}`}>{stats.pendingP}</div>
        </div>
        <div className="card" style={{ border: stats.pendingF > 0 ? '1px solid var(--accent-orange)' : '' }}>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Filamentos Pend.</div>
          <div className={`text-3xl font-bold ${stats.pendingF > 0 ? 'text-orange-500' : ''}`}>{stats.pendingF}</div>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🖨️ Impresoras Pendientes ({pendingPrinters.length})</h2>
          {pendingPrinters.length === 0 ? (
            <div className="card p-10 text-center text-muted">No hay impresoras pendientes de verificar. ✨</div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 uppercase text-xs text-muted">
                  <tr>
                    <th className="p-4">Marca / Modelo</th>
                    <th className="p-4">Consumo</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingPrinters.map(p => (
                    <tr key={p.id}>
                      <td className="p-4 font-semibold">{p.brand} <span className="font-normal text-muted">{p.model}</span></td>
                      <td className="p-4">{p.wattage_w}W</td>
                      <td className="p-4"><span className="badge badge-purple">{p.type}</span></td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="btn btn-primary btn-sm" onClick={() => handleVerify('printer', p.id)}>Verificar</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete('printer', p.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🧵 Filamentos Pendientes ({pendingFilaments.length})</h2>
          {pendingFilaments.length === 0 ? (
            <div className="card p-10 text-center text-muted">No hay filamentos pendientes de verificar. ✨</div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 uppercase text-xs text-muted">
                  <tr>
                    <th className="p-4">Marca / Material</th>
                    <th className="p-4">Color</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingFilaments.map(f => (
                    <tr key={f.id}>
                      <td className="p-4 font-semibold">{f.brand} <span className="font-normal text-muted">{f.material}</span></td>
                      <td className="p-4 flex items-center gap-2">
                        <div style={{ background: f.color_hex, width: 16, height: 16, borderRadius: '50%', border: '1px solid var(--border)' }} />
                        {f.color_name}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="btn btn-primary btn-sm" onClick={() => handleVerify('filament', f.id)}>Verificar</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete('filament', f.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

