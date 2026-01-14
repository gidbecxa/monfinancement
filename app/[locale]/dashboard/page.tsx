'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Plus, FileText } from 'lucide-react'
import { ApplicationsList } from '@/components/dashboard/ApplicationsList'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { ApplicationDetailModal } from '@/components/dashboard/ApplicationDetailModal'
import { ProfileSettings } from '@/components/dashboard/ProfileSettings'

interface Application {
  id: string
  application_number: string
  funding_amount: number
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  current_step: number
  created_at: string
  submitted_at?: string
  updated_at: string
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<{ user_id: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
  })

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/login')
        return
      }
      setUser({ user_id: authUser.id })
      setAuthLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  // Load applications
  useEffect(() => {
    if (!user?.user_id) return

    const loadApplications = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('funding_applications')
          .select('*')
          .eq('user_id', user.user_id)
          .order('created_at', { ascending: false })

        if (error) throw error

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apps = (data || []).map((app: any) => ({
          id: app.id,
          application_number: app.application_number,
          funding_amount: app.funding_amount,
          status: app.status,
          current_step: app.current_step,
          created_at: app.created_at,
          submitted_at: app.submitted_at,
          updated_at: app.updated_at,
        } as Application))
        setApplications(apps)

        // Calculate stats
        const newStats = {
          total: apps.length,
          draft: apps.filter((a) => a.status === 'draft').length,
          submitted: apps.filter((a) => a.status === 'submitted').length,
          under_review: apps.filter((a) => a.status === 'under_review').length,
          approved: apps.filter((a) => a.status === 'approved').length,
          rejected: apps.filter((a) => a.status === 'rejected').length,
        }
        setStats(newStats)
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [user, supabase])

  const handleNewApplication = () => {
    router.push('/application/new')
  }

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
  }

  const handleContinueDraft = () => {
    router.push('/application/new')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-1">{t('subtitle')}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowProfileSettings(true)}
              >
                {t('profileSettings')}
              </Button>
              <Button onClick={handleNewApplication}>
                <Plus className="w-4 h-4 mr-2" />
                {t('newApplication')}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Applications List */}
        <Card className="mt-8">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('myApplications')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('applicationsSubtitle')}</p>
          </Card.Header>
          <Card.Content>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('loadingApplications')}</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noApplications')}</h3>
                <p className="text-gray-600 mb-6">{t('noApplicationsDesc')}</p>
                <Button onClick={handleNewApplication}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('createFirstApplication')}
                </Button>
              </div>
            ) : (
              <ApplicationsList
                applications={applications}
                onView={handleViewApplication}
                onContinue={handleContinueDraft}
              />
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <ProfileSettings
          onClose={() => setShowProfileSettings(false)}
        />
      )}
    </div>
  )
}
