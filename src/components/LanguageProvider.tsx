'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

export type Language = 'en' | 'es'

type TranslationKeys = keyof typeof en

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKeys) => string
  mounted: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const LANGUAGE_KEY = 'language:v1'

const translations: Record<Language, typeof en> = {
  en,
  es,
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(LANGUAGE_KEY) as Language | null
  if (stored && (stored === 'en' || stored === 'es')) return stored
  // Optionally detect browser language
  const browserLang = navigator.language.split('-')[0]
  if (browserLang === 'es') return 'es'
  return 'en'
}

function subscribe() {
  return () => {}
}

function getServerSnapshot(): boolean {
  return false
}

function getClientSnapshot(): boolean {
  return true
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const [language, setLanguageState] = useState<Language>(() => (mounted ? getInitialLanguage() : 'en'))

  useEffect(() => {
    if (mounted) {
      const initial = getInitialLanguage()
      if (initial !== language) {
        setLanguageState(initial)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(LANGUAGE_KEY, language)
    document.documentElement.setAttribute('lang', language)
  }, [language, mounted])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const t = useCallback(
    (key: TranslationKeys): string => {
      return translations[language][key] || key
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      mounted: false,
    }
  }
  return context
}
