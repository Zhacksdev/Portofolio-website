import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 15000) // 15 detik

  return fetch(input, { ...init, signal: controller.signal })
    .finally(() => clearTimeout(t))
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: { fetch: fetchWithTimeout },
})

export type ProjectType = 'web' | 'mobile' | 'desktop' | 'backend' | 'uiux' | 'other'
export type ProjectStatus = 'draft' | 'published'

export type Project = {
  id: string
  title: string
  slug: string

  description: string | null
  content: string | null

  type: ProjectType
  tags: string[] | null
  stack: string[] | null

  cover_image_b64: string | null
  mockups_b64: string[] | null

  cover_image: string | null
  images: string[] | null
  tech_stack: string[] | null

  project_url: string | null
  github_url: string | null

  featured: boolean
  status: ProjectStatus
  created_at: string
  updated_at: string
}