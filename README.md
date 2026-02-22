# Minimalist Portfolio Website

A modern, industrial-style portfolio website inspired by Behance's design system. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Minimalist Industrial Design**: Clean, Behance-inspired aesthetic with generous whitespace
- **Light & Dark Mode**: Seamless theme switching with persistent preferences
- **Admin Panel**: Secure dashboard for manual project uploads
- **Responsive**: Mobile-first design that works on all devices
- **Database-Powered**: Projects stored in Supabase for easy management

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth with bcrypt
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Inter (body), Space Grotesk (display)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Create Admin User**
   
   Set environment variables for admin credentials:
   ```
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_password
   ADMIN_NAME=Admin
   ```
   
   Then run:
   ```bash
   npx tsx scripts/create-admin.ts
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access Admin Panel**
   
   Navigate to `/admin/login` and use your admin credentials.

## Project Structure

```
app/
├── page.tsx              # Homepage
├── projects/
│   ├── page.tsx         # Projects grid
│   └── [slug]/          # Project detail
├── about/               # About page
├── contact/             # Contact page
├── admin/               # Admin panel
│   ├── login/           # Admin login
│   └── dashboard/       # Admin dashboard
└── api/                 # API routes

components/
├── navigation.tsx       # Main navigation
├── theme-provider.tsx   # Theme context
├── theme-toggle.tsx     # Theme switcher
└── admin/              # Admin components

lib/
└── supabase.ts         # Supabase client

scripts/
└── create-admin.ts     # Admin user setup
```

## Database Schema

### Projects Table
- id (UUID, Primary Key)
- title (TEXT)
- slug (TEXT, Unique)
- description (TEXT)
- content (TEXT)
- cover_image (TEXT)
- images (TEXT[])
- tags (TEXT[])
- tech_stack (TEXT[])
- project_url (TEXT)
- github_url (TEXT)
- featured (BOOLEAN)
- status (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### Admin Users Table
- id (UUID, Primary Key)
- email (TEXT, Unique)
- password_hash (TEXT)
- name (TEXT)
- created_at (TIMESTAMPTZ)

## Customization

### Design Tokens
Edit `app/globals.css` to customize colors and spacing.

### Fonts
Modify fonts in `app/layout.tsx` and `tailwind.config.ts`.

### Content
Update placeholder content in:
- `app/about/page.tsx`
- `app/contact/page.tsx`

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Security Notes

- Admin routes are protected with HTTP-only cookies
- Passwords are hashed with bcrypt
- Row Level Security (RLS) enabled on Supabase
- Change default admin credentials after first login

## License

MIT
