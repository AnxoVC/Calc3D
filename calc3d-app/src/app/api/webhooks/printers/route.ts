import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    // 1. Validate authorization
    // We expect a Bearer token matching our WEBHOOK_SECRET
    const authHeader = req.headers.get('authorization')
    const expectedSecret = process.env.WEBHOOK_SECRET

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Parse the incoming JSON body
    const body = await req.json()
    const { brand, model, wattage_w, build_volume, type } = body

    if (!brand || !model) {
      return NextResponse.json({ error: 'Se requieren "brand" y "model"' }, { status: 400 })
    }

    // 3. Connect to Supabase using the SERVICE_ROLE_KEY to bypass RLS
    // The service role key is required because normal users cannot insert into public printers
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
      console.error('Falta SUPABASE_SERVICE_ROLE_KEY')
      return NextResponse.json({ error: 'Configuración de base de datos incompleta' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 4. Insert the new printer into the database
    // "verified: false" ensures it acts as a draft until the admin manually verifies it in Supabase
    const { data, error } = await supabase.from('printers').insert({
      brand,
      model,
      wattage_w: wattage_w ? Number(wattage_w) : null,
      build_volume: build_volume || null,
      type: type || 'FDM',
      verified: false 
    }).select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 5. Success response
    return NextResponse.json({ success: true, inserted: data }, { status: 201 })
  } catch (err: any) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 })
  }
}
