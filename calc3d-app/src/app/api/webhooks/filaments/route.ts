import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    const expectedSecret = process.env.WEBHOOK_SECRET

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { brand, material, color_name, color_hex, price_per_kg, diameter_mm, density_g_cm3 } = body

    if (!brand || !material) {
      return NextResponse.json({ error: 'Se requieren "brand" y "material"' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
      console.error('Falta SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json({ error: 'Configuración de base de datos incompleta' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insertar el nuevo filamento en la base de datos (con verified en false para revisión humana)
    const { data, error } = await supabase.from('filaments').insert({
      brand,
      material,
      color_name: color_name || 'Desconocido',
      color_hex: color_hex || '#FFFFFF',
      price_per_kg: price_per_kg ? Number(price_per_kg) : null,
      diameter_mm: diameter_mm ? Number(diameter_mm) : 1.75,
      density_g_cm3: density_g_cm3 ? Number(density_g_cm3) : null,
      verified: false 
    }).select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, inserted: data }, { status: 201 })
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 })
  }
}
