'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ type: 'suggestion', subject: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('feedback').insert({
      user_id: user?.id || null,
      type: form.type,
      subject: form.subject,
      message: form.message
    })

    setLoading(false)
    setSuccess(true)
    setForm({ type: 'suggestion', subject: '', message: '' })
  }

  return (
    <div className="animate-fade-in p-6 max-w-2xl mx-auto">
      <div className="section-header mb-8">
        <div>
          <h1 className="page-title">💡 Sugerencias y Fallos</h1>
          <p className="page-subtitle">Ayúdanos a mejorar Calc3D reportando errores o proponiendo ideas.</p>
        </div>
      </div>

      {success ? (
        <div className="card p-12 text-center animate-slide-up">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚀</div>
          <h2 style={{ marginBottom: '1rem' }}>¡Gracias por tu mensaje!</h2>
          <p className="text-muted mb-8">Hemos recibido tu sugerencia. El equipo de administración la revisará pronto.</p>
          <button className="btn btn-primary" onClick={() => setSuccess(false)}>Enviar otro mensaje</button>
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="form-group">
              <label className="form-label">¿Qué quieres enviarnos?</label>
              <div className="flex gap-4">
                <label className={`form-input flex items-center gap-2 cursor-pointer ${form.type === 'suggestion' ? 'bg-primary/10 border-primary' : ''}`} style={{ flex: 1 }}>
                  <input type="radio" name="type" value="suggestion" checked={form.type === 'suggestion'} onChange={e => setForm({...form, type: e.target.value})} />
                  <span>Sugerencia</span>
                </label>
                <label className={`form-input flex items-center gap-2 cursor-pointer ${form.type === 'bug' ? 'bg-primary/10 border-primary' : ''}`} style={{ flex: 1 }}>
                  <input type="radio" name="type" value="bug" checked={form.type === 'bug'} onChange={e => setForm({...form, type: e.target.value})} />
                  <span>Reportar Fallo</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Asunto</label>
              <input 
                className="form-input" 
                placeholder="Ej: Nueva funcionalidad, Error en la calculadora..." 
                value={form.subject} 
                onChange={e => setForm({...form, subject: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje detallado</label>
              <textarea 
                className="form-input" 
                rows={6} 
                placeholder="Describe tu idea o el problema que has encontrado con el mayor detalle posible..." 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})} 
                required 
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-4 text-lg" style={{ justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar mensaje al administrador'}
            </button>
          </form>
        </div>
      )}

      <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">¿Por qué es importante?</h3>
        <p className="text-sm text-muted leading-relaxed">
          Calc3D es un proyecto en constante evolución. Tu feedback directo llega a nuestro Panel de Administración, donde revisamos cada propuesta para implementar las mejoras que la comunidad de impresión 3D necesita.
        </p>
      </div>
    </div>
  )
}
