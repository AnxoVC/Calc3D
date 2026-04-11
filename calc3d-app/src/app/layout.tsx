import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calc3D — Calculadora de Costes para Impresión 3D',
  description: 'Calcula el coste exacto de tus impresiones 3D. Gratis, sin límites, con base de datos de impresoras y filamentos. Gestiona tu inventario y estadísticas.',
  keywords: ['calculadora impresión 3d', 'coste impresión 3d', 'filamento precio', 'calc3d'],
  openGraph: {
    title: 'Calc3D — Calculadora de Costes 3D',
    description: 'La herramienta gratuita para calcular y gestionar tus costes de impresión 3D.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
