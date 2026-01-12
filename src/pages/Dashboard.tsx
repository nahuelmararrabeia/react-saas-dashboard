import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api/client'
import { Topbar } from '@/layout/Topbar'
import { Skeleton } from '@/components/Skeleton'
import { formatCompactNumber, formatCurrency } from '@/lib/format'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard()
  })

  return (
    <div className="space-y-4">
      <Topbar
        title="Overview"
        right={
          <button className="btn-ghost" onClick={() => refetch()}>
            Refresh
          </button>
        }
      />

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-8 w-28" />
              <Skeleton className="mt-3 h-4 w-16" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="card p-6">
          <div className="text-sm font-semibold">Couldn’t load dashboard data.</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Try again in a moment.</div>
          <button className="btn-primary mt-4" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.kpis.map((k) => (
              <div key={k.label} className="card p-4">
                <div className="text-xs text-slate-500 dark:text-slate-400">{k.label}</div>
                <div className="mt-2 text-2xl font-semibold">
                  {k.label.includes('Revenue') ? formatCurrency(k.value) : k.label.includes('Rate') ? `${k.value}%` : formatCompactNumber(k.value)}
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {k.changePct >= 0 ? (
                    <>
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">{k.changePct}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-4 w-4 text-rose-500" />
                      <span className="text-rose-600 dark:text-rose-400">{k.changePct}%</span>
                    </>
                  )}
                  <span className="text-slate-500 dark:text-slate-400">vs last period</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm font-semibold">Revenue & Orders</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Last 14 days</div>
                </div>
                <div className="badge">Auto-generated</div>
              </div>
              <div className="h-[320px] px-2 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenue} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" strokeWidth={2} />
                    <Area type="monotone" dataKey="orders" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-4">
              <div className="text-sm font-semibold">Notes</div>
              <div className="mt-2 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950">
                  <div className="font-medium">Built for Upwork</div>
                  <div className="mt-1 text-slate-600 dark:text-slate-300">
                    Clean architecture, loading states, errors, CRUD, charts, responsive & dark mode.
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-800">
                  <div className="font-medium">Next step</div>
                  <div className="mt-1 text-slate-600 dark:text-slate-300">
                    Replace the mock API with your backend (REST/GraphQL). React Query wiring is ready.
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Tip: Try <span className="badge">Users</span> to see CRUD + filters.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
