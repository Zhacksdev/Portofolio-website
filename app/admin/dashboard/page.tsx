'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Project } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import {
  Plus,
  LogOut,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Github,
  Star,
  Filter,
  ArrowUpDown,
  LayoutGrid,
} from 'lucide-react'

// react-icons (same as form)
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiSupabase,
  SiPostgresql,
  SiNodedotjs,
  SiExpress,
  SiPrisma,
  SiDocker,
  SiVercel,
  SiFigma,
  SiFlutter,
  SiReactos,
  SiFirebase,
  SiGithub,
} from 'react-icons/si'

function b64ToDataUrl(b64: string | null | undefined) {
  if (!b64) return ''
  return `data:image/*;base64,${b64}`
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const STACK_ICON: Record<string, any> = {
  nextjs: SiNextdotjs,
  react: SiReact,
  tailwind: SiTailwindcss,
  typescript: SiTypescript,
  supabase: SiSupabase,
  postgres: SiPostgresql,
  nodejs: SiNodedotjs,
  express: SiExpress,
  prisma: SiPrisma,
  docker: SiDocker,
  vercel: SiVercel,
  figma: SiFigma,
  flutter: SiFlutter,
  'react-native': SiReactos,
  firebase: SiFirebase,
  github: SiGithub,
}

type FilterStatus = 'all' | 'published' | 'draft'
type SortKey = 'newest' | 'oldest' | 'title_asc' | 'title_desc'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string>('')

  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [sortKey, setSortKey] = useState<SortKey>('newest')

  useEffect(() => {
    checkAuth()
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check', { credentials: 'include' })
      if (!res.ok) {
        localStorage.removeItem('admin_authenticated')
        window.location.href = '/admin/login'
      }
    } catch {
      localStorage.removeItem('admin_authenticated')
      window.location.href = '/admin/login'
    }
  }

  const fetchProjects = async () => {
    setLoading(true)
    setFetchError('')
    try {
      const res = await fetch('/api/admin/projects', { credentials: 'include' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch projects')
      setProjects((data.projects || []) as Project[])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch projects'
      setFetchError(msg)
      console.error('[admin/dashboard] Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    })
    localStorage.removeItem('admin_authenticated')
    window.location.href = '/admin/login'
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error('[admin/dashboard] Error deleting project:', err)
    }
  }

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase()

    let list = [...projects]

    // filter status
    if (statusFilter !== 'all') {
      list = list.filter((p) => String((p as any).status || '').toLowerCase() === statusFilter)
    }

    // search
    if (query) {
      list = list.filter((p) => {
        const title = (p.title || '').toLowerCase()
        const desc = (p.description || '').toLowerCase()
        const slug = (p.slug || '').toLowerCase()
        const tags = Array.isArray((p as any).tags) ? ((p as any).tags as string[]).join(' ').toLowerCase() : ''
        const type = String((p as any).type || '').toLowerCase()
        return (
          title.includes(query) ||
          desc.includes(query) ||
          slug.includes(query) ||
          tags.includes(query) ||
          type.includes(query)
        )
      })
    }

    // sort
    const toTime = (s: any) => {
      const d = new Date(String(s || ''))
      const t = d.getTime()
      return Number.isFinite(t) ? t : 0
    }

    list.sort((a, b) => {
      if (sortKey === 'newest') return toTime((b as any).created_at) - toTime((a as any).created_at)
      if (sortKey === 'oldest') return toTime((a as any).created_at) - toTime((b as any).created_at)
      if (sortKey === 'title_asc') return (a.title || '').localeCompare(b.title || '')
      if (sortKey === 'title_desc') return (b.title || '').localeCompare(a.title || '')
      return 0
    })

    return list
  }, [projects, q, statusFilter, sortKey])

  const stats = useMemo(() => {
    const published = projects.filter((p) => String((p as any).status) === 'published').length
    const draft = projects.filter((p) => String((p as any).status) === 'draft').length
    const featured = projects.filter((p) => Boolean((p as any).featured)).length
    return { total: projects.length, published, draft, featured }
  }, [projects])

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-border flex items-center justify-center">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-semibold leading-none">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-1">Manage your portfolio projects</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/admin/dashboard/new">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-2xl">{stats.published}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Draft</CardDescription>
              <CardTitle className="text-2xl">{stats.draft}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Featured</CardDescription>
              <CardTitle className="text-2xl">{stats.featured}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search title, slug, tags, type..."
                  className="pl-9"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                    className="bg-transparent text-sm outline-none"
                  >
                    <option value="all">All</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="bg-transparent text-sm outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title_asc">Title A–Z</option>
                    <option value="title_desc">Title Z–A</option>
                  </select>
                </div>

                <Button variant="outline" onClick={fetchProjects} disabled={loading}>
                  Refresh
                </Button>
              </div>
            </div>

            {fetchError && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {fetchError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-4">
                <div className="h-40 rounded-xl bg-muted animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-full bg-muted animate-pulse rounded" />
                  <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No projects found.</p>
            <div className="flex items-center justify-center gap-2">
              <Button asChild>
                <Link href="/admin/dashboard/new">Create a project</Link>
              </Button>
              <Button variant="outline" onClick={() => { setQ(''); setStatusFilter('all'); }}>
                Clear filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((project) => {
              const coverSrc = b64ToDataUrl((project as any).cover_image_b64)
              const type = String((project as any).type || 'web')
              const status = String((project as any).status || 'published')
              const featured = Boolean((project as any).featured)

              const tags = Array.isArray((project as any).tags) ? ((project as any).tags as string[]) : []
              const stack = Array.isArray((project as any).stack) ? ((project as any).stack as string[]) : []

              return (
                <Card key={project.id} className="overflow-hidden">
                  {/* Cover */}
                  <div className="relative h-44 bg-muted">
                    {coverSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={coverSrc} alt={project.title} className="h-44 w-full object-cover" />
                    ) : (
                      <div className="h-44 w-full flex items-center justify-center text-muted-foreground text-sm">
                        No cover
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <Badge variant={status === 'published' ? 'default' : 'secondary'}>
                        {status}
                      </Badge>
                      <Badge variant="outline">{type}</Badge>
                      {featured && (
                        <Badge className="gap-1">
                          <Star className="h-3.5 w-3.5" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-semibold leading-tight line-clamp-1">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {project.description || '—'}
                      </p>

                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="font-mono">/{project.slug}</span>
                      </p>
                    </div>

                    {/* Stack icons */}
                    {stack.length ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {stack.slice(0, 8).map((k) => {
                          const Icon = STACK_ICON[k]
                          return (
                            <div
                              key={k}
                              className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-1 text-xs"
                              title={k}
                            >
                              {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                              <span className="text-muted-foreground">{k}</span>
                            </div>
                          )
                        })}
                        {stack.length > 8 && (
                          <span className="text-xs text-muted-foreground">+{stack.length - 8}</span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No stack</p>
                    )}

                    {/* Tags */}
                    {tags.length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 6).map((t) => (
                          <Badge key={t} variant="secondary" className="font-normal">
                            {t}
                          </Badge>
                        ))}
                        {tags.length > 6 && (
                          <Badge variant="secondary" className="font-normal">
                            +{tags.length - 6}
                          </Badge>
                        )}
                      </div>
                    ) : null}

                    <Separator />

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/admin/dashboard/edit/${project.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {(project as any).project_url ? (
                        <Button asChild variant="ghost" size="sm" className="px-2">
                          <a href={(project as any).project_url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live
                          </a>
                        </Button>
                      ) : null}

                      {(project as any).github_url ? (
                        <Button asChild variant="ghost" size="sm" className="px-2">
                          <a href={(project as any).github_url} target="_blank" rel="noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            Repo
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Footer hint */}
        <div className="text-xs text-muted-foreground">
          Tip: jangan fetch field <span className="font-mono">mockups_b64</span> di list agar dashboard tetap cepat.
        </div>
      </div>
    </div>
  )
}