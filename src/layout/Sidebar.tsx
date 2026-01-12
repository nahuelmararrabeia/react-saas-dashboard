import React from 'react'
import { LayoutDashboard, Users, Settings, LifeBuoy, PanelLeft } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { NavItem } from './NavItem'
import { useUiStore } from '@/state/uiStore'
import { cn } from '@/lib/cn'

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore()

  return (
    <aside
      className={cn(
        'card sticky top-4 hidden h-[calc(100vh-2rem)] w-[280px] shrink-0 flex-col p-3 lg:flex',
        !sidebarOpen && 'w-[92px]'
      )}
    >
      <div className="flex items-center justify-between gap-3 px-2">
        <Logo compact={!sidebarOpen} />
        <button className="btn-ghost p-2" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-1">
        <NavItem to="/" icon={LayoutDashboard} label={sidebarOpen ? 'Dashboard' : ''} />
        <NavItem to="/users" icon={Users} label={sidebarOpen ? 'Users' : ''} />
        <NavItem to="/settings" icon={Settings} label={sidebarOpen ? 'Settings' : ''} />
      </div>

      <div className="mt-2 border-t border-slate-200 pt-3 dark:border-slate-800">
        <div className={cn('flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-500 dark:text-slate-400', !sidebarOpen && 'justify-center')}>
          <LifeBuoy className="h-4 w-4" />
          {sidebarOpen && <span>Support: help@reactsaas.dev</span>}
        </div>
      </div>
    </aside>
  )
}
