'use client'

import { useState, useEffect } from 'react'
import { validateSession, logoutUser, type SessionValidation } from '@/lib/auth/client'
import { useRouter } from '@/i18n/routing'

export function useAuth() {
  const [session, setSession] = useState<SessionValidation | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const validation = await validateSession()
      setSession(validation)
    } catch (error) {
      console.error('Session validation error:', error)
      setSession({
        is_valid: false,
        user_id: null,
        role: null,
        message: 'Session check failed',
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await logoutUser()
    setSession({
      is_valid: false,
      user_id: null,
      role: null,
      message: 'Logged out',
    })
    router.push('/auth/login')
  }

  return {
    user: session,
    isAuthenticated: session?.is_valid || false,
    isAdmin: session?.role === 'admin',
    loading,
    logout,
    refreshSession: checkSession,
  }
}

/**
 * Hook to protect routes - redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo = '/auth/login') {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, redirectTo, router])

  return { isAuthenticated, loading, user }
}

/**
 * Hook to protect admin routes
 */
export function useRequireAdmin() {
  const { isAuthenticated, isAdmin, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
      } else if (!isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isAdmin, loading, router])

  return { isAuthenticated, isAdmin, loading, user }
}
