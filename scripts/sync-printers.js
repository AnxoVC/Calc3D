/**
 * MyCalc3D - Script de sincronización automática de impresoras 3D
 * 
 * Este script se ejecuta diariamente vía GitHub Actions a las 4:00 AM.
 * Scrapea las páginas de productos de los principales fabricantes de
 * impresoras 3D, detecta modelos nuevos que no estén en la base de datos
 * y los añade automáticamente como "no verificados".
 * 
 * Fabricantes soportados:
 *   - Bambu Lab (store API)
 *   - Prusa (página de productos)
 *   - Creality (página de productos)
 *   - Elegoo (página de productos)
 *   - Anycubic (página de productos)
 *   - Flashforge (página de productos)
 *   - Qidi (página de productos)
 *   - Artillery (página de productos)
 */

const { createClient } = require('@supabase/supabase-js')

// ─────────────────────────────────────────────
// Configuración
// ─────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// User-Agent para evitar bloqueos
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
}

// ─────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────

/** Pausa entre requests para no saturar servidores */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Fetch con timeout y reintentos */
async function safeFetch(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(url, { headers: HEADERS, signal: controller.signal })
      clearTimeout(timeout)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
      } catch (err) {
      if (i === retries) {
        console.warn(`   ⚠️  No se pudo acceder a ${url}: ${err.message}`)
        return null
      }
      await sleep(2000)
    }
  }
  return null
}

/** Extraer texto entre dos strings */
function extractBetween(html, start, end) {
  const i = html.indexOf(start)
  if (i === -1) return ''
  const j = html.indexOf(end, i + start.length)
  if (j === -1) return ''
  return html.substring(i + start.length, j)
}

/** Extraer valor numérico (watts) de un texto */
function extractWattage(text) {
  // Buscar patrones como "350W", "350 W", "350 Watts", "Max Power: 350"
  const patterns = [
    /(\d{2,4})\s*[Ww](?:atts?)?/,
    /[Pp]ower[:\s]+(\d{2,4})/,
    /[Cc]onsum[oe][:\s]+(\d{2,4})/,
    /[Rr]ated\s+[Pp]ower[:\s]+(\d{2,4})/,
    /[Mm]ax(?:imum)?\s+[Pp]ower[:\s]+(\d{2,4})/,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) {
      const w = parseInt(m[1])
      if (w >= 30 && w <= 5000) return w
    }
  }
  return null
}

/** Extraer volumen de construcción de un texto */
function extractBuildVolume(text) {
  // Patrones como "256×256×256mm", "256x256x256 mm", "256 x 256 x 256"
  const m = text.match(/(\d{2,4})\s*[×xX]\s*(\d{2,4})\s*[×xX]\s*(\d{2,4})\s*(?:mm)?/i)
  if (m) return `${m[1]}×${m[2]}×${m[3]}mm`
  return null
}

/** Detectar tipo de impresora */
function detectType(text) {
  const lower = text.toLowerCase()
  if (lower.includes('msla') || lower.includes('lcd resin') || lower.includes('resin printer')) return 'MSLA'
  if (lower.includes('sla') || lower.includes('stereolithography')) return 'SLA'
  if (lower.includes('sls') || lower.includes('laser sintering')) return 'SLS'
  if (lower.includes('dlp')) return 'DLP'
  return 'FDM'
}

// ─────────────────────────────────────────────
// Scrapers por fabricante
// ─────────────────────────────────────────────

/**
 * Cada scraper devuelve un array de objetos:
 * { brand, model, wattage_w, build_volume, type }
 */

// --- BAMBU LAB ---
async function scrapeBambuLab() {
  console.log('🔍 Scraping Bambu Lab...')
  const printers = []
  
  // Página de productos de Bambu Lab
  const html = await safeFetch('https://bambulab.com/en/3d-printer')
  if (!html) return printers

  // Buscar modelos en los links de productos
  const modelPatterns = [
    { regex: /\/(?:en\/)?(?:product|3d-printer)\/([\w-]+)/gi, prefix: 'https://bambulab.com/en/product/' },
  ]

  const foundModels = new Set()
  for (const { regex } of modelPatterns) {
    let match
    while ((match = regex.exec(html)) !== null) {
      const slug = match[1].toLowerCase()
      // Filtrar slugs que parecen modelos de impresora
      if (slug.includes('filament') || slug.includes('accessory') || slug.includes('ams') || 
          slug.includes('parts') || slug.includes('plate') || slug.includes('nozzle')) continue
      foundModels.add(slug)
    }
  }

  for (const slug of foundModels) {
    await sleep(1500)
    const specHtml = await safeFetch(`https://bambulab.com/en/product/${slug}`)
    if (!specHtml) continue

    // Intentar extraer nombre del modelo
    const titleMatch = specHtml.match(/<h1[^>]*>(.*?)<\/h1>/i) || 
                        specHtml.match(/<title>(.*?)<\/title>/i)
    if (!titleMatch) continue

    let modelName = titleMatch[1].replace(/<[^>]*>/g, '').trim()
    modelName = modelName.replace(/Bambu\s*Lab\s*/i, '').replace(/\s*[-|].*$/, '').trim()
    if (!modelName || modelName.length < 2) continue

    const wattage = extractWattage(specHtml)
    const buildVolume = extractBuildVolume(specHtml)
    const type = detectType(specHtml)

    printers.push({
      brand: 'Bambu Lab',
      model: modelName,
      wattage_w: wattage,
      build_volume: buildVolume,
      type,
    })
  }

  return printers
}

