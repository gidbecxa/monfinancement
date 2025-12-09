'use client'

import { createBrowserClient as createClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export interface RegisterResponse {
  user_id: string
  pin: string
  message: string
}

export interface LoginResponse {
  user_id: string
  session_token: string
  expires_at: string
  pin_regenerated: boolean
  new_pin: string | null
  message: string
}

export interface SessionValidation {
  is_valid: boolean
  user_id: string | null
  role: string | null
  message: string
}

/**
 * Register a new user with phone number
 * Returns user_id and 6-digit PIN that must be saved by user
 */
export async function registerUser(phoneNumber: string): Promise<RegisterResponse> {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name: string, value: string) {
          document.cookie = `${name}=${value}; path=/`
        },
        remove(name: string) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
        },
      },
    }
  )
  
  const { data, error } = await supabase
    .rpc('register_user', { p_phone_number: phoneNumber })
    .single()

  if (error) {
    throw new Error(error.message || 'Registration failed')
  }

  return data as RegisterResponse
}

/**
 * Authenticate user with phone number and PIN
 * Returns session token and handles PIN regeneration if needed
 */
export async function loginUser(
  phoneNumber: string,
  pin: string,
  ipAddress?: string,
  userAgent?: string
): Promise<LoginResponse> {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name: string, value: string) {
          document.cookie = `${name}=${value}; path=/`
        },
        remove(name: string) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
        },
      },
    }
  )
  
  const { data, error } = await supabase
    .rpc('authenticate_user', {
      p_phone_number: phoneNumber,
      p_pin: pin,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    })
    .single()

  if (error) {
    throw new Error(error.message || 'Login failed')
  }

  // Store session token in localStorage
  if (data.session_token) {
    localStorage.setItem('session_token', data.session_token)
    localStorage.setItem('session_expires_at', data.expires_at)
    localStorage.setItem('user_id', data.user_id)
  }

  return data as LoginResponse
}

/**
 * Validate current session token
 */
export async function validateSession(sessionToken?: string): Promise<SessionValidation> {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name: string, value: string) {
          document.cookie = `${name}=${value}; path=/`
        },
        remove(name: string) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
        },
      },
    }
  )
  
  const token = sessionToken || localStorage.getItem('session_token')
  
  if (!token) {
    return {
      is_valid: false,
      user_id: null,
      role: null,
      message: 'No session token found',
    }
  }

  const { data, error } = await supabase
    .rpc('validate_session', { p_session_token: token })
    .single()

  if (error || !data?.is_valid) {
    // Clear invalid session
    localStorage.removeItem('session_token')
    localStorage.removeItem('session_expires_at')
    localStorage.removeItem('user_id')
    
    return {
      is_valid: false,
      user_id: null,
      role: null,
      message: error?.message || data?.message || 'Session expired',
    }
  }

  return data as SessionValidation
}

/**
 * Logout user - invalidate session token
 */
export async function logoutUser(): Promise<void> {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1]
        },
        set(name: string, value: string) {
          document.cookie = `${name}=${value}; path=/`
        },
        remove(name: string) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
        },
      },
    }
  )
  const token = localStorage.getItem('session_token')
  
  if (token) {
    await supabase.rpc('logout_user', { p_session_token: token })
  }

  // Clear local storage
  localStorage.removeItem('session_token')
  localStorage.removeItem('session_expires_at')
  localStorage.removeItem('user_id')
}

/**
 * Get current user ID from localStorage
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('user_id')
}

/**
 * Check if user is logged in
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('session_token')
  const expiresAt = localStorage.getItem('session_expires_at')
  
  if (!token || !expiresAt) return false
  
  // Check if token is expired
  const expiryDate = new Date(expiresAt)
  return expiryDate > new Date()
}
