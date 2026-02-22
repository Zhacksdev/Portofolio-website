-- Create projects table for portfolio
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  thumbnail_url TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  project_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update/delete (for admin panel)
CREATE POLICY "Allow authenticated insert" ON projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON projects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON projects
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO projects (title, slug, description, long_description, thumbnail_url, images, tags, tech_stack, featured, order_index, project_url, github_url)
VALUES 
  (
    'E-Commerce Platform',
    'e-commerce-platform',
    'A modern e-commerce platform with seamless shopping experience',
    'Full-featured e-commerce platform built with Next.js 15, featuring real-time inventory, secure payments, and an intuitive admin dashboard. Includes advanced search, filtering, and a responsive design that works beautifully on all devices.',
    'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    '["https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=900&fit=crop", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=900&fit=crop"]'::jsonb,
    '["E-Commerce", "Web App", "UI/UX"]'::jsonb,
    '["Next.js", "React", "Tailwind CSS", "Stripe", "Supabase"]'::jsonb,
    true,
    1,
    'https://example.com',
    'https://github.com'
  ),
  (
    'Task Management System',
    'task-management-system',
    'Collaborative task management tool for modern teams',
    'A comprehensive task management system designed for remote teams. Features include real-time collaboration, project timelines, team chat, file sharing, and advanced analytics to track productivity.',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    '["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=900&fit=crop"]'::jsonb,
    '["Productivity", "SaaS", "Collaboration"]'::jsonb,
    '["React", "TypeScript", "Node.js", "PostgreSQL"]'::jsonb,
    true,
    2,
    'https://example.com',
    'https://github.com'
  ),
  (
    'Portfolio Website',
    'portfolio-website',
    'Minimalist portfolio for creative professionals',
    'A clean, minimalist portfolio website template designed for photographers, designers, and artists. Features smooth animations, lazy loading, and an elegant grid layout that puts the work front and center.',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    '["https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=900&fit=crop"]'::jsonb,
    '["Design", "Portfolio", "Creative"]'::jsonb,
    '["Next.js", "Framer Motion", "Tailwind CSS"]'::jsonb,
    false,
    3,
    'https://example.com',
    'https://github.com'
  ),
  (
    'AI Chat Application',
    'ai-chat-application',
    'Intelligent chat application powered by AI',
    'An advanced AI-powered chat application featuring natural language processing, context-aware responses, and multi-modal interactions. Built with cutting-edge AI technology and optimized for speed.',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    '["https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=900&fit=crop"]'::jsonb,
    '["AI", "Chat", "Machine Learning"]'::jsonb,
    '["Next.js", "OpenAI", "Vercel AI SDK", "React"]'::jsonb,
    true,
    4,
    'https://example.com',
    'https://github.com'
  )
ON CONFLICT (slug) DO NOTHING;
