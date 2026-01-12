import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastType = 'success' | 'error' | 'info'
type Toast = { id: string; type: ToastType; title: string; description?: string }

type ToastCtx = {
  push: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(16).slice(2)
    const toast: Toast = { ...t, id }
    setToasts((prev) => [toast, ...prev].slice(0, 4))
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3500)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'card p-3 shadow-soft',
              t.type === 'success' && 'border-emerald-200 dark:border-emerald-900/60',
              t.type === 'error' && 'border-rose-200 dark:border-rose-900/60'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{t.title}</div>
                {t.description && <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{t.description}</div>}
              </div>
              <button className="btn-ghost -m-2 p-2" onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
