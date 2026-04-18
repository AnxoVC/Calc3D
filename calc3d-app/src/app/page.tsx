'use client'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import ForumFeed from '@/components/ForumFeed'
import LanguageSelector from '@/components/LanguageSelector'
import { useTranslation } from '@/contexts/I18nContext'

export default function LandingPage() {
  const { t, language } = useTranslation()

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
          <LanguageSelector />
          <Link href="/login" className="btn btn-ghost btn-sm hidden-mobile">{t('nav.login')}</Link>
          <Link href="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
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
            {t('landing.badge')}
          </span>
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t('landing.title') }} />
          <p className="hero-desc">
            {t('landing.desc')}
          </p>
          <div className="hero-cta">
            <Link href="/register" className="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              {t('landing.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.5rem 2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { value: '30+', label: t('landing.stats.printers') },
              { value: '40+', label: t('landing.stats.filaments') },
              { value: '€0', label: t('landing.stats.monthly_cost') },
              { value: '∞', label: t('landing.stats.saved_calcs') },
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
            <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>{t('landing.features.subtitle')}</span>
            <h2 dangerouslySetInnerHTML={{ __html: t('landing.features.title') }} />
          </div>
          <div className="features-grid">
            {[
              { icon: '🧮', color: 'rgba(249,115,22,0.15)', title: t('landing.features.calc.title'), desc: t('landing.features.calc.desc') },
              { icon: '💰', color: 'rgba(34,197,94,0.15)', title: t('landing.features.budget.title'), desc: t('landing.features.budget.desc') },
              { icon: '🗂️', color: 'rgba(59,130,246,0.15)', title: t('landing.features.inventory.title'), desc: t('landing.features.inventory.desc') },
              { icon: '🖨️', color: 'rgba(168,85,247,0.15)', title: t('landing.features.public_db.title'), desc: t('landing.features.public_db.desc') },
              { icon: '📊', color: 'rgba(6,182,212,0.15)', title: t('landing.features.stats.title'), desc: t('landing.features.stats.desc') },
              { icon: '📱', color: 'rgba(249,115,22,0.15)', title: t('landing.features.mobile.title'), desc: t('landing.features.mobile.desc') },
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
            <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>{t('landing.how_it_works.subtitle')}</span>
            <h2 dangerouslySetInnerHTML={{ __html: t('landing.how_it_works.start') }} />
          </div>
          <div className="steps-grid">
            {[
              { n: '1', title: t('landing.how_it_works.step1.title'), desc: t('landing.how_it_works.step1.desc') },
              { n: '2', title: t('landing.how_it_works.step2.title'), desc: t('landing.how_it_works.step2.desc') },
              { n: '3', title: t('landing.how_it_works.step3.title'), desc: t('landing.how_it_works.step3.desc') },
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
            <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>{t('landing.community.subtitle')}</span>
            <h2 dangerouslySetInnerHTML={{ __html: t('landing.community.title') }} />
            <p className="text-muted mt-4">{t('landing.community.desc')}</p>
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
          <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>{t('landing.cta_final.subtitle')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('landing.cta_final.title') }} />
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            {t('landing.cta_final.desc')}
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">
            {t('landing.cta_final.btn')}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} {t('landing.footer')}</p>
      </footer>
    </>
  )
}
