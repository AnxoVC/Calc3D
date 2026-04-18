'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { translations, type Language } from '@/locales'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (keyPath: string) => any
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('mycalc3d-lang') as Language
    if (saved && (saved === 'es' || saved === 'en' || saved === 'gl' || saved === 'pt')) {
      setLanguageState(saved)
    } else {
      const browserLang = navigator.language.split('-')[0]
      if (['es', 'en', 'gl', 'pt'].includes(browserLang)) {
        setLanguageState(browserLang as Language)
      }
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('mycalc3d-lang', lang)
    document.documentElement.lang = lang
  }

  const t = (keyPath: string) => {
    const keys = keyPath.split('.')
    let current: any = translations[language]
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key]
      } else {
        // Fallback to Spanish if key missing
        let fallback: any = translations['es']
        for (const fkey of keys) {
           fallback = fallback ? fallback[fkey] : undefined
        }
        return fallback || keyPath
      }
    }
    return current
  }

  // Prevent hydration mismatch by only rendering once mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return context
}
