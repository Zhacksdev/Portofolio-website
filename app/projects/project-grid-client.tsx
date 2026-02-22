'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Project } from '@/lib/supabase'
import { ArrowUpRight, Filter, Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// react-icons (npm i react-icons)
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

function b64ToDataUrl(b64: string | null | undefined) {
  if (!b64) return ''
  return `data:image/*;base64,${b64}`
}

function formatType(type: string | null | undefined) {
  const t = String(type || 'web').toLowerCase()
  if (t === 'uiux') return 'UI/UX'
  return t.charAt(0).toUpperCase() + t.slice(1)
}

type Props = {
  projects: Project[]
}

export default function ProjectGridClient({ projects }: Props) {
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | string>('all')
  const [stackFilter, setStackFilter] = useState<'all' | string>('all')

  const allTypes = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) set.add(String((p as any).type || 'web'))
    return ['all', ...Array.from(set).sort()]
  }, [projects])

  const allStacks = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) {
      const stack = Array.isArray((p as any).stack) ? ((p as any).stack as string[]) : []
      stack.forEach((s) => set.add(s))
    }
    return ['all', ...Array.from(set).sort()]
  }, [projects])

  const visible = useMemo(() => {
    const query = q.trim().toLowerCase()

    return projects.filter((p) => {
      const title = (p.title || '').toLowerCase()
      const desc = (p.description || '').toLowerCase()
      const slug = (p.slug || '').toLowerCase()
      const tags = Array.isArray((p as any).tags) ? ((p as any).tags as string[]).join(' ').toLowerCase() : ''
      const type = String((p as any).type || 'web').toLowerCase()
      const stackArr = Array.isArray((p as any).stack) ? ((p as any).stack as string[]) : []
      const stackStr = stackArr.join(' ').toLowerCase()

      const matchQuery =
        !query || title.includes(query) || desc.includes(query) || slug.includes(query) || tags.includes(query)

      const matchType = typeFilter === 'all' || type === String(typeFilter).toLowerCase()
      const matchStack = stackFilter === 'all' || stackArr.includes(stackFilter)

      return matchQuery && matchType && matchStack
    })
  }, [projects, q, typeFilter, stackFilter])

  const clearFilters = () => {
    setQ('')
    setTypeFilter('all')
    setStackFilter('all')
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, slug, tags..."
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-sm outline-none"
                >
                  {allTypes.map((t) => (
                    <option key={t} value={t}>
                      {t === 'all' ? 'All types' : formatType(t)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={stackFilter}
                  onChange={(e) => setStackFilter(e.target.value)}
                  className="bg-transparent text-sm outline-none"
                >
                  {allStacks.map((s) => (
                    <option key={s} value={s}>
                      {s === 'all' ? 'All stacks' : s}
                    </option>
                  ))}
                </select>
              </div>

              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing <span className="text-foreground font-medium">{visible.length}</span> of{' '}
              <span className="text-foreground font-medium">{projects.length}</span>
            </div>
            <div className="hidden md:block">
              Tip: filter by stack to quickly find relevant work.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-16 border border-border rounded-2xl bg-card">
          <p className="text-muted-foreground">No projects match your filters.</p>
          <div className="mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Reset filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visible.map((project) => {
            const coverSrc = b64ToDataUrl((project as any).cover_image_b64)
            const type = formatType((project as any).type)
            const tags = Array.isArray((project as any).tags) ? ((project as any).tags as string[]) : []
            const stack = Array.isArray((project as any).stack) ? ((project as any).stack as string[]) : []
            const featured = Boolean((project as any).featured)

            return (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group block">
                <div className="rounded-2xl border border-border bg-card overflow-hidden transition
                                hover:shadow-lg hover:-translate-y-0.5">
                  {/* Cover */}
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {coverSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverSrc}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-display text-muted-foreground">
                          {project.title?.charAt(0) ?? 'P'}
                        </span>
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur">
                        {type}
                      </Badge>
                      {featured ? (
                        <Badge className="bg-background/80 text-foreground border border-border backdrop-blur">
                          Featured
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5 space-y-3">
                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-display font-semibold leading-tight line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                        {project.description || '—'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="font-mono">/{project.slug}</span>
                      </p>
                    </div>

                    {/* Stack */}
                    {stack.length ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {stack.slice(0, 6).map((k) => {
                          const Icon = STACK_ICON[k]
                          return (
                            <span
                              key={k}
                              className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-1 text-xs"
                              title={k}
                            >
                              {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                              <span className="text-muted-foreground">{k}</span>
                            </span>
                          )
                        })}
                        {stack.length > 6 ? (
                          <span className="text-xs text-muted-foreground">+{stack.length - 6}</span>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No tech stack</p>
                    )}

                    {/* Tags */}
                    {tags.length ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {tags.length > 4 ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            +{tags.length - 4}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {/* CTA */}
                    <div className="pt-1">
                      <span className="text-sm font-medium inline-flex items-center gap-1 text-foreground/90 group-hover:text-foreground transition-colors">
                        View project
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}