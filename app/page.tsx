import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/supabase'
import { ArrowUpRight } from 'lucide-react'

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

async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(
      // ambil field yang dipakai UI saja (hindari mockups_b64)
      'id,title,slug,description,tags,type,stack,cover_image_b64,featured,status,created_at'
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('[projects] Error fetching projects:', error)
    return []
  }

  return data as Project[]
}

export default async function Page() {
  const projects = await getFeaturedProjects()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="container mx-auto px-6 pt-28 pb-14 md:pt-32 md:pb-20">
        <div className="max-w-4xl">
          <p className="text-sm text-muted-foreground mb-4">
            Portfolio
          </p>

          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-tight text-balance">
            Frontend Developer & Creative Technologist
          </h1>

          <p className="mt-6 text-base md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Crafting digital experiences with clean code and thoughtful design.
            Specialized in modern web technologies and user-centric interfaces.
          </p>
        </div>
      </section>

      {/* Selected Work */}
      <section className="container mx-auto px-6 pb-20 md:pb-24">
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">
              Selected Work
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              A few recent projects — curated highlights.
            </p>
          </div>

          <Link
            href="/projects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 md:py-20 border border-border rounded-2xl bg-card">
            <p className="text-muted-foreground">No projects yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => {
              const coverSrc = b64ToDataUrl((project as any).cover_image_b64)
              const tags = Array.isArray((project as any).tags) ? ((project as any).tags as string[]) : []
              const stack = Array.isArray((project as any).stack) ? ((project as any).stack as string[]) : []
              const type = formatType((project as any).type)
              const featured = Boolean((project as any).featured)

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <div className="rounded-2xl border border-border bg-card overflow-hidden transition
                                  hover:shadow-lg hover:-translate-y-0.5">
                    {/* Cover */}
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      {coverSrc ? (
                        // data-url lebih aman pakai img biasa
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

                      {/* Top badges */}
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full border border-border bg-background/80 backdrop-blur">
                          {type}
                        </span>
                        {featured ? (
                          <span className="text-xs px-2 py-1 rounded-full border border-border bg-background/80 backdrop-blur">
                            Featured
                          </span>
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
                      </div>

                      {/* Stack icons */}
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
                          {tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 3 ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              +{tags.length - 3}
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
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}