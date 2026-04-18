'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/contexts/I18nContext'
import { type Language } from '@/locales'

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'gl', label: 'Galego', flag: '⬜🟦' }, // Galician flag representation
  { code: 'pt', label: 'Português', flag: '🇵🇹' }
]

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = LANGS.find(l => l.code === language) || LANGS[0]

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-sm"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.4rem 0.6rem',
          minWidth: '100px',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{currentLang.flag}</span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase' }}>{currentLang.code}</span>
        </div>
        <svg 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' , transition: 'transform 0.2s'}} 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 'calc(100% + 5px)', 
            right: 0, 
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '8px', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            padding: '4px',
            zIndex: 100,
            minWidth: '140px'
          }}
          className="animate-slide-up"
        >
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setIsOpen(false)
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                border: 'none',
                background: language === lang.code ? 'rgba(249,115,22,0.1)' : 'transparent',
                color: language === lang.code ? 'var(--brand)' : 'var(--text-primary)',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: language === lang.code ? 600 : 400,
                transition: 'all 0.2s'
              }}
              className="lang-item"
            >
              <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
