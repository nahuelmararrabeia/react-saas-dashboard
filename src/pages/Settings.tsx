import React, { useState } from 'react'
import { Topbar } from '@/layout/Topbar'
import { useAuth } from '@/state/auth'
import { useToast } from '@/components/Toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const toast = useToast()

  const [company, setCompany] = useState('Acme Inc.')
  const [timezone, setTimezone] = useState('America/Argentina/Buenos_Aires')
  const [currency, setCurrency] = useState('USD')

  function save() {
    toast.push({ type: 'success', title: 'Settings saved', description: 'This demo stores settings only in-memory.' })
  }

  return (
    <div className="space-y-4">
      <Topbar title="Settings" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4">
          <div className="text-sm font-semibold">Account</div>
          <div className="mt-3 text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400">Signed in as</div>
            <div className="mt-1 font-medium">{user?.name}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{user?.email}</div>
            <div className="mt-2"><span className="badge">{user?.role}</span></div>
          </div>
        </div>

        <div className="card p-4 lg:col-span-2">
          <div className="text-sm font-semibold">Workspace</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Company</label>
              <input className="input mt-1" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Timezone</label>
              <input className="input mt-1" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Currency</label>
              <select className="input mt-1" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <button className="btn-primary mt-4" onClick={save}>Save changes</button>
        </div>
      </div>

      <div className="card p-4">
        <div className="text-sm font-semibold">Production notes</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Replace <span className="badge">src/api/client.ts</span> with real API calls.</li>
          <li>Keep React Query for caching, loading states, retries and invalidation.</li>
          <li>Users module already follows CRUD patterns used in real apps.</li>
        </ul>
      </div>
    </div>
  )
}
