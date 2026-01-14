'use client'

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type FundingApplication = Database['public']['Tables']['funding_applications']['Row']

export interface RedirectInfo {
  path: string
  reason: 'new_user' | 'incomplete_application' | 'has_application'
}

/**
 * Determines where to redirect user after login based on their application status
 */
export async function getPostLoginRedirect(userId: string): Promise<RedirectInfo> {
  const supabase = createClient()
  
  try {
    // Check if user has any funding applications
    const { data: applications, error } = await supabase
      .from('funding_applications')
      .select('id, current_step, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) {
      console.error('Error fetching applications:', error)
      // On error, default to starting a new application
      return {
        path: '/application/step-0',
        reason: 'new_user'
      }
    }
    
    // No applications - redirect to start new application
    if (!applications || applications.length === 0) {
      return {
        path: '/application/step-0',
        reason: 'new_user'
      }
    }
    
    const latestApplication = applications[0] as Pick<FundingApplication, 'id' | 'current_step' | 'status'>
    
    // If application is submitted/completed, go to dashboard
    if (latestApplication.status !== 'draft') {
      return {
        path: '/dashboard',
        reason: 'has_application'
      }
    }
    
    // If application is in draft, continue from where they left off
    const currentStep = latestApplication.current_step || 0
    
    // If they completed all steps but status is still draft (shouldn't happen, but just in case)
    if (currentStep >= 4) {
      return {
        path: '/dashboard',
        reason: 'has_application'
      }
    }
    
    return {
      path: `/application/step-${currentStep}`,
      reason: 'incomplete_application'
    }
    
  } catch (error) {
    console.error('Unexpected error in getPostLoginRedirect:', error)
    // On unexpected error, default to new application
    return {
      path: '/application/step-0',
      reason: 'new_user'
    }
  }
}
