import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/state/auth'
import { ApiError } from '@/api/client'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from ?? '/'

  const [email, setEmail] = useState('ava@acme.com')
  const [password, setPassword] = useState('demo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hint = useMemo(() => (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="font-medium text-slate-800 dark:text-slate-100">Demo credentials</div>
      <div className="mt-1">
        Use any email. If it ends with <span className="badge">@acme.com</span> you become <span className="badge">Admin</span>.
      </div>
      <div className="mt-2">Password: <span className="badge">demo</span> (min 4 chars)</div>
    </div>
  ), [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Login failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[520px] items-center justify-center p-4">
      <div className="card w-full p-6">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="badge">Premium Demo</span>
        </div>

        <h1 className="mt-6 text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Access your workspace dashboard.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input className="input mt-1" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••" />
          </div>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {hint}
      </div>
    </div>
  )
}
