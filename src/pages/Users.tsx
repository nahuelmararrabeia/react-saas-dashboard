import React, { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, ApiError } from '@/api/client'
import type { Role, Status, User } from '@/api/types'
import { Topbar } from '@/layout/Topbar'
import { EmptyState } from '@/components/EmptyState'
import { Skeleton } from '@/components/Skeleton'
import { formatDate } from '@/lib/format'
import { Plus, Trash2, Pencil, X } from 'lucide-react'
import { useToast } from '@/components/Toast'

const ROLES: Array<Role | 'All'> = ['All', 'Admin', 'Manager', 'Viewer']
const STATUSES: Array<Status | 'All'> = ['All', 'Active', 'Invited', 'Suspended']

function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-white p-4 shadow-2xl dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">User</div>
          <button className="btn-ghost p-2" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

function UserForm({
  initial,
  onSubmit,
  loading
}: {
  initial?: Partial<User>
  onSubmit: (data: { name: string; email: string; role: Role; status: Status }) => void
  loading: boolean
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [role, setRole] = useState<Role>((initial?.role as Role) ?? 'Viewer')
  const [status, setStatus] = useState<Status>((initial?.status as Status) ?? 'Invited')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ name: name.trim(), email: email.trim(), role, status })
      }}
      className="space-y-3"
    >
      <div>
        <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Name</label>
        <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Email</label>
        <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Role</label>
          <select className="input mt-1" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Status</label>
          <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <button className="btn-primary w-full" disabled={loading}>
        {loading ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}

export default function UsersPage() {
  const toast = useToast()
  const qc = useQueryClient()

  const [q, setQ] = useState('')
  const [role, setRole] = useState<(typeof ROLES)[number]>('All')
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('All')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)

  const queryKey = useMemo(() => ['users', { q, role, status }], [q, role, status])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => api.listUsers({ q, role, status })
  })

  const createMut = useMutation({
    mutationFn: (payload: Omit<User, 'id' | 'createdAt'>) => api.createUser(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['users'] })
      toast.push({ type: 'success', title: 'User created' })
      setDrawerOpen(false)
      setEditing(null)
    },
    onError: (e: any) => {
      const msg = e instanceof ApiError ? e.message : 'Failed to create user.'
      toast.push({ type: 'error', title: 'Create failed', description: msg })
    }
  })

  const updateMut = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<User> }) => api.updateUser(id, patch),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['users'] })
      toast.push({ type: 'success', title: 'User updated' })
      setDrawerOpen(false)
      setEditing(null)
    },
    onError: (e: any) => {
      const msg = e instanceof ApiError ? e.message : 'Failed to update user.'
      toast.push({ type: 'error', title: 'Update failed', description: msg })
    }
  })

  const delMut = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['users'] })
      toast.push({ type: 'success', title: 'User deleted' })
    },
    onError: () => toast.push({ type: 'error', title: 'Delete failed' })
  })

  function openCreate() {
    setEditing(null)
    setDrawerOpen(true)
  }

  function openEdit(u: User) {
    setEditing(u)
    setDrawerOpen(true)
  }

  return (
    <div className="space-y-4">
      <Topbar
        title="Users"
        right={
          <button className="btn-primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New user
          </button>
        }
      />

      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Search</label>
            <input className="input mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or email" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Role</label>
            <select className="input mt-1" value={role} onChange={(e) => setRole(e.target.value as any)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Status</label>
            <select className="input mt-1" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-4 w-64" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="card p-6">
          <div className="text-sm font-semibold">Couldn’t load users.</div>
          <button className="btn-primary mt-4" onClick={() => refetch()}>Retry</button>
        </div>
      )}

      {data && data.length === 0 && (
        <EmptyState
          title="No users found"
          description="Try clearing filters or create a new user."
          action={<button className="btn-primary" onClick={openCreate}>Create user</button>}
        />
      )}

      {data && data.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((u) => (
                  <tr key={u.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-4 py-3">
                      <div className="font-medium">{u.name}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-4 py-3"><span className="badge">{u.role}</span></td>
                    <td className="px-4 py-3">
                      <span className="badge">{u.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="btn-ghost p-2" onClick={() => openEdit(u)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="btn-ghost p-2" onClick={() => delMut.mutate(u.id)} aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Drawer open={drawerOpen} onClose={() => { setDrawerOpen(false); setEditing(null) }}>
        <div className="text-sm font-semibold">{editing ? 'Edit user' : 'Create user'}</div>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Fully functional CRUD backed by localStorage (mock API). Swap with your backend anytime.
        </div>

        <div className="mt-4">
          <UserForm
            initial={editing ?? undefined}
            loading={createMut.isPending || updateMut.isPending}
            onSubmit={(payload) => {
              if (editing) updateMut.mutate({ id: editing.id, patch: payload })
              else createMut.mutate(payload)
            }}
          />
        </div>
      </Drawer>
    </div>
  )
}
