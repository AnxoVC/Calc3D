'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { calculate, type CalculationResult } from '@/lib/calculations'
import jsPDF from 'jspdf'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { useTranslation } from '@/contexts/I18nContext'

export default function PresupuestoPage() {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    clientName: '',
    kwhPrice: '0.15', amortization: '0',
    laborPerHour: '10', laborH: '0', laborM: '30', marginPercent: '20'
  })
  const [mats, setMats] = useState(() => [{ id: Date.now(), spoolId: '', weight: '100', price: '20' }])
  const [prns, setPrns] = useState(() => [{ id: Date.now(), printerId: '', timeH: '3', timeM: '0', wattage: '250' }])
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [myPrinters, setMyPrinters] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mySpools, setMySpools] = useState<any[]>([])

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
          } catch (e) { }
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
    const matCostTotal = mats.reduce((sum, m) => sum + ((Number(m.weight) || 0) / 1000) * (Number(m.price) || 0), 0)
    const equivPriceKg = totalWeight > 0 ? (matCostTotal / (totalWeight / 1000)) : 0

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
        user_id: user.id, name: form.clientName || t('quote.default_calc_name'),
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

    // Logo (Top Right)
    try {
      // Cargamos el logo como HTMLImageElement
      const img = new window.Image()
      img.src = '/logo.png'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      
      // Ajuste de proporciones para no encogerlo
      const maxWidth = 45;
      const maxHeight = 35;
      const ratio = img.width / img.height;
      let w = maxWidth;
      let h = w / ratio;
      if (h > maxHeight) {
        h = maxHeight;
        w = h * ratio;
      }
      
      // Colocar alineado a la derecha en x=190 aprox
      pdf.addImage(img, 'PNG', 195 - w, 10, w, h)
    } catch (e) {
      console.error("Error loading logo for PDF", e)
    }

    // Cabecera
    pdf.setFontSize(22)
    pdf.setFont('helvetica', 'bold')
    pdf.text(t('quote.pdf.header_title'), 20, 30)

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text(`${t('quote.pdf.date_label')}: ${new Date().toLocaleDateString()}`, 20, 40)
    if (form.clientName) {
      pdf.setTextColor(0, 0, 0)
      pdf.text(`${t('quote.pdf.client_label')}:`, 20, 48)
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
    pdf.text(t('quote.pdf.specifications_title'), 20, 65)

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')

    let filString = ''
    mats.forEach((m, idx) => {
      const s = mySpools.find(x => x.id === m.spoolId)
      const name = s ? `${s.brand || ''} ${s.material || ''} ${s.color_name || ''}`.trim() : `${t('quote.pdf.material_fallback')} ${idx + 1}`
      filString += `${idx > 0 ? ' + ' : ''}${name} (${formatNumber(Number(m.weight) || 0, 0)}g)`
    })

    let prnString = ''
    prns.forEach((pState, idx) => {
      const p = myPrinters.find(x => x.id === pState.printerId)
      const name = p ? (p.nickname || (p.printers ? p.printers.model : `${t('quote.pdf.printer_fallback')} ${idx + 1}`)) : `${t('quote.pdf.printer_fallback')} ${idx + 1}`
      prnString += `${idx > 0 ? ' + ' : ''}${name} (${pState.timeH}h ${pState.timeM}m)`
    })

    pdf.text(`${t('quote.pdf.materials_label')}: ${filString}`, 20, 75)
    pdf.text(`${t('quote.pdf.printers_label')}: ${prnString}`, 20, 82)
    
    // Línea separadora
    pdf.setDrawColor(200, 200, 200)
    pdf.line(20, 90, 190, 90)
    
    // Título desglose
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(t('quote.pdf.breakdown_title'), 20, 100)

    // Conceptos
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    let y = 110
    pdf.text(`${t('quote.results.material')}:`, 20, y); pdf.text(`${formatCurrency(result.materialCost)}`, 170, y, { align: 'right' }); y += 10;
    pdf.text(`${t('quote.results.energy')}:`, 20, y); pdf.text(`${formatCurrency(result.electricityCost)}`, 170, y, { align: 'right' }); y += 10;

    if (result.amortizationCost > 0) {
      pdf.text(`${t('quote.results.amortization')}:`, 20, y); pdf.text(`${formatCurrency(result.amortizationCost)}`, 170, y, { align: 'right' }); y += 10;
    }
    if (result.laborCost > 0) {
      pdf.text(`${t('quote.results.labor')}:`, 20, y); pdf.text(`${formatCurrency(result.laborCost)}`, 170, y, { align: 'right' }); y += 10;
    }


    // Total Final
    pdf.line(20, y, 190, y); y += 10;
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(249, 115, 22) // Naranja
    pdf.text(`${t('quote.pdf.final_price')}:`, 20, y); pdf.text(`${formatCurrency(result.total)}`, 170, y, { align: 'right' });

    // Pie de página
    pdf.setFontSize(10)
    pdf.setTextColor(150, 150, 150)
    pdf.setFont('helvetica', 'normal')
    pdf.text(t('quote.pdf.footer'), 20, 280)

    const safeClientName = form.clientName ? form.clientName.replace(/[^a-zA-Z0-9]/g, '_') : '3d'
    pdf.save(`presupuesto_${safeClientName}.pdf`)
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('quote.title')}</h1>
        <p className="page-subtitle">{t('quote.subtitle')}</p>
      </div>
      <div className="app-grid">
        <form onSubmit={handleCalc} className="flex flex-col gap-5">
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{t('quote.sections.client_title')}</h3>
            <div className="form-group">
              <label className="form-label">{t('quote.sections.client_name')}</label>
              <input className="form-input" placeholder={t('quote.sections.client_placeholder')} value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} />
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="flex items-center gap-2">{t('quote.sections.materials_title')}</span>
            </h3>
            <div className="materials-list">
              {mats.map((m, idx) => (
                <div key={m.id} style={{ marginBottom: idx === mats.length - 1 ? 0 : '1.5rem', paddingBottom: idx === mats.length - 1 ? 0 : '1.5rem', borderBottom: idx === mats.length - 1 ? 'none' : '1px dashed var(--border)' }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="form-label" style={{ color: 'var(--brand)', margin: 0 }}>{t('quote.sections.spool_label')} {idx + 1}</label>
                      {mats.length > 1 && <button type="button" className="text-muted text-xs hover:text-red-500" onClick={() => removeMaterial(m.id)}>{t('common.delete')}</button>}
                    </div>
                    <select className="form-select" value={m.spoolId} onChange={e => handleSpoolChange(idx, e.target.value)}>
                      <option value="">— {t('common.manual_selection')} —</option>
                      {mySpools.map(s => <option key={s.id} value={s.id}>{s.brand || ''} {s.material || ''} {s.color_name || ''} - {s.remaining_weight_g}g</option>)}
                    </select>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">{t('quote.sections.weight_used')}</label>
                      <input type="number" className="form-input" value={m.weight} onChange={e => { const n = [...mats]; n[idx].weight = e.target.value; setMats(n) }} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('quote.sections.price_per_kg')}</label>
                      <input type="number" step="0.01" className="form-input" value={m.price} onChange={e => { const n = [...mats]; n[idx].price = e.target.value; setMats(n) }} required />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-ghost w-full mt-4" style={{ border: '1px dashed var(--border)', justifyContent: 'center' }} onClick={addMaterial}>
                {t('quote.sections.add_filament')}
              </button>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="flex items-center gap-2">{t('quote.sections.printers_title')}</span>
            </h3>

            <div className="printers-list">
              {prns.map((p, idx) => (
                <div key={p.id} style={{ marginBottom: idx === prns.length - 1 ? 0 : '1.5rem', paddingBottom: idx === prns.length - 1 ? 0 : '1.5rem', borderBottom: idx === prns.length - 1 ? 'none' : '1px dashed var(--border)' }}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="form-label" style={{ color: 'var(--brand)', margin: 0 }}>{t('quote.sections.printer_label')} {idx + 1}</label>
                      {prns.length > 1 && <button type="button" className="text-muted text-xs hover:text-red-500" onClick={() => removePrinter(p.id)}>{t('common.delete')}</button>}
                    </div>
                    <select className="form-select" value={p.printerId} onChange={e => handlePrinterChange(idx, e.target.value)}>
                      <option value="">— {t('common.manual_selection')} —</option>
                      {myPrinters.map(up => (
                        <option key={up.id} value={up.id}>
                          {up.nickname || (up.printers ? `${up.printers.brand} ${up.printers.model}` : t('calculator.form.custom_printer'))} - {up.custom_wattage_w || up.printers?.wattage_w || '?'}W
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">{t('calculator.form.hours')}</label>
                      <input type="number" className="form-input" value={p.timeH} onChange={e => { const n = [...prns]; n[idx].timeH = e.target.value; setPrns(n) }} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('calculator.form.minutes')}</label>
                      <input type="number" min="0" max="59" className="form-input" value={p.timeM} onChange={e => { const n = [...prns]; n[idx].timeM = e.target.value; setPrns(n) }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('calculator.form.wattage_label')}</label>
                      <input type="number" className="form-input" value={p.wattage} onChange={e => { const n = [...prns]; n[idx].wattage = e.target.value; setPrns(n) }} required />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="btn btn-ghost w-full mt-4" style={{ border: '1px dashed var(--border)', justifyContent: 'center' }} onClick={addPrinter}>
              {t('quote.sections.add_printer')}
            </button>

            <div className="form-group" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border)' }}>
              <label className="form-label">{t('quote.sections.elec_price_label')}</label>
              <input type="number" step="0.001" className="form-input" value={form.kwhPrice} onChange={e => setForm({ ...form, kwhPrice: e.target.value })} required />
            </div>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(245,158,11,0.04))' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{t('quote.sections.labor_margin_title')}</h3>
            <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>{t('quote.sections.labor_margin_desc')}</p>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">{t('quote.sections.operator_time')}</label>
                <div className="form-grid">
                  <div className="input-wrapper">
                    <input type="number" className="form-input" value={form.laborH} onChange={e => setForm({ ...form, laborH: e.target.value })} />
                    <span className="text-muted text-sm ml-2 absolute right-3 top-3">{t('calculator.form.hours')}</span>
                  </div>
                  <div className="input-wrapper">
                    <input type="number" min="0" max="59" className="form-input" value={form.laborM} onChange={e => setForm({ ...form, laborM: e.target.value })} />
                    <span className="text-muted text-sm ml-2 absolute right-3 top-3">{t('calculator.form.minutes_short')}</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('quote.sections.labor_cost_label')}</label>
                <div className="input-wrapper">
                  <span className="input-prefix">€</span>
                  <input type="number" step="0.5" className="form-input" value={form.laborPerHour} onChange={e => setForm({ ...form, laborPerHour: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('calculator.form.amortization_label')}</label>
                <div className="input-wrapper">
                  <span className="input-prefix">€</span>
                  <input type="number" step="0.01" className="form-input" value={form.amortization} onChange={e => setForm({ ...form, amortization: e.target.value })} />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">{t('calculator.form.margin_label')} (%)</label>
                <input type="range" min="0" max="100" className="form-input" style={{ padding: '0.5rem 0', background: 'transparent', border: 'none' }} value={form.marginPercent} onChange={e => setForm({ ...form, marginPercent: e.target.value })} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>0%</span><span style={{ color: 'var(--brand)', fontWeight: 700 }}>{form.marginPercent}%</span><span>100%</span>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} disabled={saving}>
            {saving ? t('quote.calculating_msg') : t('quote.calculate_btn')}
          </button>
        </form>

        <div style={{ position: 'sticky', top: '1rem' }}>
          {result ? (
            <div id="budget-result" className="result-box animate-slide-up" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{t('quote.results.sale_price')}</p>
                <div id="calc3d-watermark" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MyCalc3D</div>
              </div>
              <div className="result-total">{formatCurrency(result.total)}</div>
              <div className="result-breakdown">
                <div className="breakdown-item"><span className="breakdown-label">{t('quote.results.material')}</span><span className="breakdown-value">{formatCurrency(result.materialCost)}</span></div>
                <div className="breakdown-item"><span className="breakdown-label">{t('quote.results.energy')}</span><span className="breakdown-value">{formatCurrency(result.electricityCost)}</span></div>
                {result.amortizationCost > 0 && <div className="breakdown-item"><span className="breakdown-label">{t('quote.results.amortization')}</span><span className="breakdown-value">{formatCurrency(result.amortizationCost)}</span></div>}
                {result.laborCost > 0 && <div className="breakdown-item"><span className="breakdown-label">{t('quote.results.labor')}</span><span className="breakdown-value">{formatCurrency(result.laborCost)}</span></div>}
                <div className="breakdown-item"><span className="breakdown-label">{t('quote.results.subtotal')}</span><span className="breakdown-value">{formatCurrency(result.subtotal)}</span></div>
                {result.margin > 0 && <div className="breakdown-item"><span className="breakdown-label">{t('quote.results.margin')} ({form.marginPercent}%)</span><span className="breakdown-value">+{formatCurrency(result.margin)}</span></div>}
                <div className="breakdown-item breakdown-total"><span className="breakdown-label" style={{ fontWeight: 700 }}>{t('quote.results.final_price')}</span><span className="breakdown-value" style={{ color: 'var(--brand)', fontSize: '1.1rem' }}>{formatCurrency(result.total)}</span></div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }} data-html2canvas-ignore="true">
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleDownloadPDF}>{t('quote.results.download_pdf')}</button>
                {saved && <div className="alert alert-success" style={{ flex: 1, padding: '0.5rem', textAlign: 'center', margin: 0 }}>{t('common.saved')}</div>}
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>📊</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('quote.results.empty_desc')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
