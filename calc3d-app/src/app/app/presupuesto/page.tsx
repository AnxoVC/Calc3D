'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculate, type CalculationResult } from '@/lib/calculations'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function PresupuestoPage() {
  const [form, setForm] = useState({
    clientName: '',
    kwhPrice: '0.15', amortization: '0',
    laborPerHour: '10', laborH: '0', laborM: '30', marginPercent: '20'
  })
  const [mats, setMats] = useState([{ id: Date.now(), spoolId: '', weight: '100', price: '20' }])
  const [prns, setPrns] = useState([{ id: Date.now(), printerId: '', timeH: '3', timeM: '0', wattage: '250' }])
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [myPrinters, setMyPrinters] = useState<any[]>([])
  const [mySpools, setMySpools] = useState<any[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState('')
  const [selectedPrinter2, setSelectedPrinter2] = useState('')

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: printers } = await supabase.from('user_printers').select('*, printers(*)').eq('user_id', user.id)
      setMyPrinters(printers || [])

      const { data: spools } = await supabase.from('spools').select('*').eq('user_id', user.id)
      setMySpools(spools || [])

      const params = new URLSearchParams(window.location.search)
      const calcId = params.get('id')
      if (calcId) {
        const { data: calc } = await supabase.from('calculations').select('*').eq('id', calcId).single()
        if (calc && calc.notes && calc.notes.startsWith('{')) {
          try {
            const config = JSON.parse(calc.notes)
            if (config.form) setForm(config.form)
            if (config.mats) setMats(config.mats)
            if (config.prns) setPrns(config.prns)
            if (config.result) setResult(config.result)
          } catch(e) {}
        }
      }
    }
    loadData()
  }, [])

  function handleSpoolChange(index: number, id: string) {
    const newMats = [...mats]
    newMats[index].spoolId = id
    if (id) {
      const spool = mySpools.find(s => s.id === id)
      if (spool && spool.purchase_price && spool.total_weight_g) {
        newMats[index].price = (spool.purchase_price / (spool.total_weight_g / 1000)).toFixed(2)
      }
    }
    setMats(newMats)
  }

  function addMaterial() {
    setMats([...mats, { id: Date.now(), spoolId: '', weight: '', price: '' }])
  }

  function removeMaterial(id: number) {
    if (mats.length === 1) return
    setMats(mats.filter(m => m.id !== id))
  }

  function handlePrinterChange(index: number, id: string) {
    const newPrns = [...prns]
    newPrns[index].printerId = id
    if (id) {
      const up = myPrinters.find(p => p.id === id)
      if (up) {
        const wattage = up.custom_wattage_w || up.printers?.wattage_w
        if (wattage) {
          newPrns[index].wattage = String(wattage)
        }
      }
    }
    setPrns(newPrns)
  }

  function addPrinter() {
    setPrns([...prns, { id: Date.now(), printerId: '', timeH: '3', timeM: '0', wattage: '250' }])
  }

  function removePrinter(id: number) {
    if (prns.length === 1) return
    setPrns(prns.filter(p => p.id !== id))
  }

  async function handleCalc(e: React.FormEvent) {
    e.preventDefault()
    
    // Calculate Material
    const totalWeight = mats.reduce((sum, m) => sum + (Number(m.weight) || 0), 0)
    const matCostTotal = mats.reduce((sum, m) => sum + ((Number(m.weight) || 0)/1000)*(Number(m.price) || 0), 0)
    const equivPriceKg = totalWeight > 0 ? (matCostTotal / (totalWeight/1000)) : 0

    // Calculate Electricity
    const totalTimeHours = prns.reduce((sum, p) => sum + ((Number(p.timeH) || 0) + (Number(p.timeM) || 0) / 60), 0)
    const kwhP = Number(form.kwhPrice) || 0
    const elecCostTotal = prns.reduce((sum, p) => {
      const tH = (Number(p.timeH) || 0) + (Number(p.timeM) || 0) / 60
      const w = Number(p.wattage) || 0
      return sum + (tH * (w / 1000) * kwhP)
    }, 0)
    const equivWattage = (totalTimeHours > 0 && kwhP > 0) ? ((elecCostTotal / (totalTimeHours * kwhP)) * 1000) : 0

    const r = calculate({
      weightG: totalWeight, pricePerKg: equivPriceKg,
      spoolWeightG: 1000, timeHours: totalTimeHours, wattage: equivWattage,
      kwhPrice: kwhP, amortizationPerHour: Number(form.amortization),
      laborPerHour: Number(form.laborPerHour),
      laborTimeHours: Number(form.laborH) + Number(form.laborM) / 60,
      marginPercent: Number(form.marginPercent),
    })
    setResult(r)
    setSaved(false)
    setSaving(true)

    // Save calculation to DB automatically
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const configJson = JSON.stringify({ form, mats, prns, result: r })
      await supabase.from('calculations').insert({
        user_id: user.id, name: form.clientName || 'Presupuesto Pedido',
        weight_g: totalWeight, time_hours: totalTimeHours,
        kwh_price: kwhP, material_cost: r.materialCost,
        electricity_cost: r.electricityCost, amortization_cost: r.amortizationCost,
        labor_cost: r.laborCost, margin_pct: Number(form.marginPercent), total_cost: r.total,
        notes: configJson
      })
      setSaved(true)
    }
    setSaving(false)
  }

  async function handleDownloadPDF() {
    if (!result) return
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Configuración inicial (Fondo blanco y texto negro)
    pdf.setFillColor(255, 255, 255)
    pdf.rect(0, 0, 210, 297, 'F')
    pdf.setTextColor(0, 0, 0)
    
    // Cabecera
    pdf.setFontSize(22)
    pdf.setFont('helvetica', 'bold')
    pdf.text("Presupuesto de Impresion 3D", 20, 30)
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 40)
    if (form.clientName) {
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Cliente:`, 20, 48)
      pdf.setFont('helvetica', 'bold')
      pdf.text(form.clientName, 38, 48)
    }
    
    // Línea separadora
    pdf.setDrawColor(200, 200, 200)
    pdf.line(20, 55, 190, 55)
    
    // Especificaciones Técnicas
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text("Especificaciones", 20, 65)

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    
    let filString = ''
    mats.forEach((m, idx) => {
      const s = mySpools.find(x => x.id === m.spoolId)
      const name = s ? `${s.brand || ''} ${s.material || ''} ${s.color_name || ''}`.trim() : `Material ${idx+1}`
      filString += `${idx > 0 ? ' + ' : ''}${name} (${m.weight || 0}g)`
    })
    
    let prnString = ''
    prns.forEach((pState, idx) => {
      const p = myPrinters.find(x => x.id === pState.printerId)
      const name = p ? (p.nickname || (p.printers ? p.printers.model : `Impresora ${idx + 1}`)) : `Impresora ${idx + 1}`
      prnString += `${idx > 0 ? ' + ' : ''}${name} (${pState.timeH}h ${pState.timeM}m)`
    })

    pdf.text(`Materiales: ${filString}`, 20, 75)
    pdf.text(`Equipos: ${prnString}`, 20, 82)

    // Línea separadora
    pdf.setDrawColor(200, 200, 200)
    pdf.line(20, 90, 190, 90)

    // Título desglose
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text("Desglose de costes", 20, 100)
    
    // Conceptos
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    let y = 110
    pdf.text("Material:", 20, y); pdf.text(`${result.materialCost.toFixed(3)} EUR`, 170, y, { align: 'right' }); y += 10;
    pdf.text("Electricidad:", 20, y); pdf.text(`${result.electricityCost.toFixed(3)} EUR`, 170, y, { align: 'right' }); y += 10;
    
    if (result.amortizationCost > 0) {
      pdf.text("Amortizacion:", 20, y); pdf.text(`${result.amortizationCost.toFixed(3)} EUR`, 170, y, { align: 'right' }); y += 10;
    }
    if (result.laborCost > 0) {
      pdf.text("Mano de obra:", 20, y); pdf.text(`${result.laborCost.toFixed(3)} EUR`, 170, y, { align: 'right' }); y += 10;
    }
    
    // Subtotal
    pdf.line(20, y, 190, y); y += 10;
    pdf.setFont('helvetica', 'bold')
    pdf.text("Subtotal:", 20, y); pdf.text(`${result.subtotal.toFixed(3)} EUR`, 170, y, { align: 'right' }); y += 10;
    
    // Margen
    if (result.margin > 0) {
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Margen (${form.marginPercent}%):`, 20, y); pdf.text(`+${result.margin.toFixed(3)} EUR`, 170, y, { align: 'right' }); y += 10;
    }
    
    // Total Final
    pdf.line(20, y, 190, y); y += 10;
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(249, 115, 22) // Naranja
    pdf.text("PRECIO FINAL:", 20, y); pdf.text(`${result.total.toFixed(2)} EUR`, 170, y, { align: 'right' });
    
    // Pie de página
    pdf.setFontSize(10)
    pdf.setTextColor(150, 150, 150)
    pdf.setFont('helvetica', 'normal')
    pdf.text("Generado con Calc3D", 20, 280)

    const safeClientName = form.clientName ? form.clientName.replace(/[^a-zA-Z0-9]/g, '_') : '3d'
    pdf.save(`presupuesto_${safeClientName}.pdf`)
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">💰 Presupuesto Rápido</h1>
        <p className="page-subtitle">Calcula el precio de venta con mano de obra y margen</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,380px)', gap: '1.5rem', alignItems: 'start' }}>
        <form onSubmit={handleCalc} className="flex flex-col gap-5">
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>👤 Cliente / Pedido</h3>
            <div className="form-group">
              <label className="form-label">Nombre del cliente / Proyecto</label>
              <input className="form-input" placeholder="Ej: Juan Pérez - Trofeo Torneo" value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})} />
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="flex items-center gap-2">🧵 Materiales</span>
            </h3>
            <div className="materials-list">
              {mats.map((m, idx) => (
                <div key={m.id} style={{ marginBottom: idx === mats.length-1 ? 0 : '1.5rem', paddingBottom: idx === mats.length-1 ? 0 : '1.5rem', borderBottom: idx === mats.length-1 ? 'none' : '1px dashed var(--border)' }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="form-label" style={{ color: 'var(--brand)', margin: 0 }}>Bobina {idx + 1}</label>
                      {mats.length > 1 && <button type="button" className="text-muted text-xs hover:text-red-500" onClick={() => removeMaterial(m.id)}>Eliminar</button>}
                    </div>
                    <select className="form-select" value={m.spoolId} onChange={e => handleSpoolChange(idx, e.target.value)}>
                      <option value="">— Selección manual —</option>
                      {mySpools.map(s => <option key={s.id} value={s.id}>{s.brand || ''} {s.material || ''} {s.color_name || ''} - {s.remaining_weight_g}g</option>)}
                    </select>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Peso usado (g)</label>
                      <input type="number" className="form-input" value={m.weight} onChange={e => { const n = [...mats]; n[idx].weight = e.target.value; setMats(n) }} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Precio kg (€)</label>
                      <input type="number" step="0.01" className="form-input" value={m.price} onChange={e => { const n = [...mats]; n[idx].price = e.target.value; setMats(n) }} required />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-ghost w-full mt-4" style={{ border: '1px dashed var(--border)', justifyContent: 'center' }} onClick={addMaterial}>
                + Añadir otro filamento
              </button>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="flex items-center gap-2">⚡ Equipos y Tiempo</span>
            </h3>
            
            <div className="printers-list">
              {prns.map((p, idx) => (
                <div key={p.id} style={{ marginBottom: idx === prns.length-1 ? 0 : '1.5rem', paddingBottom: idx === prns.length-1 ? 0 : '1.5rem', borderBottom: idx === prns.length-1 ? 'none' : '1px dashed var(--border)' }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="form-label" style={{ color: 'var(--brand)', margin: 0 }}>Impresora {idx + 1}</label>
                      {prns.length > 1 && <button type="button" className="text-muted text-xs hover:text-red-500" onClick={() => removePrinter(p.id)}>Eliminar</button>}
                    </div>
                    <select className="form-select" value={p.printerId} onChange={e => handlePrinterChange(idx, e.target.value)}>
                      <option value="">— Selección manual —</option>
                      {myPrinters.map(up => (
                        <option key={up.id} value={up.id}>
                          {up.nickname || (up.printers ? `${up.printers.brand} ${up.printers.model}` : 'Impresora')} - {up.custom_wattage_w || up.printers?.wattage_w || '?'}W
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Horas</label>
                      <input type="number" className="form-input" value={p.timeH} onChange={e => { const n = [...prns]; n[idx].timeH = e.target.value; setPrns(n) }} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Minutos</label>
                      <input type="number" min="0" max="59" className="form-input" value={p.timeM} onChange={e => { const n = [...prns]; n[idx].timeM = e.target.value; setPrns(n) }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Consumo (W)</label>
                      <input type="number" className="form-input" value={p.wattage} onChange={e => { const n = [...prns]; n[idx].wattage = e.target.value; setPrns(n) }} required />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button type="button" className="btn btn-ghost w-full mt-4" style={{ border: '1px dashed var(--border)', justifyContent: 'center' }} onClick={addPrinter}>
              + Añadir otra impresora
            </button>
            
            <div className="form-group" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border)' }}>
              <label className="form-label">Precio general kWh (€)</label>
              <input type="number" step="0.001" className="form-input" value={form.kwhPrice} onChange={e => setForm({...form, kwhPrice: e.target.value})} required />
            </div>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(245,158,11,0.04))' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>👷 Mano de obra & Margen</h3>
            <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>Estas opciones son 100% gratuitas en Calc3D</p>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Tiempo del operador (preparación + postprocesado)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-wrapper">
                    <input type="number" className="form-input" value={form.laborH} onChange={e => setForm({...form, laborH: e.target.value})} />
                    <span className="text-muted text-sm ml-2 absolute right-3 top-3">Horas</span>
                  </div>
                  <div className="input-wrapper">
                    <input type="number" min="0" max="59" className="form-input" value={form.laborM} onChange={e => setForm({...form, laborM: e.target.value})} />
                    <span className="text-muted text-sm ml-2 absolute right-3 top-3">Min.</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Coste operador (€/h)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">€</span>
                  <input type="number" step="0.5" className="form-input" value={form.laborPerHour} onChange={e => setForm({...form, laborPerHour: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Amortización (€/h)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">€</span>
                  <input type="number" step="0.01" className="form-input" value={form.amortization} onChange={e => setForm({...form, amortization: e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Margen de beneficio (%)</label>
                <input type="range" min="0" max="100" className="form-input" style={{ padding: '0.5rem 0', background: 'transparent', border: 'none' }} value={form.marginPercent} onChange={e => setForm({...form, marginPercent: e.target.value})} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>0%</span><span style={{ color: 'var(--brand)', fontWeight: 700 }}>{form.marginPercent}%</span><span>100%</span>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} disabled={saving}>
            {saving ? 'Calculando y Guardando...' : 'Calcular presupuesto →'}
          </button>
        </form>

        <div style={{ position: 'sticky', top: '1rem' }}>
          {result ? (
            <div id="budget-result" className="result-box animate-slide-up" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Precio de venta</p>
                <div id="calc3d-watermark" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calc3D App</div>
              </div>
              <div className="result-total">{result.total.toFixed(2)}€</div>
              <div className="result-breakdown">
                <div className="breakdown-item"><span className="breakdown-label">🧵 Material</span><span className="breakdown-value">{result.materialCost.toFixed(3)}€</span></div>
                <div className="breakdown-item"><span className="breakdown-label">⚡ Electricidad</span><span className="breakdown-value">{result.electricityCost.toFixed(3)}€</span></div>
                {result.amortizationCost > 0 && <div className="breakdown-item"><span className="breakdown-label">🔧 Amortización</span><span className="breakdown-value">{result.amortizationCost.toFixed(3)}€</span></div>}
                {result.laborCost > 0 && <div className="breakdown-item"><span className="breakdown-label">👷 Mano de obra</span><span className="breakdown-value">{result.laborCost.toFixed(3)}€</span></div>}
                <div className="breakdown-item"><span className="breakdown-label">📊 Subtotal</span><span className="breakdown-value">{result.subtotal.toFixed(3)}€</span></div>
                {result.margin > 0 && <div className="breakdown-item"><span className="breakdown-label">💹 Margen ({form.marginPercent}%)</span><span className="breakdown-value">+{result.margin.toFixed(3)}€</span></div>}
                <div className="breakdown-item breakdown-total"><span className="breakdown-label" style={{ fontWeight: 700 }}>PRECIO FINAL</span><span className="breakdown-value" style={{ color: 'var(--brand)', fontSize: '1.1rem' }}>{result.total.toFixed(2)}€</span></div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }} data-html2canvas-ignore="true">
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleDownloadPDF}>📄 Descargar PDF</button>
                {saved && <div className="alert alert-success" style={{ flex: 1, padding: '0.5rem', textAlign: 'center', margin: 0 }}>✅ Guardado</div>}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>💰</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Rellena los datos y calcula para ver el precio de venta recomendado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
