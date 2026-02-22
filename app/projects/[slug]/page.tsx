import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/supabase'
import { ArrowLeft, ExternalLink, Github, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

async function getProject(slug: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(
      // ambil field sesuai schema terbaru (hindari field lama cover_image/images)
      'id,title,slug,description,content,tags,type,stack,featured,project_url,github_url,cover_image_b64,mockups_b64,status,created_at'
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    console.error('[project detail] Error fetching project:', error)
    return null
  }
  return data as Project
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  const coverSrc = b64ToDataUrl((project as any).cover_image_b64)
  const mockups = Array.isArray((project as any).mockups_b64) ? ((project as any).mockups_b64 as string[]) : []
  const tags = Array.isArray((project as any).tags) ? ((project as any).tags as string[]) : []
  const stack = Array.isArray((project as any).stack) ? ((project as any).stack as string[]) : []
  const type = formatType((project as any).type)
  const featured = Boolean((project as any).featured)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Cover */}
      <section className="container mx-auto px-6 pt-24 md:pt-28">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mt-6 rounded-3xl border border-border bg-card overflow-hidden">
          <div className="relative">
            {/* Cover */}
            <div className="relative aspect-[16/7] bg-muted">
              {coverSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverSrc}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-5xl font-display text-muted-foreground">
                    {project.title?.charAt(0) ?? 'P'}
                  </span>
                </div>
              )}

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-transparent" />

              {/* badges */}
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background/70 backdrop-blur">
                  {type}
                </Badge>
                {featured ? (
                  <Badge className="bg-background/70 text-foreground border border-border backdrop-blur gap-1">
                    <Star className="h-3.5 w-3.5" />
                    Featured
                  </Badge>
                ) : null}
              </div>

              {/* title area */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-tight text-balance">
                  {project.title}
                </h1>

                {project.description ? (
                  <p className="mt-3 text-sm md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
                    {project.description}
                  </p>
                ) : null}

                {/* CTAs */}
                <div className="mt-5 flex flex-wrap gap-3">
                  {(project as any).project_url ? (
                    <Button asChild>
                      <a
                        href={(project as any).project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Live
                      </a>
                    </Button>
                  ) : null}

                  {(project as any).github_url ? (
                    <Button asChild variant="outline">
                      <a
                        href={(project as any).github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* meta bar */}
            <div className="p-5 md:p-8 space-y-5">
              {/* Stack */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Tech Stack</div>
                {stack.length ? (
                  <div className="flex flex-wrap gap-2">
                    {stack.map((k) => {
                      const Icon = STACK_ICON[k]
                      return (
                        <span
                          key={k}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm"
                          title={k}
                        >
                          {Icon ? <Icon className="h-4 w-4" /> : null}
                          <span className="text-muted-foreground">{k}</span>
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tech stack provided.</p>
                )}
              </div>

              {/* Tags */}
              {tags.length ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Main content */}
          <div className="space-y-10">
            {/* Content */}
            {(project as any).content ? (
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
                <h2 className="text-xl font-display font-semibold">Overview</h2>
                <Separator className="my-4" />
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {(project as any).content}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Mockups */}
            {mockups.length ? (
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <h2 className="text-xl font-display font-semibold">Mockups</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Screenshots / UI previews from this project.
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {mockups.length} images
                  </span>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockups.map((b64, idx) => {
                    const src = b64ToDataUrl(b64)
                    return (
                      <div
                        key={idx}
                        className="relative overflow-hidden rounded-2xl border border-border bg-muted"
                      >
                        {src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={src}
                            alt={`${project.title} mockup ${idx + 1}`}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="p-10 text-sm text-muted-foreground">No image</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* Side panel */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-sm font-medium">Quick Info</h3>
              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{type}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Slug</span>
                  <span className="font-mono text-xs">{`/${project.slug}`}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Stack</span>
                  <span className="font-medium">{stack.length}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Tags</span>
                  <span className="font-medium">{tags.length}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Mockups</span>
                  <span className="font-medium">{mockups.length}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col gap-2">
                {(project as any).project_url ? (
                  <Button asChild>
                    <a href={(project as any).project_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Live
                    </a>
                  </Button>
                ) : null}

                {(project as any).github_url ? (
                  <Button asChild variant="outline">
                    <a href={(project as any).github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      Open Repo
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Tip: keep images lightweight when storing base64 in DB.
            </div>
          </aside>
        </div>
      </section>

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