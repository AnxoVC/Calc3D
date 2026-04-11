'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AjustesPage() {
  const [form, setForm] = useState({ default_kwh_price: '0.15', default_spool_weight_g: '1000' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  
  // Password change states
  const [newPassword, setNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email || '')
      const { data } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single()
      if (data) setForm({ default_kwh_price: String(data.default_kwh_price), default_spool_weight_g: String(data.default_spool_weight_g) })
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setSaved(false)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { user_id: user.id, default_kwh_price: Number(form.default_kwh_price), default_spool_weight_g: Number(form.default_spool_weight_g), updated_at: new Date().toISOString() }
    const { error } = await supabase.from('user_settings').upsert(payload)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  async function handlePasswordChange() {
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setChangingPassword(true)
    setPasswordError('')
    setPasswordChanged(false)
    
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    
    setChangingPassword(false)
    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordChanged(true)
      setNewPassword('')
      setTimeout(() => setPasswordChanged(false), 3000)
    }
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>

  return (
    <div className="animate-fade-in" style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1 className="page-title">Ajustes</h1>
        <p className="page-subtitle">Configura tu perfil y valores por defecto</p>
      </div>

      <div className="card mb-6">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Perfil</h3>
        <div className="form-group mb-6">
          <label className="form-label">Email de la cuenta</label>
          <input className="form-input" value={userEmail} disabled style={{ opacity: 0.7 }} />
        </div>

        <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />
        
        <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Cambiar Contraseña</h4>
        <p className="text-sm text-muted mb-4">Actualiza tu contraseña de acceso a MyCalc3D.</p>
        
        {passwordError && <div className="alert alert-danger mb-4">{passwordError}</div>}
        {passwordChanged && <div className="alert alert-success mb-4">Contraseña actualizada correctamente</div>}

        <div className="form-group mb-4">
          <label className="form-label">Nueva Contraseña</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Mínimo 6 caracteres" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
          />
        </div>
        <button 
          className="btn btn-outline w-full" 
          style={{ justifyContent: 'center' }} 
          disabled={changingPassword || !newPassword}
          onClick={handlePasswordChange}
        >
          {changingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </div>

      <form className="card mb-10" onSubmit={handleSave}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Valores por defecto</h3>
        <p className="text-sm text-muted mb-6">Estos valores se usarán automáticamente en la calculadora si no seleccionas una impresora o filamento específico.</p>
        <div className="form-grid mb-6">
          <div className="form-group">
            <label className="form-label">Precio Electricidad (€/kWh)</label>
            <div className="input-wrapper">
              <span className="input-prefix">€</span>
              <input type="number" step="0.001" className="form-input" value={form.default_kwh_price} onChange={e => setForm({...form, default_kwh_price: e.target.value})} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Peso estándar bobinas (g)</label>
            <input type="number" className="form-input" value={form.default_spool_weight_g} onChange={e => setForm({...form, default_spool_weight_g: e.target.value})} required />
          </div>
        </div>
        <div className="flex justify-between items-center">
          {saved ? <span className="alert alert-success" style={{ padding: '0.5rem 1rem' }}>Ajustes guardados</span> : <span />}
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar ajustes'}</button>
        </div>
      </form>


      <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5 }}>
        <p className="text-xs">MyCalc3D by AnxoVC - Versión 1.0.0</p>
      </div>
    </div>
  )
}
