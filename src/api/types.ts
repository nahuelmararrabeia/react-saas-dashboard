export type Role = 'Admin' | 'Manager' | 'Viewer'
export type Status = 'Active' | 'Invited' | 'Suspended'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  createdAt: string
}

export type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
}

export type DashboardKpi = {
  label: string
  value: number
  changePct: number
}

export type RevenuePoint = {
  date: string
  revenue: number
  orders: number
}
