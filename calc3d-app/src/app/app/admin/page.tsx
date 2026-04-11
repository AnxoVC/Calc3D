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

export default function AdminPage() {
  const [stats, setStats] = useState({ printers: 0, filaments: 0, pending: 0 })
  const [pendingPrinters, setPendingPrinters] = useState<Printer[]>([])
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
    
    // Counts
    const { count: pCount } = await supabase.from('printers').select('*', { count: 'exact', head: true })
    const { count: fCount } = await supabase.from('filaments').select('*', { count: 'exact', head: true })
    
    // Pending
    const { data: pending } = await supabase
      .from('printers')
      .select('*')
      .eq('verified', false)
      .order('created_at', { ascending: false })

    setStats({ 
      printers: pCount || 0, 
      filaments: fCount || 0, 
      pending: pending?.length || 0 
    })
    setPendingPrinters(pending || [])
    setLoading(false)
  }

  useEffect(() => { checkAuth() }, [])

  async function handleVerify(id: string) {
    const supabase = createClient()
    await supabase.from('printers').update({ verified: true }).eq('id', id)
    loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Seguro que quieres borrar esta entrada permanentemente?')) return
    const supabase = createClient()
    await supabase.from('printers').delete().eq('id', id)
    loadData()
  }

  if (authorized === false) return null
  if (loading) return <div className="p-8 text-center">Cargando panel de control...</div>

  return (
    <div className="animate-fade-in">
      <div className="section-header mb-8">
        <div>
          <h1 className="page-title">🛡️ Panel de Administración</h1>
          <p className="page-subtitle">Gestión global de la base de datos</p>
        </div>
      </div>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
        <div className="card" style={{ flex: 1, minWidth: '180px' }}>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Impresoras Totales</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.printers}</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '180px' }}>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Filamentos</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.filaments}</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: '180px', border: stats.pending > 0 ? '1px solid var(--accent-orange)' : '' }}>
          <div className="text-muted text-xs uppercase tracking-wider mb-1">Pendientes de Revisar</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: stats.pending > 0 ? 'var(--accent-orange)' : '' }}>{stats.pending}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>📋 Solicitudes de verificación (Impresoras manuales)</h2>

      {pendingPrinters.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          No hay impresoras pendientes de verificar. ¡Todo limpio! ✨
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th className="p-4 text-xs font-semibold uppercase text-muted">Marca / Modelo</th>
                <th className="p-4 text-xs font-semibold uppercase text-muted">Consumo</th>
                <th className="p-4 text-xs font-semibold uppercase text-muted">Tipo</th>
                <th className="p-4 text-xs font-semibold uppercase text-muted text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingPrinters.map(printer => (
                <tr key={printer.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-4">
                    <div style={{ fontWeight: 600 }}>{printer.brand}</div>
                    <div className="text-sm text-muted">{printer.model}</div>
                  </td>
                  <td className="p-4">{printer.wattage_w}W</td>
                  <td className="p-4"><span className="badge badge-purple">{printer.type}</span></td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="btn btn-primary btn-sm" onClick={() => handleVerify(printer.id)}>✅ Verificar</button>
                      <button className="btn btn-ghost btn-danger btn-sm" onClick={() => handleDelete(printer.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
