import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '@/api/client'
import type { AuthUser } from '@/api/types'
import { storage } from '@/lib/storage'

type AuthState = {
  user: AuthUser | null
  token: string | null
  isReady: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const KEY = 'rsd.auth.v1'
const AuthContext = createContext<AuthState | null>(null)

type Persisted = { token: string; user: AuthUser }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const saved = storage.get<Persisted | null>(KEY, null)
    if (saved?.token && saved?.user) {
      setToken(saved.token)
      setUser(saved.user)
    }
    setIsReady(true)
  }, [])

  const value = useMemo<AuthState>(() => ({
    user,
    token,
    isReady,
    login: async (email, password) => {
      const res = await api.login(email, password)
      setToken(res.token)
      setUser(res.user)
      storage.set(KEY, res)
    },
    logout: () => {
      setToken(null)
      setUser(null)
      storage.remove(KEY)
    }
  }), [user, token, isReady])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
