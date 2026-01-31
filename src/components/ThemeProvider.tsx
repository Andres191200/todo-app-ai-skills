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

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_KEY = 'theme:v1'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  if (stored) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const [theme, setTheme] = useState<Theme>(() => (mounted ? getInitialTheme() : 'light'))

  useEffect(() => {
    if (mounted) {
      const initial = getInitialTheme()
      if (initial !== theme) {
        setTheme(initial)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme, mounted])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    return { theme: 'light' as Theme, toggleTheme: () => {}, mounted: false }
  }
  return context
}
