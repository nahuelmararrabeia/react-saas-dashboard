import React from 'react'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
        <span className="text-sm font-black">R</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-sm font-semibold">ReactSaaS</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Dashboard</div>
        </div>
      )}
    </div>
  )
}
