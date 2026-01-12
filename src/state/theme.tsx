import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '@/lib/storage'

type Theme = 'light' | 'dark' | 'system'
type ThemeContextValue = {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (t: Theme) => void
  toggle: () => void
}

const KEY = 'rsd.theme.v1'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystem(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => storage.get(KEY, 'system' as Theme))
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => (theme === 'system' ? getSystem() : theme))

  useEffect(() => {
    const next = theme === 'system' ? getSystem() : theme
    setResolved(next)
    storage.set(KEY, theme)

    const root = document.documentElement
    if (next === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') setResolved(getSystem())
      if (theme === 'system') {
        const next = getSystem()
        const root = document.documentElement
        if (next === 'dark') root.classList.add('dark')
        else root.classList.remove('dark')
      }
    }
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    resolved,
    setTheme,
    toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }), [theme, resolved])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
