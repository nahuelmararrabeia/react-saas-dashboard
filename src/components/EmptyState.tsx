import React from 'react'
import { Search } from 'lucide-react'

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Try adjusting your filters or creating a new item.',
  action
}: {
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="card grid place-items-center p-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800">
        <Search className="h-5 w-5 text-slate-500" />
      </div>
      <div className="mt-4 text-sm font-semibold">{title}</div>
      <div className="mt-1 max-w-sm text-xs text-slate-600 dark:text-slate-300">{description}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
