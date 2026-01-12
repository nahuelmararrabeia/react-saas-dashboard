import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

export function NavItem({
  to,
  icon: Icon,
  label
}: {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
          isActive && 'bg-slate-900 text-white hover:bg-slate-900 dark:bg-white dark:text-slate-900'
        )
      }
      end
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  )
}
