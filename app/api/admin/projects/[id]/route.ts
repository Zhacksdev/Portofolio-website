import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

function safeJsonArray(value: FormDataEntryValue | null, fallback: string[] = []) {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(String(value))
    if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.trim()).filter(Boolean)
    return fallback
  } catch {
    return fallback
  }
}

async function fileToB64(file: File) {
  const buf = Buffer.from(await file.arrayBuffer())
  return buf.toString('base64')
}

async function ensureUniqueSlugForUpdate(base: string, id: string) {
  const cleanBase = base || 'project'
  let candidate = cleanBase
  let n = 1

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle()

    if (error) throw error
    if (!data) return candidate
    if (data.id === id) return candidate

    n += 1
    candidate = `${cleanBase}-${n}`
  }
}

const ALLOWED_TYPES = ['web', 'mobile', 'desktop', 'backend', 'uiux', 'other'] as const
const ALLOWED_STATUS = ['draft', 'published'] as const

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json({ project })
  } catch (error) {
    console.error('[admin/projects/[id] GET] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params

    // fetch existing images for "keep old if no new upload"
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('projects')
      .select('id, cover_image_b64, mockups_b64')
      .eq('id', id)
      .single()

    if (existingError) throw existingError
    if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const fd = await request.formData()

    const title = String(fd.get('title') || '').trim()
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const requestedSlug = String(fd.get('slug') || '').trim()
    const baseSlug = slugify(requestedSlug || title)
    const slug = await ensureUniqueSlugForUpdate(baseSlug, id)

    const typeRaw = String(fd.get('type') || 'web').trim()
    const type = (ALLOWED_TYPES as readonly string[]).includes(typeRaw) ? typeRaw : 'web'

    const statusRaw = String(fd.get('status') || 'published').trim()
    const status = (ALLOWED_STATUS as readonly string[]).includes(statusRaw) ? statusRaw : 'published'

    const description = String(fd.get('description') || '').trim() || null
    const project_url = String(fd.get('project_url') || '').trim() || null
    const github_url = String(fd.get('github_url') || '').trim() || null
    const featured = String(fd.get('featured') || 'false') === 'true'

    const tags = safeJsonArray(fd.get('tags'), [])
    const stack = safeJsonArray(fd.get('stack'), [])

    const coverEntry = fd.get('cover')
    const newCoverB64 = coverEntry instanceof File ? await fileToB64(coverEntry) : null

    const mockupFiles = fd.getAll('mockups').filter((x): x is File => x instanceof File)
    const newMockupsB64 = mockupFiles.length ? await Promise.all(mockupFiles.map(fileToB64)) : null

    const updatePayload: Record<string, any> = {
      title,
      slug,
      description,
      type,
      tags,
      stack,
      project_url,
      github_url,
      featured,
      status,
      updated_at: new Date().toISOString(),
    }

    if (newCoverB64) updatePayload.cover_image_b64 = newCoverB64
    if (newMockupsB64) updatePayload.mockups_b64 = newMockupsB64

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ project })
  } catch (error) {
    console.error('[admin/projects/[id] PUT] Error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params

    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/projects/[id] DELETE] Error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}