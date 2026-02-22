import { Navigation } from '@/components/navigation'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/supabase'
import ProjectGridClient from './project-grid-client'

async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(
      // ambil field yang dibutuhkan saja (hindari mockups_b64)
      'id,title,slug,description,tags,type,stack,cover_image_b64,featured,status,created_at'
    )
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[projects] Error fetching projects:', error)
    return []
  }

  return data as Project[]
}

export default async function ProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="mb-10 md:mb-14">
          <p className="text-sm text-muted-foreground mb-4">Projects</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4">
            All Projects
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A collection of published work — filter by type and tech stack.
          </p>
        </div>

        <ProjectGridClient projects={projects} />

        <footer className="border-t border-border mt-16">
          <div className="py-8">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}