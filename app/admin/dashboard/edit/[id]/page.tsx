'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectForm } from '@/components/admin/project-form'
import type { Project } from '@/lib/supabase'

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    const checkAuthAndFetchProject = async () => {
      try {
        // Check authentication first
        const authRes = await fetch('/api/admin/check', {
          credentials: 'include'
        })
        if (!authRes.ok) {
          localStorage.removeItem('admin_authenticated')
          window.location.href = '/admin/login'
          return
        }

        // Then fetch project
        const res = await fetch(`/api/admin/projects/${id}`, {
          credentials: 'include'
        })
        if (!res.ok) {
          window.location.href = '/admin/dashboard'
          return
        }
        const data = await res.json()
        setProject(data.project)
      } catch (err) {
        console.error('[v0] Error fetching project:', err)
        window.location.href = '/admin/dashboard'
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchProject()
  }, [id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return <ProjectForm project={project} mode="edit" />
}
