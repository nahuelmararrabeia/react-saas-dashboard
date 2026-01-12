import React from 'react'
import { LogOut, Moon, Sun, Laptop, Search } from 'lucide-react'
import { useTheme } from '@/state/theme'
import { useAuth } from '@/state/auth'
import { cn } from '@/lib/cn'

export function Topbar({
  title,
  right
}: {
  title: string
  right?: React.ReactNode
}) {
  const { theme, setTheme, resolved } = useTheme()
  const { user, logout } = useAuth()

  return (
    <div className="card flex items-center justify-between gap-3 p-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {user?.name} • <span className="badge">{user?.role}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {right}

        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 md:flex">
          <Search className="h-4 w-4" />
          <span>Quick search</span>
          <span className="kbd">Ctrl</span>
          <span className="kbd">K</span>
        </div>

        <div className="relative">
          <select
            className={cn(
              'input w-[140px] cursor-pointer appearance-none pr-9',
              'bg-[length:0px] focus:ring-0'
            )}
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            aria-label="Theme"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {theme === 'system' ? <Laptop className="h-4 w-4" /> : resolved === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </div>
        </div>

        <button className="btn-ghost p-2" onClick={logout} aria-label="Logout" title="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
