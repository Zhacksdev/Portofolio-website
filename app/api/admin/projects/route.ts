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

async function ensureUniqueSlug(base: string) {
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

    n += 1
    candidate = `${cleanBase}-${n}`
  }
}

const ALLOWED_TYPES = ['web', 'mobile', 'desktop', 'backend', 'uiux', 'other'] as const
const ALLOWED_STATUS = ['draft', 'published'] as const

export async function GET() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // ⚠️ IMPORTANT: jangan ambil b64 di list biar ringan
    const { data: projects, error } = await supabaseAdmin
      .from('projects')
  .select(
    'id,title,slug,description,type,tags,stack,featured,status,project_url,github_url,cover_image_b64,created_at,updated_at'
  )
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('[admin/projects GET] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const fd = await request.formData()

    const title = String(fd.get('title') || '').trim()
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const requestedSlug = String(fd.get('slug') || '').trim()
    const baseSlug = slugify(requestedSlug || title)
    const slug = await ensureUniqueSlug(baseSlug)

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
    const cover_image_b64 = coverEntry instanceof File ? await fileToB64(coverEntry) : null

    const mockupFiles = fd.getAll('mockups').filter((x): x is File => x instanceof File)
    const mockups_b64 = mockupFiles.length ? await Promise.all(mockupFiles.map(fileToB64)) : []

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .insert([
        {
          title,
          slug,
          description,
          type,
          tags,
          stack,
          cover_image_b64,
          mockups_b64,
          project_url,
          github_url,
          featured,
          status,
        },
      ])
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('[admin/projects POST] Error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}