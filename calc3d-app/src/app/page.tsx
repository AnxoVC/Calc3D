import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import ForumFeed from '@/components/ForumFeed'

export default function LandingPage() {
  return (
    <>
      {/* NAV */}
      <nav className="landing-nav">
        <div className="flex items-center gap-3">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>MyCalc<span className="text-gradient">3D</span></span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn btn-ghost btn-sm hidden-mobile">Iniciar sesión</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Empezar gratis</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
        </div>
        <div className="hero-content animate-fade-in">
          <span className="hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            100% Gratuita · Sin límites · Sin suscripción
          </span>
          <h1 className="hero-title">
            La calculadora de costes<br />
            para <span className="text-gradient">impresión 3D</span><br />
            que siempre quisiste
          </h1>
          <p className="hero-desc">
            Calcula el coste exacto de cada impresión, gestiona tus bobinas e impresoras,
            y analiza tus estadísticas. Todo en un solo lugar, completamente gratis.
          </p>
          <div className="hero-cta">
            <Link href="/register" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Empezar gratis ahora
            </Link>

          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { value: '30+', label: 'Impresoras en BD' },
              { value: '40+', label: 'Filamentos en BD' },
              { value: '€0', label: 'Coste mensual' },
              { value: '∞', label: 'Cálculos guardados' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand)' }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>Funcionalidades</span>
            <h2>Todo lo que necesitas,<br /><span className="text-gradient">todo gratis</span></h2>
          </div>
          <div className="features-grid">
            {[
              { icon: '🧮', color: 'rgba(249,115,22,0.15)', title: 'Calculadora de costes', desc: 'Material, electricidad, amortización y mano de obra. Desglose completo al instante.' },
              { icon: '💰', color: 'rgba(34,197,94,0.15)', title: 'Presupuesto rápido', desc: 'Añade mano de obra y margen de beneficio. Obtén el precio de venta perfecto.' },
              { icon: '🗂️', color: 'rgba(59,130,246,0.15)', title: 'Inventario de bobinas', desc: 'Visualiza cuánto filamento te queda en cada bobina con barra de progreso.' },
              { icon: '🖨️', color: 'rgba(168,85,247,0.15)', title: 'Base de datos pública', desc: 'Más de 30 impresoras y 40 filamentos preconfigurados. Solo selecciona y listo.' },
              { icon: '📊', color: 'rgba(6,182,212,0.15)', title: 'Estadísticas completas', desc: 'Gráficos de gastos, tiempo de impresión y materiales usados por mes.' },
              { icon: '📱', color: 'rgba(249,115,22,0.15)', title: 'Diseño mobile-first', desc: 'Funciona perfecto en el móvil. Úsala desde el taller sin complicaciones.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="steps-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>Cómo funciona</span>
            <h2>Tres pasos para <span className="text-gradient">empezar</span></h2>
          </div>
          <div className="steps-grid">
            {[
              { n: '1', title: 'Crea tu cuenta', desc: 'Regístrate gratis con tu email.' },
              { n: '2', title: 'Selecciona tu equipo', desc: 'Elige tu impresora y filamento de nuestra base de datos. Los datos se autocompletan.' },
              { n: '3', title: 'Calcula y guarda', desc: 'Introduce el peso y el tiempo y obtén el coste exacto. Guárdalo en tu historial.' },
            ].map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-number">{s.n}</div>
                <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY FORUM */}
      <section className="forum-section" style={{ padding: '6rem 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>Comunidad</span>
            <h2>Muro de Sugerencias<br /><span className="text-gradient">y Actualizaciones</span></h2>
            <p className="text-muted mt-4">Lo que la comunidad propone y lo que estamos construyendo.</p>
          </div>
          <ForumFeed />
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="hero-bg">
          <div className="hero-glow-1" style={{ opacity: 0.1 }} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>Empieza hoy</span>
          <h2 style={{ marginBottom: '1rem' }}>Deja de adivinar,<br /><span className="text-gradient">empieza a calcular</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            Únete a la comunidad de makers que calculan sus costes con Calc3D.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">
            Crear cuenta gratis →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Calc3D · Hecho con ❤️ para la comunidad maker</p>
      </footer>
    </>
  )
}
