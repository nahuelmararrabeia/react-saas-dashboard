import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { ToastProvider } from '@/components/Toast'

export function AppShell() {
  return (
    <ToastProvider>
      <div className="mx-auto flex max-w-[1200px] gap-4 p-4">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  )
}
