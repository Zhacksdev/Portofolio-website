'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/admin/project-form'

export default function NewProjectPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check', {
        credentials: 'include'
      })
      if (!res.ok) {
        localStorage.removeItem('admin_authenticated')
        window.location.href = '/admin/login'
        return
      }
      setIsAuthenticated(true)
    } catch {
      localStorage.removeItem('admin_authenticated')
      window.location.href = '/admin/login'
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <ProjectForm mode="create" />
}
