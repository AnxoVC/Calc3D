'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

import Link from 'next/link'

interface CalcRow { id: string; name?: string; total_cost: number; material_cost: number; electricity_cost: number; labor_cost: number; weight_g: number; time_hours: number; created_at: string }

export default function EstadisticasPage() {
  const [calcs, setCalcs] = useState<CalcRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('calculations').select('*').eq('user_id', user.id).order('created_at', { ascending: true }).then(({ data }) => {
        setCalcs(data || [])
        setLoading(false)
      })
    })
  }, [])

  const totalCost = calcs.reduce((s, c) => s + (c.total_cost || 0), 0)
  const totalWeight = calcs.reduce((s, c) => s + (c.weight_g || 0), 0)
  const totalTime = calcs.reduce((s, c) => s + (c.time_hours || 0), 0)
  const avgCost = calcs.length ? totalCost / calcs.length : 0

  // Group by month
  const byMonth: Record<string, number> = {}
  calcs.forEach(c => {
    const month = new Date(c.created_at).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
    byMonth[month] = (byMonth[month] || 0) + c.total_cost
  })
  const monthEntries = Object.entries(byMonth).slice(-6)
  const maxMonthVal = Math.max(...monthEntries.map(([, v]) => v), 1)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">📊 Estadísticas</h1>
        <p className="page-subtitle">Resumen de tu actividad de impresión</p>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>Cargando...</div>}

      {!loading && calcs.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Sin datos aún</h3>
          <p>Usa la calculadora para guardar cálculos y ver aquí tus estadísticas.</p>
        </div>
      )}

      {!loading && calcs.length > 0 && (
        <>
          <div className="stats-grid mb-6">
            {[
              { icon: '💶', label: 'Gasto total', value: `${totalCost.toFixed(2)}€`, color: 'rgba(249,115,22,0.15)', textColor: 'var(--brand)' },
              { icon: '🧮', label: 'Cálculos guardados', value: String(calcs.length), color: 'rgba(59,130,246,0.15)', textColor: 'var(--accent-blue)' },
              { icon: '⚖️', label: 'Material total', value: `${totalWeight.toFixed(0)}g`, color: 'rgba(34,197,94,0.15)', textColor: 'var(--accent-green)' },
              { icon: '⏱️', label: 'Tiempo total', value: `${totalTime.toFixed(1)}h`, color: 'rgba(168,85,247,0.15)', textColor: 'var(--accent-purple)' },
              { icon: '📈', label: 'Coste medio', value: `${avgCost.toFixed(2)}€`, color: 'rgba(6,182,212,0.15)', textColor: 'var(--accent-cyan)' },
            ].map(stat => (
              <div key={stat.label} className="card-stat">
                <div className="card-stat-icon" style={{ background: stat.color }}>
                  <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.textColor }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {monthEntries.length > 0 && (
            <div className="card mb-6">
              <h3 style={{ marginBottom: '1.5rem' }}>Gasto mensual</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 180 }}>
                {monthEntries.map(([month, val]) => (
                  <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{val.toFixed(1)}€</span>
                    <div style={{ width: '100%', background: 'var(--gradient-brand)', borderRadius: '6px 6px 0 0', height: `${(val / maxMonthVal) * 140}px`, minHeight: 4, boxShadow: '0 0 16px rgba(249,115,22,0.3)' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Cálculos guardados</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Fecha</th><th>Nombre</th><th>Material</th><th>Total</th><th align="right">Acciones</th></tr></thead>
                <tbody>
                  {calcs.slice().reverse().map(c => (
                    <tr key={c.id}>
                      <td>{new Date(c.created_at).toLocaleDateString('es-ES')}</td>
                      <td>
                        <Link href={`/app/presupuesto?id=${c.id}`} style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>
                          {c.name || 'Presupuesto'}
                        </Link>
                      </td>
                      <td>{(c.material_cost || 0).toFixed(3)}€</td>
                      <td style={{ color: 'var(--text)', fontWeight: 700 }}>{c.total_cost.toFixed(3)}€</td>
                      <td align="right" className="flex items-center justify-end gap-2">
                        <Link href={`/app/presupuesto?id=${c.id}`}>
                          <button className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>▶️ Abrir</button>
                        </Link>
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: '0.25rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}
                          onClick={async () => {
                            if (!confirm('¿Seguro que quieres borrar este cálculo?')) return;
                            const supabase = createClient();
                            await supabase.from('calculations').delete().eq('id', c.id);
                            setCalcs(calcs.filter(x => x.id !== c.id));
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
