'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, X, Image as ImageIcon, Link as LinkIcon, Layers } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// shadcn (kalau belum ada, bilang)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import type { Project } from '@/lib/supabase'

// npm i react-icons
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

type ProjectType = 'web' | 'mobile' | 'desktop' | 'backend' | 'uiux' | 'other'
type ProjectStatus = 'draft' | 'published'

type ProjectFormProps = {
  project?: Project
  mode: 'create' | 'edit'
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const STACK_OPTIONS = [
  { key: 'nextjs', label: 'Next.js', Icon: SiNextdotjs },
  { key: 'react', label: 'React', Icon: SiReact },
  { key: 'tailwind', label: 'Tailwind', Icon: SiTailwindcss },
  { key: 'typescript', label: 'TypeScript', Icon: SiTypescript },
  { key: 'supabase', label: 'Supabase', Icon: SiSupabase },
  { key: 'postgres', label: 'PostgreSQL', Icon: SiPostgresql },
  { key: 'nodejs', label: 'Node.js', Icon: SiNodedotjs },
  { key: 'express', label: 'Express', Icon: SiExpress },
  { key: 'prisma', label: 'Prisma', Icon: SiPrisma },
  { key: 'docker', label: 'Docker', Icon: SiDocker },
  { key: 'vercel', label: 'Vercel', Icon: SiVercel },
  { key: 'figma', label: 'Figma', Icon: SiFigma },
  { key: 'flutter', label: 'Flutter', Icon: SiFlutter },
  { key: 'react-native', label: 'React Native', Icon: SiReactos },
  { key: 'firebase', label: 'Firebase', Icon: SiFirebase },
  { key: 'github', label: 'GitHub', Icon: SiGithub },
] as const

type StackKey = (typeof STACK_OPTIONS)[number]['key']

function b64ToDataUrl(b64: string | null | undefined) {
  if (!b64) return ''
  return `data:image/*;base64,${b64}`
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // file upload
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [mockupFiles, setMockupFiles] = useState<File[]>([])

  // previews
  const [coverPreview, setCoverPreview] = useState<string>(() =>
    b64ToDataUrl((project as any)?.cover_image_b64)
  )
  const [mockupPreviews, setMockupPreviews] = useState<string[]>(() =>
    (project as any)?.mockups_b64
      ? ((project as any).mockups_b64 as string[]).map(b64ToDataUrl)
      : []
  )

  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    tags: Array.isArray((project as any)?.tags) ? ((project as any).tags as string[]).join(', ') : '',
    stack: (Array.isArray((project as any)?.stack) ? ((project as any).stack as string[]) : null) ?? [],
    type: (((project as any)?.type as ProjectType) || 'web') as ProjectType,
    project_url: (project as any)?.project_url || '',
    github_url: (project as any)?.github_url || '',
    featured: (project as any)?.featured || false,
    status: (((project as any)?.status as ProjectStatus) || 'published') as ProjectStatus,
  })

  // slug auto (respect manual edit)
  const [slugTouched, setSlugTouched] = useState(false)
  const initialSlugRef = useRef(project?.slug ?? '')
  const autoSlug = useMemo(() => slugify(formData.title), [formData.title])

  useEffect(() => {
    if (!autoSlug) return

    if (mode === 'create') {
      if (!slugTouched) setFormData((p) => ({ ...p, slug: autoSlug }))
      return
    }

    const isInitialSlug = formData.slug === initialSlugRef.current
    if (!slugTouched && isInitialSlug) {
      setFormData((p) => ({ ...p, slug: autoSlug }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSlug, mode])

  const resetSlugToAuto = () => {
    setSlugTouched(false)
    setFormData((p) => ({ ...p, slug: slugify(p.title) }))
  }

  const toggleStack = (key: StackKey) => {
    setFormData((p) => {
      const active = p.stack.includes(key)
      return { ...p, stack: active ? p.stack.filter((x) => x !== key) : [...p.stack, key] }
    })
  }

  // preview cover
  useEffect(() => {
    if (!coverFile) return
    const url = URL.createObjectURL(coverFile)
    setCoverPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [coverFile])

  // preview mockups
  useEffect(() => {
    if (!mockupFiles.length) return
    const urls = mockupFiles.map((f) => URL.createObjectURL(f))
    setMockupPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [mockupFiles])

  const removeMockupAt = (idx: number) => {
    if (mockupFiles.length) {
      setMockupFiles((prev) => prev.filter((_, i) => i !== idx))
      return
    }
    setMockupPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const selectedStackLabels = useMemo(() => {
    const map = new Map(STACK_OPTIONS.map((o) => [o.key, o.label]))
    return formData.stack.map((k) => map.get(k) ?? k)
  }, [formData.stack])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const fd = new FormData()

      fd.set('title', formData.title)
      fd.set('slug', formData.slug)
      fd.set('description', formData.description || '')
      fd.set('type', formData.type)
      fd.set('project_url', formData.project_url || '')
      fd.set('github_url', formData.github_url || '')
      fd.set('featured', String(!!formData.featured))
      fd.set('status', formData.status)

      fd.set(
        'tags',
        JSON.stringify(
          formData.tags
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        )
      )
      fd.set('stack', JSON.stringify(formData.stack))

      if (coverFile) fd.set('cover', coverFile)
      mockupFiles.forEach((f) => fd.append('mockups', f))

      const url = mode === 'create' ? '/api/admin/projects' : `/api/admin/projects/${(project as any)?.id}`

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        credentials: 'include',
        body: fd,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save project')

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="text-sm text-muted-foreground">
            {mode === 'create' ? 'New project' : 'Editing project'}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold">
              {mode === 'create' ? 'Create Project' : 'Edit Project'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Isi detail project, upload cover & mockups, lalu publish.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
              {formData.status}
            </Badge>
            {formData.featured && <Badge>featured</Badge>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* LEFT: main */}
          <div className="space-y-6">
            {/* Basics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Basics
                </CardTitle>
                <CardDescription>Judul, slug, dan deskripsi singkat.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-end justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => {
                          setSlugTouched(true)
                          setFormData((p) => ({ ...p, slug: e.target.value }))
                        }}
                        required
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={resetSlugToAuto} disabled={!formData.title}>
                      Auto
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Auto: <span className="font-mono">{autoSlug || '-'}</span>{' '}
                    {slugTouched ? '• manual' : '• auto'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    rows={4}
                    placeholder="1–3 kalimat: apa project-nya, untuk siapa, value utamanya."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Classification */}
            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
                <CardDescription>Tipe project, tech stack, dan tags.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Project Type</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as ProjectType }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="web">Web</option>
                      <option value="mobile">Mobile</option>
                      <option value="desktop">Desktop</option>
                      <option value="backend">Backend</option>
                      <option value="uiux">UI/UX</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                      placeholder="E-commerce, Admin Panel, Landing Page"
                    />
                    <p className="text-xs text-muted-foreground">Pisahkan dengan koma.</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Tech Stack</Label>
                    <div className="hidden md:block text-xs text-muted-foreground">
                      Selected: {selectedStackLabels.length ? selectedStackLabels.join(', ') : '-'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {STACK_OPTIONS.map(({ key, label, Icon }) => {
                      const active = formData.stack.includes(key)
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleStack(key)}
                          className={cx(
                            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition',
                            active
                              ? 'bg-foreground text-background border-foreground'
                              : 'bg-background hover:bg-muted'
                          )}
                          aria-pressed={active}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      )
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Disimpan sebagai array key, contoh: <span className="font-mono">["nextjs","tailwind"]</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Media
                </CardTitle>
                <CardDescription>Upload cover thumbnail dan mockups.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cover */}
                <div className="space-y-2">
                  <Label>Cover Thumbnail</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-sm hover:file:bg-muted"
                  />

                  {coverPreview ? (
                    <div className="mt-3 overflow-hidden rounded-xl border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                      Belum ada cover.
                    </div>
                  )}
                </div>

                <Separator />

                {/* Mockups */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Mockups</Label>
                    <span className="text-xs text-muted-foreground">{mockupPreviews.length} file</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setMockupFiles(Array.from(e.target.files ?? []))}
                    className="block w-full text-sm file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-sm hover:file:bg-muted"
                  />

                  {mockupPreviews.length ? (
                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                      {mockupPreviews.map((src, idx) => (
                        <div key={idx} className="relative overflow-hidden rounded-xl border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Mockup ${idx + 1}`} className="w-full h-40 object-cover" />
                          <button
                            type="button"
                            onClick={() => removeMockupAt(idx)}
                            className="absolute right-2 top-2 rounded-full bg-background/80 p-1 border border-border hover:bg-background"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                      Belum ada mockups.
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Upload baru akan <b>replace</b> mockups lama saat update.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Links
                </CardTitle>
                <CardDescription>Live URL dan GitHub repository.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project_url">Live URL</Label>
                  <Input
                    id="project_url"
                    type="url"
                    value={formData.project_url}
                    onChange={(e) => setFormData((p) => ({ ...p, project_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData((p) => ({ ...p, github_url: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT: publish panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
                <CardDescription>Atur status dan featured.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as ProjectStatus }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">Featured</div>
                    <div className="text-xs text-muted-foreground">Tampilkan di halaman utama.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                    className="h-4 w-4"
                  />
                </div>

                <Separator />

                <div className="text-xs text-muted-foreground space-y-2">
                  <div>
                    <span className="font-medium text-foreground">Tips:</span> untuk DB base64, batasi ukuran gambar.
                  </div>
                  <div>
                    Di list admin, hindari fetch <span className="font-mono">*_b64</span> agar UI tetap cepat.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="rounded-2xl border border-border bg-background/60 p-4 backdrop-blur">
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1" onClick={() => {}}>
                  {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Slug akan di-unique di server. Upload gambar baru saat edit akan replace mockups lama.
              </p>
            </div>
          </div>

          {/* Hidden submit for right-panel button */}
          <button type="submit" className="hidden" aria-hidden="true" />
        </form>
      </div>
    </div>
  )
}