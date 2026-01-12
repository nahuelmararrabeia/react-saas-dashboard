import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from '@/routes/RequireAuth'
import { AppShell } from '@/layout/AppShell'
import LoginPage from '@/pages/Login'
import DashboardPage from '@/pages/Dashboard'
import UsersPage from '@/pages/Users'
import SettingsPage from '@/pages/Settings'
import NotFoundPage from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
