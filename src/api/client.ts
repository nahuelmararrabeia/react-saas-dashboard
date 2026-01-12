import type { DashboardKpi, RevenuePoint, User } from './types'
import { db } from './mockDb'
import { formatDate } from '@/lib/format'

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function jitter(min = 220, max = 650) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

export const api = {
  async login(email: string, password: string) {
    await sleep(jitter())
    if (!email.includes('@')) throw new ApiError('Please enter a valid email.')
    if (password.length < 4) throw new ApiError('Password must be at least 4 characters.')

    // Demo auth logic:
    // - If email ends with @acme.com -> Admin
    // - Else -> Manager
    const role = email.endsWith('@acme.com') ? 'Admin' : 'Manager'
    return {
      token: 'demo-token-' + Math.random().toString(16).slice(2),
      user: {
        id: 'me',
        name: email.split('@')[0].replaceAll('.', ' ').replace(/\w/g, (m) => m.toUpperCase()),
        email,
        role
      } as const
    }
  },

  async getDashboard() {
    await sleep(jitter())
    const kpis: DashboardKpi[] = [
      { label: 'Monthly Revenue', value: 128_430, changePct: 8.2 },
      { label: 'Active Users', value: 3_482, changePct: 3.1 },
      { label: 'Conversion Rate', value: 4.7, changePct: -0.6 },
      { label: 'Avg. Order Value', value: 78, changePct: 2.4 }
    ]

    const today = new Date()
    const points: RevenuePoint[] = Array.from({ length: 14 }).map((_, idx) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (13 - idx))
      const base = 7000 + idx * 120
      const wave = Math.sin(idx / 2) * 900
      const revenue = Math.max(2200, Math.round(base + wave + (Math.random() - 0.5) * 700))
      const orders = Math.max(20, Math.round(revenue / (65 + (Math.random() * 10 - 5))))
      return { date: formatDate(d), revenue, orders }
    })

    return { kpis, revenue: points }
  },

  async listUsers(params?: { q?: string; status?: string; role?: string }) {
    await sleep(jitter())
    let users = db.getUsers()

    const q = params?.q?.trim().toLowerCase()
    if (q) users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))

    if (params?.status && params.status !== 'All') users = users.filter((u) => u.status === params.status)
    if (params?.role && params.role !== 'All') users = users.filter((u) => u.role === params.role)

    // newest first
    users = users.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    return users
  },

  async getUser(id: string) {
    await sleep(jitter())
    const user = db.getUsers().find((u) => u.id === id)
    if (!user) throw new ApiError('User not found', 404)
    return user
  },

  async createUser(input: Omit<User, 'id' | 'createdAt'>) {
    await sleep(jitter())
    const users = db.getUsers()
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new ApiError('A user with that email already exists.', 409)
    }
    const newUser: User = {
      ...input,
      id: Math.random().toString(16).slice(2),
      createdAt: new Date().toISOString()
    }
    const updated = [newUser, ...users]
    db.setUsers(updated)
    return newUser
  },

  async updateUser(id: string, patch: Partial<Omit<User, 'id' | 'createdAt'>>) {
    await sleep(jitter())
    const users = db.getUsers()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) throw new ApiError('User not found', 404)

    if (patch.email) {
      const exists = users.some((u) => u.id !== id && u.email.toLowerCase() === patch.email!.toLowerCase())
      if (exists) throw new ApiError('A user with that email already exists.', 409)
    }

    const updatedUser = { ...users[idx], ...patch }
    const next = users.slice()
    next[idx] = updatedUser
    db.setUsers(next)
    return updatedUser
  },

  async deleteUser(id: string) {
    await sleep(jitter())
    const users = db.getUsers()
    const next = users.filter((u) => u.id !== id)
    db.setUsers(next)
    return { ok: true }
  }
}