// --- PRUSA ---
async function scrapePrusa() {
  console.log('🔍 Scraping Prusa...')
  const printers = []

  const html = await safeFetch('https://www.prusa3d.com/category/3d-printers/')
  if (!html) return printers

  // Buscar links a productos
  const productLinks = new Set()
  const linkRegex = /href="(https:\/\/www\.prusa3d\.com\/product\/[^"]+)"/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    productLinks.add(match[1])
  }

  for (const url of productLinks) {
    await sleep(1500)
    const specHtml = await safeFetch(url)
    if (!specHtml) continue

    const titleMatch = specHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)
    if (!titleMatch) continue

    let modelName = titleMatch[1].replace(/<[^>]*>/g, '').trim()
    modelName = modelName.replace(/Original\s+Prusa\s*/i, '').replace(/\s*3D\s*[Pp]rinter.*$/, '').trim()
    if (!modelName || modelName.length < 2) continue

    const wattage = extractWattage(specHtml)
    const buildVolume = extractBuildVolume(specHtml)
    const type = detectType(specHtml)

    printers.push({
      brand: 'Prusa',
      model: modelName,
      wattage_w: wattage,
      build_volume: buildVolume,
      type,
    })
  }

  return printers
}

// --- CREALITY ---
async function scrapeCreality() {
  console.log('🔍 Scraping Creality...')
  const printers = []

  // Creality tiene múltiples categorías
  const urls = [
    'https://www.creality.com/pages/fdm-3d-printer',
    'https://www.creality.com/pages/resin-3d-printer',
  ]

  for (const pageUrl of urls) {
    const html = await safeFetch(pageUrl)
    if (!html) continue

    const productLinks = new Set()
    const linkRegex = /href="(\/products\/[^"]+)"/gi
    let match
    while ((match = linkRegex.exec(html)) !== null) {
      if (match[1].includes('filament') || match[1].includes('accessory')) continue
      productLinks.add('https://www.creality.com' + match[1])
    }

    for (const url of productLinks) {
      await sleep(1500)
      const specHtml = await safeFetch(url)
      if (!specHtml) continue

      const titleMatch = specHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)
      if (!titleMatch) continue

      let modelName = titleMatch[1].replace(/<[^>]*>/g, '').trim()
      modelName = modelName.replace(/Creality\s*/i, '').replace(/\s*3D\s*[Pp]rinter.*$/, '').trim()
      if (!modelName || modelName.length < 2) continue

      const wattage = extractWattage(specHtml)
      const buildVolume = extractBuildVolume(specHtml)
      const type = detectType(specHtml)

      printers.push({
        brand: 'Creality',
        model: modelName,
        wattage_w: wattage,
        build_volume: buildVolume,
        type,
      })
    }
  }

  return printers
}

// --- ELEGOO ---
async function scrapeElegoo() {
  console.log('🔍 Scraping Elegoo...')
  const printers = []

  const urls = [
    'https://www.elegoo.com/collections/fdm-3d-printer',
    'https://www.elegoo.com/collections/resin-3d-printer',
  ]

  for (const pageUrl of urls) {
    const html = await safeFetch(pageUrl)
    if (!html) continue

    const productLinks = new Set()
    const linkRegex = /href="(\/products\/[^"]+)"/gi
    let match
    while ((match = linkRegex.exec(html)) !== null) {
      if (match[1].includes('filament') || match[1].includes('resin-') || match[1].includes('accessory')) continue
      productLinks.add('https://www.elegoo.com' + match[1])
    }

    for (const url of productLinks) {
      await sleep(1500)
      const specHtml = await safeFetch(url)
      if (!specHtml) continue

      const titleMatch = specHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)
      if (!titleMatch) continue

      let modelName = titleMatch[1].replace(/<[^>]*>/g, '').trim()
      modelName = modelName.replace(/ELEGOO\s*/i, '').replace(/\s*3D\s*[Pp]rinter.*$/, '').trim()
      if (!modelName || modelName.length < 2) continue

      const wattage = extractWattage(specHtml)
      const buildVolume = extractBuildVolume(specHtml)
      const type = detectType(specHtml)

      printers.push({
        brand: 'Elegoo',
        model: modelName,
        wattage_w: wattage,
        build_volume: buildVolume,
        type,
      })
    }
  }

  return printers
}

