// Script to create an admin user
// Run with: npx tsx scripts/create-admin.ts

import bcrypt from 'bcryptjs'
import { supabase } from '../lib/supabase'

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Admin'

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // Insert admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          email,
          password_hash,
          name,
        },
      ])
      .select()

    if (error) {
      if (error.code === '23505') {
        console.error('Admin user already exists')
        return
      }
      throw error
    }

    console.log('Admin user created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Please change the password after first login')
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdmin()
