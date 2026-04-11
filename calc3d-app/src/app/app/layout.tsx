'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ThemeToggle from '@/components/ThemeToggle'


const NAV_ITEMS = [
  { href: '/app', label: 'Diario' },
  { href: '/app/calculadora', label: 'Calculadora' },
  { href: '/app/presupuesto', label: 'Presupuesto' },
  { href: '/app/bobinas', label: 'Bobinas' },
  { href: '/app/impresoras', label: 'Impresoras' },
  { href: '/app/estadisticas', label: 'Estadísticas' },
  { href: '/app/consumibles', label: 'Consumibles' },
  { href: '/app/ajustes', label: 'Ajustes' },
  { href: '/app/feedback', label: 'Sugerencias' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || null))
  }, [])

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isAdmin = userEmail === 'vigoanxo000@gmail.com'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const renderNavItems = () => (
    <>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
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
            Panel Admin
          </Link>
        )}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-bottom flex flex-col gap-1">
        <div className="sidebar-nav-item" style={{ width: '100%', cursor: 'default', paddingLeft: '0.5rem' }}>
          <ThemeToggle />
        </div>
        <button onClick={handleLogout} className="sidebar-nav-item" style={{ width: '100%', textAlign: 'left' }}>
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <div className="page-layout">
      {/* MOBILE HEADER */}
      <header className="mobile-header">
        <button className="hamburger-btn" onClick={() => setIsMenuOpen(true)}>
          <div className="hamburger-line" />
          <div className="hamburger-line" />
          <div className="hamburger-line" />
        </button>
        <div className="flex items-center gap-2 ml-4">
          <div className="logo-icon" style={{ width: '28px', height: '28px', borderRadius: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
              <line x1="12" y1="22" x2="12" y2="15.5"/>
              <polyline points="22 8.5 12 15.5 2 8.5"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>Calc<span className="text-gradient">3D</span></span>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMenuOpen && <div className="nav-drawer-overlay" onClick={() => setIsMenuOpen(false)} />}
      <aside className={`nav-drawer ${isMenuOpen ? 'open' : ''}`}>
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
        {renderNavItems()}
      </aside>

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
        {renderNavItems()}
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