// --- ANYCUBIC ---
async function scrapeAnycubic() {
  console.log('🔍 Scraping Anycubic...')
  const printers = []

  const urls = [
    'https://www.anycubic.com/collections/fdm-3d-printers',
    'https://www.anycubic.com/collections/sla-lcd-3d-printers',
  ]

  for (const pageUrl of urls) {
    const html = await safeFetch(pageUrl)
    if (!html) continue

    const productLinks = new Set()
    const linkRegex = /href="(\/products\/[^"]+)"/gi
    let match
    while ((match = linkRegex.exec(html)) !== null) {
      if (match[1].includes('filament') || match[1].includes('resin') || match[1].includes('accessory')) continue
      productLinks.add('https://www.anycubic.com' + match[1])
    }

    for (const url of productLinks) {
      await sleep(1500)
      const specHtml = await safeFetch(url)
      if (!specHtml) continue

      const titleMatch = specHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)
      if (!titleMatch) continue

      let modelName = titleMatch[1].replace(/<[^>]*>/g, '').trim()
      modelName = modelName.replace(/Anycubic\s*/i, '').replace(/\s*3D\s*[Pp]rinter.*$/, '').trim()
      if (!modelName || modelName.length < 2) continue

      const wattage = extractWattage(specHtml)
      const buildVolume = extractBuildVolume(specHtml)
      const type = detectType(specHtml)

      printers.push({
        brand: 'Anycubic',
        model: modelName,
        wattage_w: wattage,
        build_volume: buildVolume,
        type,
      })
    }
  }

  return printers
}

// --- FLASHFORGE ---
async function scrapeFlashforge() {
  console.log('🔍 Scraping Flashforge...')
  const printers = []

  const html = await safeFetch('https://www.flashforge.com/3d-printers')
  if (!html) return printers

  const productLinks = new Set()
  const linkRegex = /href="([^"]*(?:product|printer)[^"]+)"/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    let url = match[1]
    if (url.includes('filament') || url.includes('accessory') || url.includes('resin')) continue
    if (!url.startsWith('http')) url = 'https://www.flashforge.com' + url
    productLinks.add(url)
  }

  for (const url of productLinks) {
    await sleep(1500)
    const specHtml = await safeFetch(url)
    if (!specHtml) continue

    const titleMatch = specHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)
    if (!titleMatch) continue

    let modelName = titleMatch[1].replace(/<[^>]*>/g, '').trim()
    modelName = modelName.replace(/FlashForge\s*/i, '').replace(/\s*3D\s*[Pp]rinter.*$/, '').trim()
    if (!modelName || modelName.length < 2) continue

    const wattage = extractWattage(specHtml)
    const buildVolume = extractBuildVolume(specHtml)
    const type = detectType(specHtml)

    printers.push({
      brand: 'Flashforge',
      model: modelName,
      wattage_w: wattage,
      build_volume: buildVolume,
      type,
    })
  }

  return printers
}

// --- QIDI ---
async function scrapeQidi() {
  console.log('🔍 Scraping Qidi...')
  const printers = []

  const html = await safeFetch('https://qidi3d.com/collections/3d-printers')
  if (!html) return printers

  const productLinks = new Set()
  const linkRegex = /href="(\/products\/[^"]+)"/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    if (match[1].includes('filament') || match[1].includes('accessory')) continue
    productLinks.add('https://qidi3d.com' + match[1])
  }

  for (const url of productLinks) {
    await sleep(1500)
    const specHtml = await safeFetch(url)
    if (!specHtml) continue

    const titleMatch = specHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)
    if (!titleMatch) continue

    let modelName = titleMatch[1].replace(/<[^>]*>/g, '').trim()
    modelName = modelName.replace(/QIDI\s*/i, '').replace(/\s*3D\s*[Pp]rinter.*$/, '').trim()
    if (!modelName || modelName.length < 2) continue

    const wattage = extractWattage(specHtml)
    const buildVolume = extractBuildVolume(specHtml)
    const type = detectType(specHtml)

    printers.push({
      brand: 'Qidi',
      model: modelName,
      wattage_w: wattage,
      build_volume: buildVolume,
      type,
    })
  }

  return printers
}

