'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculate, type CalculationResult } from '@/lib/calculations'

interface Printer { id: string; brand: string; model: string; wattage_w: number }
interface Filament { id: string; brand: string; material: string; color_name: string; price_per_kg: number | null }

export default function CalculadoraPage() {
  const [printers, setPrinters] = useState<Printer[]>([])
  const [filaments, setFilaments] = useState<Filament[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null)
  const [selectedFilament, setSelectedFilament] = useState<Filament | null>(null)
  const [form, setForm] = useState({ weightG: '100', pricePerKg: '20', spoolWeightG: '1000', timeH: '3', timeM: '0', kwhPrice: '0.15', wattage: '250', amortization: '0' })
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [filterMat, setFilterMat] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('printers').select('id,brand,model,wattage_w').order('brand').then(({ data }) => setPrinters(data || []))
    supabase.from('filaments').select('id,brand,material,color_name,price_per_kg').order('brand').then(({ data }) => setFilaments(data || []))
  }, [])

  function handlePrinterChange(id: string) {
    const p = printers.find(x => x.id === id)
    setSelectedPrinter(p || null)
    if (p) setForm(f => ({ ...f, wattage: String(p.wattage_w) }))
  }

  function handleFilamentChange(id: string) {
    const f = filaments.find(x => x.id === id)
    setSelectedFilament(f || null)
    if (f?.price_per_kg) setForm(fm => ({ ...fm, pricePerKg: String(f.price_per_kg) }))
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault()
    const timeHours = Number(form.timeH) + Number(form.timeM) / 60
    const r = calculate({
      weightG: Number(form.weightG),
      pricePerKg: Number(form.pricePerKg),
      spoolWeightG: Number(form.spoolWeightG),
      timeHours,
      wattage: Number(form.wattage),
      kwhPrice: Number(form.kwhPrice),
      amortizationPerHour: Number(form.amortization),
    })
    setResult(r)
    setSaved(false)
  }

  async function handleSave() {
    if (!result) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const timeHours = Number(form.timeH) + Number(form.timeM) / 60
    await supabase.from('calculations').insert({
      user_id: user.id,
      printer_id: selectedPrinter?.id || null,
      filament_id: selectedFilament?.id || null,
      weight_g: Number(form.weightG),
      time_hours: timeHours,
      kwh_price: Number(form.kwhPrice),
      material_cost: result.materialCost,
      electricity_cost: result.electricityCost,
      amortization_cost: result.amortizationCost,
      total_cost: result.total,
    })
    setSaving(false)
    setSaved(true)
  }

  const materials = [...new Set(filaments.map(f => f.material))].sort()
  const filteredFilaments = filterMat ? filaments.filter(f => f.material === filterMat) : filaments

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Calculadora</h1>
        <p className="page-subtitle">Calcula el coste exacto de tu impresión</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,380px)', gap: '1.5rem', alignItems: 'start' }}>
        {/* FORM */}
        <form onSubmit={handleCalculate} className="flex flex-col gap-5">
          {/* Impresora */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Impresora</h3>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Seleccionar impresora</label>
              <select className="form-select" onChange={e => handlePrinterChange(e.target.value)} defaultValue="">
                <option value="">— Manual —</option>
                {printers.map(p => <option key={p.id} value={p.id}>{p.brand} {p.model} ({p.wattage_w}W)</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Consumo (W)</label>
              <input type="number" className="form-input" value={form.wattage} onChange={e => setForm({...form, wattage: e.target.value})} required />
            </div>
          </div>

          {/* Filamento */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Filamento</h3>
            <div className="form-grid" style={{ marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Material</label>
                <select className="form-select" value={filterMat} onChange={e => setFilterMat(e.target.value)}>
                  <option value="">Todos</option>
                  {materials.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Filamento</label>
                <select className="form-select" onChange={e => handleFilamentChange(e.target.value)} defaultValue="">
                  <option value="">— Manual —</option>
                  {filteredFilaments.map(f => <option key={f.id} value={f.id}>{f.brand} {f.material} - {f.color_name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Peso usado (g)</label>
                <input type="number" className="form-input" value={form.weightG} onChange={e => setForm({...form, weightG: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Precio por kg (€)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">€</span>
                  <input type="number" step="0.01" className="form-input" value={form.pricePerKg} onChange={e => setForm({...form, pricePerKg: e.target.value})} required />
                </div>
              </div>
            </div>
          </div>

          {/* Tiempo y electricidad */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Tiempo & Electricidad</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Horas</label>
                <input type="number" className="form-input" value={form.timeH} onChange={e => setForm({...form, timeH: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Minutos</label>
                <input type="number" min="0" max="59" className="form-input" value={form.timeM} onChange={e => setForm({...form, timeM: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Precio kWh (€)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">€</span>
                  <input type="number" step="0.001" className="form-input" value={form.kwhPrice} onChange={e => setForm({...form, kwhPrice: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Amortización (€/h)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">€</span>
                  <input type="number" step="0.01" className="form-input" value={form.amortization} onChange={e => setForm({...form, amortization: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }}>Calcular coste →</button>
        </form>

        {/* RESULT */}
        <div style={{ position: 'sticky', top: '1rem' }}>
          {!result && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Rellena los datos y pulsa calcular para ver el desglose de costes</p>
            </div>
          )}
          {result && (
            <div className="result-box animate-slide-up">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Coste total</p>
              <div className="result-total">{result.total.toFixed(3)}€</div>
              <div className="result-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-label">Material</span>
                  <span className="breakdown-value">{result.materialCost.toFixed(3)}€</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Electricidad</span>
                  <span className="breakdown-value">{result.electricityCost.toFixed(3)}€</span>
                </div>
                {result.amortizationCost > 0 && (
                  <div className="breakdown-item">
                    <span className="breakdown-label">Amortización</span>
                    <span className="breakdown-value">{result.amortizationCost.toFixed(3)}€</span>
                  </div>
                )}
                <div className="breakdown-item breakdown-total">
                  <span className="breakdown-label" style={{ fontWeight: 700 }}>TOTAL</span>
                  <span className="breakdown-value" style={{ color: 'var(--brand)', fontSize: '1.1rem' }}>{result.total.toFixed(3)}€</span>
                </div>
              </div>
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {saved ? (
                  <div className="alert alert-success">¡Cálculo guardado en tu historial!</div>
                ) : (
                  <button className="btn btn-secondary w-full" style={{ justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar cálculo'}
                  </button>
                )}
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>Para presupuestos con mano de obra y margen, usa <a href="/app/presupuesto" style={{ color: 'var(--brand)' }}>Presupuesto Rápido →</a></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
