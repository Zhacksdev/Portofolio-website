// Script to reset admin password
// Run with: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=password npx tsx scripts/reset-admin-password.ts

import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[v0] Error: Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function resetPassword() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'password'

  try {
    console.log('[v0] Hashing password...')
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)
    
    console.log('[v0] Password hash generated:', password_hash)
    console.log('[v0] Updating admin user...')

    // Update admin user password
    const { data, error } = await supabase
      .from('admin_users')
      .update({ password_hash })
      .eq('email', email)
      .select()

    if (error) {
      console.error('[v0] Error updating admin user:', error)
      throw error
    }

    if (!data || data.length === 0) {
      console.error('[v0] Admin user not found. Creating new one...')
      
      // Create new admin user
      const { data: newData, error: createError } = await supabase
        .from('admin_users')
        .insert([{ email, password_hash, name: 'Admin User' }])
        .select()

      if (createError) {
        console.error('[v0] Error creating admin user:', createError)
        throw createError
      }

      console.log('[v0] Admin user created successfully!')
    } else {
      console.log('[v0] Admin password updated successfully!')
    }

    console.log('Email:', email)
    console.log('Password:', password)
    console.log('\nYou can now login at /admin/login')
  } catch (error) {
    console.error('[v0] Error resetting password:', error)
  }
}

resetPassword()