// --- ARTILLERY ---
async function scrapeArtillery() {
  console.log('🔍 Scraping Artillery...')
  const printers = []

  const html = await safeFetch('https://www.artillery3d.com/products')
  if (!html) return printers

  const productLinks = new Set()
  const linkRegex = /href="([^"]*(?:sidewinder|genius|hornet|swx|sw)[^"]+)"/gi
  let match
  while ((match = linkRegex.exec(html)) !== null) {
    let url = match[1]
    if (!url.startsWith('http')) url = 'https://www.artillery3d.com' + url
    productLinks.add(url)
  }

  for (const url of productLinks) {
    await sleep(1500)
    const specHtml = await safeFetch(url)
    if (!specHtml) continue

    const titleMatch = specHtml.match(/<h1[^>]*>(.*?)<\/h1>/i)
    if (!titleMatch) continue

    let modelName = titleMatch[1].replace(/<[^>]*>/g, '').trim()
    modelName = modelName.replace(/Artillery\s*/i, '').replace(/\s*3D\s*[Pp]rinter.*$/, '').trim()
    if (!modelName || modelName.length < 2) continue

    const wattage = extractWattage(specHtml)
    const buildVolume = extractBuildVolume(specHtml)
    const type = detectType(specHtml)

    printers.push({
      brand: 'Artillery',
      model: modelName,
      wattage_w: wattage,
      build_volume: buildVolume,
      type,
    })
  }

  return printers
}

// ─────────────────────────────────────────────
// Lógica principal
// ─────────────────────────────────────────────

async function getExistingPrinters() {
  const { data, error } = await supabase
    .from('printers')
    .select('brand, model')

  if (error) {
    console.error('❌ Error cargando impresoras existentes:', error.message)
    return []
  }
  return data || []
}

function normalizeName(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isNewPrinter(printer, existing) {
  const normBrand = normalizeName(printer.brand)
  const normModel = normalizeName(printer.model)
  
  return !existing.some(e => {
    const eBrand = normalizeName(e.brand)
    const eModel = normalizeName(e.model)
    return eBrand === normBrand && eModel === normModel
  })
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('🖨️  MyCalc3D - Sincronización de Impresoras')
  console.log(`📅 ${new Date().toISOString()}`)
  console.log('═══════════════════════════════════════════')
  console.log()

  // 1. Cargar impresoras existentes
  const existing = await getExistingPrinters()
  console.log(`📦 Impresoras existentes en la BD: ${existing.length}`)
  console.log()

  // 2. Ejecutar scrapers
  const scrapers = [
    scrapeBambuLab,
    scrapePrusa,
    scrapeCreality,
    scrapeElegoo,
    scrapeAnycubic,
    scrapeFlashforge,
    scrapeQidi,
    scrapeArtillery,
  ]

  let allFound = []
  for (const scraper of scrapers) {
    try {
      const found = await scraper()
      console.log(`   ✅ Encontradas: ${found.length} impresoras`)
      allFound = allFound.concat(found)
    } catch (err) {
      console.error(`   ❌ Error en scraper: ${err.message}`)
    }
    await sleep(2000) // Pausa entre fabricantes
  }

  console.log()
  console.log(`🔎 Total impresoras encontradas en webs: ${allFound.length}`)

  // 3. Filtrar solo las nuevas
  const newPrinters = allFound.filter(p => isNewPrinter(p, existing))
  console.log(`🆕 Impresoras nuevas (no en la BD): ${newPrinters.length}`)
  console.log()

  if (newPrinters.length === 0) {
    console.log('✅ No hay impresoras nuevas para añadir. ¡Todo actualizado!')
    return
  }

  // 4. Insertar nuevas impresoras
  let inserted = 0
  let errors = 0

  for (const printer of newPrinters) {
    console.log(`   📥 Insertando: ${printer.brand} ${printer.model} (${printer.wattage_w || '?'}W, ${printer.type})`)
    
    const { error } = await supabase.from('printers').insert({
      brand: printer.brand,
      model: printer.model,
      wattage_w: printer.wattage_w || 250, // Valor por defecto si no se encontró
      build_volume: printer.build_volume || null,
      type: printer.type || 'FDM',
      verified: false, // Siempre como no verificada hasta revisión admin
    })

    if (error) {
      console.error(`   ❌ Error insertando ${printer.brand} ${printer.model}: ${error.message}`)
      errors++
    } else {
      inserted++
    }

    await sleep(500)
  }

  // 5. Resumen
  console.log()
  console.log('═══════════════════════════════════════════')
  console.log('📊 RESUMEN')
  console.log(`   ✅ Insertadas: ${inserted}`)
  console.log(`   ❌ Errores: ${errors}`)
  console.log(`   ⏭️  Ya existían: ${allFound.length - newPrinters.length}`)
  console.log('═══════════════════════════════════════════')

  // Salir con código de error si hubo fallos
  if (errors > 0 && inserted === 0) {
    process.exit(1)
  }
}

// Ejecutar
main().catch(err => {
  console.error('❌ Error fatal:', err)
  process.exit(1)
})
