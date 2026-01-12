import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/state/auth'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth()
  const loc = useLocation()

  if (!isReady) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[520px] items-center justify-center p-4">
        <div className="card w-full p-6">
          <div className="h-5 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-6 h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <>{children}</>
}
