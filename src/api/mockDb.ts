import type { User } from './types'
import { storage } from '@/lib/storage'

const USERS_KEY = 'rsd.users.v1'

function uid() {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)
}

function seedUsers(): User[] {
  const now = Date.now()
  const base = [
    { name: 'Ava Thompson', email: 'ava@acme.com', role: 'Admin', status: 'Active' },
    { name: 'Noah Patel', email: 'noah@acme.com', role: 'Manager', status: 'Active' },
    { name: 'Mia Garcia', email: 'mia@acme.com', role: 'Viewer', status: 'Invited' },
    { name: 'Liam Chen', email: 'liam@acme.com', role: 'Manager', status: 'Active' },
    { name: 'Sofia Rossi', email: 'sofia@acme.com', role: 'Viewer', status: 'Suspended' }
  ] as const

  return base.map((u, i) => ({
    id: uid(),
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    createdAt: new Date(now - i * 86400000 * 7).toISOString()
  }))
}

export const db = {
  getUsers(): User[] {
    const existing = storage.get<User[] | null>(USERS_KEY, null)
    if (existing && existing.length) return existing
    const seeded = seedUsers()
    storage.set(USERS_KEY, seeded)
    return seeded
  },
  setUsers(users: User[]) {
    storage.set(USERS_KEY, users)
  }
}
