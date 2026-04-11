'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ThemeToggle from '@/components/ThemeToggle'

const NAV_ITEMS = [
  { href: '/app', label: 'Diario', icon: '📋' },
  { href: '/app/calculadora', label: 'Calculadora', icon: '🧮' },
  { href: '/app/presupuesto', label: 'Presupuesto', icon: '💰' },
  { href: '/app/bobinas', label: 'Bobinas', icon: '🧵' },
  { href: '/app/impresoras', label: 'Impresoras', icon: '🖨️' },
  { href: '/app/estadisticas', label: 'Estadísticas', icon: '📊' },
  { href: '/app/consumibles', label: 'Consumibles', icon: '📦' },
  { href: '/app/ajustes', label: 'Ajustes', icon: '⚙️' },
  { href: '/app/feedback', label: 'Sugerencias', icon: '💡' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || null))
  }, [])

  const isAdmin = userEmail === 'vigoanxo000@gmail.com'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="page-layout">
      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
              <line x1="12" y1="22" x2="12" y2="15.5"/>
              <polyline points="22 8.5 12 15.5 2 8.5"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>Calc<span className="text-gradient">3D</span></span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/app/admin"
              className={`sidebar-nav-item ${pathname.startsWith('/app/admin') ? 'active' : ''}`}
              style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}
            >
              <span style={{ fontSize: '1.1rem' }}>🛡️</span>
              Panel Admin
            </Link>
          )}
        </nav>

        <div className="sidebar-divider" />

        <div className="sidebar-bottom flex flex-col gap-1">
          <div className="sidebar-nav-item" style={{ width: '100%', justifyContent: 'space-between', cursor: 'default' }}>
            <span className="flex items-center gap-2">🎨 Tema</span>
            <ThemeToggle />
          </div>
          <button onClick={handleLogout} className="sidebar-nav-item" style={{ width: '100%', textAlign: 'left' }}>
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {children}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {NAV_ITEMS.slice(0, 6).map((item) => {
            const isActive = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
