import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-[720px] flex-col items-center justify-center py-24">
      <div className="text-6xl font-black tracking-tight">404</div>
      <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">That page doesn’t exist.</div>
      <Link to="/" className="btn-primary mt-6">Back to dashboard</Link>
    </div>
  )
}
