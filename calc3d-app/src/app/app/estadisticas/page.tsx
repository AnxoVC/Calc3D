'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { useTranslation } from '@/contexts/I18nContext'

import Link from 'next/link'

interface CalcRow { id: string; name?: string; total_cost: number; material_cost: number; electricity_cost: number; labor_cost: number; weight_g: number; time_hours: number; created_at: string }

export default function EstadisticasPage() {
  const { t, language } = useTranslation()
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
    const month = new Date(c.created_at).toLocaleDateString(language === 'gl' ? 'gl-ES' : language, { month: 'short', year: '2-digit' })
    byMonth[month] = (byMonth[month] || 0) + c.total_cost
  })
  const monthEntries = Object.entries(byMonth).slice(-6)
  const maxMonthVal = Math.max(...monthEntries.map(([, v]) => v), 1)

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('stats.title')}</h1>
        <p className="page-subtitle">{t('stats.subtitle')}</p>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>{t('common.loading')}</div>}

      {!loading && calcs.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 style={{ marginBottom: '0.5rem' }}>{t('stats.empty.title')}</h3>
          <p>{t('stats.empty.desc')}</p>
        </div>
      )}

      {!loading && calcs.length > 0 && (
        <>
          <div className="stats-grid mb-6">
            {[
              { label: t('stats.labels.total_spend'), value: formatCurrency(totalCost), color: 'rgba(249,115,22,0.15)', textColor: 'var(--brand)' },
              { label: t('stats.labels.saved_calcs'), value: String(calcs.length), color: 'rgba(59,130,246,0.15)', textColor: 'var(--accent-blue)' },
              { label: t('stats.labels.total_material'), value: `${formatNumber(totalWeight, 0)}g`, color: 'rgba(34,197,94,0.15)', textColor: 'var(--accent-green)' },
              { label: t('stats.labels.total_time'), value: `${formatNumber(totalTime, 1)}h`, color: 'rgba(168,85,247,0.15)', textColor: 'var(--accent-purple)' },
              { label: t('stats.labels.avg_cost'), value: formatCurrency(avgCost), color: 'rgba(6,182,212,0.15)', textColor: 'var(--accent-cyan)' },
            ].map(stat => (
              <div key={stat.label} className="card-stat">
                <div className="card-stat-icon" style={{ background: stat.color }}>
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
              <h3 style={{ marginBottom: '1.5rem' }}>{t('stats.charts.monthly_spend')}</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 180 }}>
                {monthEntries.map(([month, val]) => (
                  <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{formatNumber(val, 1)}€</span>
                    <div style={{ width: '100%', background: 'var(--gradient-brand)', borderRadius: '6px 6px 0 0', height: `${(val / maxMonthVal) * 140}px`, minHeight: 4, boxShadow: '0 0 16px rgba(249,115,22,0.3)' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>{t('stats.saved_table.title')}</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>{t('stats.saved_table.date')}</th><th>{t('stats.saved_table.name')}</th><th>{t('stats.saved_table.material')}</th><th>Total</th><th align="right">{t('stats.saved_table.actions')}</th></tr></thead>
                <tbody>
                  {calcs.slice().reverse().map(c => (
                    <tr key={c.id}>
                      <td>{new Date(c.created_at).toLocaleDateString(language === 'gl' ? 'gl-ES' : language)}</td>
                      <td>
                        <Link href={`/app/presupuesto?id=${c.id}`} style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 600 }}>
                          {c.name || t('quote.default_calc_name')}
                        </Link>
                      </td>
                      <td>{formatCurrency(c.material_cost || 0)}</td>
                      <td style={{ color: 'var(--text)', fontWeight: 700 }}>{formatCurrency(c.total_cost)}</td>
                      <td align="right" className="flex items-center justify-end gap-2">
                        <Link href={`/app/presupuesto?id=${c.id}`}>
                          <button className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>{t('common.open')}</button>
                        </Link>
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: '0.25rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}
                          onClick={async () => {
                            if (!confirm(t('stats.delete_confirm'))) return;
                            const supabase = createClient();
                            await supabase.from('calculations').delete().eq('id', c.id);
                            setCalcs(calcs.filter(x => x.id !== c.id));
                          }}
                        >
                          {t('common.delete')}
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
