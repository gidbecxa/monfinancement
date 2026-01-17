'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'
import { validateSession, logoutUser } from '@/lib/auth/client'
import Button from '@/components/ui/Button'
import { Plus, LogOut, Calendar } from 'lucide-react'
import { ApplicationOverviewCard } from '@/components/dashboard/ApplicationOverviewCard'
import { ProgressTracker } from '@/components/dashboard/ProgressTracker'
import { DocumentSection } from '@/components/dashboard/DocumentSection'
import { ContactAdvisor } from '@/components/dashboard/ContactAdvisor'
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline'
import { toast } from 'sonner'

interface Application {
  id: string
  application_number: string
  funding_amount: number
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  current_step: number
  created_at: string
  submitted_at?: string
  updated_at: string
  first_name?: string
  last_name?: string
}

interface Document {
  id: string
  document_type: 'identity_front' | 'identity_back' | 'rib'
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  upload_status: 'uploading' | 'completed' | 'failed'
  uploaded_at: string
}

interface TimelineEvent {
  id: string
  type: 'created' | 'submitted' | 'document_uploaded' | 'under_review' | 'approved' | 'rejected'
  title: string
  description?: string
  timestamp: string
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<{ user_id: string; first_name?: string } | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [contactInfo, setContactInfo] = useState({
    whatsappNumber: '+33612345678',
    contactEmail: 'contact@monfinancement.co',
  })
  const [loading, setLoading] = useState(true)

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const session = await validateSession()
      if (!session.is_valid || !session.user_id) {
        router.push('/auth/login')
        return
      }
      
      // Try to fetch first name from the most recent application
      // (first_name in users table stores hashed PIN, not actual name)
      const { data: appData } = await supabase
        .from('funding_applications')
        .select('first_name')
        .eq('user_id', session.user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      const firstName = appData ? (appData as { first_name?: string }).first_name : undefined
      
      setUser({ 
        user_id: session.user_id, 
        first_name: firstName 
      })
      setAuthLoading(false)
    }
    checkAuth()
  }, [router, supabase])

  // Load application and documents
  useEffect(() => {
    if (!user?.user_id) return

    const loadData = async () => {
      setLoading(true)
      try {
        // Load latest application
        const { data: appData, error: appError } = await supabase
          .from('funding_applications')
          .select('*')
          .eq('user_id', user.user_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (appError && appError.code !== 'PGRST116') throw appError

        if (appData) {
          const typedAppData = appData as Application
          setApplication(typedAppData)

          // Load documents for this application
          const { data: docsData, error: docsError } = await supabase
            .from('application_documents')
            .select('*')
            .eq('application_id', typedAppData.id)

          if (docsError) throw docsError
          setDocuments(docsData as Document[] || [])
        }

        // Load contact preferences
        const { data: contactData } = await supabase
          .from('contact_preferences')
          .select('whatsapp_number, contact_email')
          .eq('is_active', true)
          .single()

        if (contactData) {
          const typedContactData = contactData as { whatsapp_number: string; contact_email: string }
          setContactInfo({
            whatsappNumber: typedContactData.whatsapp_number,
            contactEmail: typedContactData.contact_email,
          })
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, supabase])

  const handleLogout = async () => {
    await logoutUser()
    router.push('/auth/login')
  }

  const handleNewApplication = () => {
    router.push('/application/new')
  }

  const handleDocumentUploaded = () => {
    // Reload documents
    if (!application) return
    
    supabase
      .from('application_documents')
      .select('*')
      .eq('application_id', application.id)
      .then(({ data }) => {
        if (data) setDocuments(data as Document[])
      })
  }

  // Generate timeline events from application
  const getTimelineEvents = (): TimelineEvent[] => {
    if (!application) return []

    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'created',
        title: 'Application Created',
        description: `Funding request for ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(application.funding_amount)}`,
        timestamp: application.created_at,
      },
    ]

    // Add document upload events
    documents.forEach((doc, index) => {
      events.push({
        id: `doc-${index}`,
        type: 'document_uploaded',
        title: 'Document Uploaded',
        description: `${doc.file_name}`,
        timestamp: doc.uploaded_at,
      })
    })

    if (application.submitted_at) {
      events.push({
        id: '2',
        type: 'submitted',
        title: 'Application Submitted',
        description: 'Your application has been submitted for review',
        timestamp: application.submitted_at,
      })
    }

    if (application.status === 'under_review') {
      events.push({
        id: '3',
        type: 'under_review',
        title: 'Under Review',
        description: 'Our team is reviewing your application',
        timestamp: application.updated_at,
      })
    }

    if (application.status === 'approved') {
      events.push({
        id: '4',
        type: 'approved',
        title: 'Application Approved',
        description: 'Congratulations! Your funding application has been approved',
        timestamp: application.updated_at,
      })
    }

    if (application.status === 'rejected') {
      events.push({
        id: '4',
        type: 'rejected',
        title: 'Application Not Approved',
        description: 'Unfortunately, your application was not approved',
        timestamp: application.updated_at,
      })
    }

    // Sort by timestamp descending
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Get progress steps - dynamically calculated based on actual data
  const getProgressSteps = () => {
    if (!application) {
      return [
        { id: 1, label: 'Personal Info', completed: false },
        { id: 2, label: 'Financial Details', completed: false },
        { id: 3, label: 'Documents', completed: false },
        { id: 4, label: 'Final Validation', completed: false },
      ]
    }

    const currentStep = application.current_step || 0
    
    // Check if all required documents are uploaded
    const requiredDocs = ['identity_front', 'identity_back', 'rib']
    const uploadedDocTypes = documents.map(doc => doc.document_type)
    const allDocsUploaded = requiredDocs.every(type => uploadedDocTypes.includes(type as any))
    
    return [
      {
        id: 1,
        label: 'Personal Info',
        completed: currentStep >= 1,
      },
      {
        id: 2,
        label: 'Financial Details',
        completed: currentStep >= 2,
      },
      {
        id: 3,
        label: 'Documents',
        completed: allDocsUploaded, // Dynamically check document completion
      },
      {
        id: 4,
        label: 'Final Validation',
        completed: application.status !== 'draft',
      },
    ]
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // No application - show empty state
  if (!loading && !application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome{user?.first_name ? `, ${user.first_name}` : ''}!
              </h1>
              <p className="text-gray-600 mt-1">Start your funding application journey</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No Application Yet</h2>
              <p className="text-gray-600 mb-8">
                Get started with your funding request. Our streamlined process takes just a few minutes to complete.
              </p>
              <Button size="lg" onClick={handleNewApplication}>
                <Plus className="w-5 h-5 mr-2" />
                Start Your Application
              </Button>

              <div className="mt-8 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="font-semibold text-primary-600 text-2xl mb-1">4</div>
                  <div className="text-xs text-gray-600">Simple Steps</div>
                </div>
                <div>
                  <div className="font-semibold text-primary-600 text-2xl mb-1">~10</div>
                  <div className="text-xs text-gray-600">Minutes</div>
                </div>
                <div>
                  <div className="font-semibold text-primary-600 text-2xl mb-1">24h</div>
                  <div className="text-xs text-gray-600">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{user?.first_name ? `, ${user.first_name}` : ''}!
            </h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            {application && application.status === 'draft' && (
              <Button variant="secondary" onClick={() => router.push('/application/new')}>
                Continue Application
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        ) : application ? (
          <div className="space-y-8">
            {/* Application Overview */}
            <ApplicationOverviewCard
              applicationNumber={application.application_number}
              status={application.status}
              fundingAmount={application.funding_amount}
              submittedAt={application.submitted_at}
              createdAt={application.created_at}
            />

            {/* Progress Tracker */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ProgressTracker
                currentStep={application.current_step}
                steps={getProgressSteps()}
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Documents & Contact */}
              <div className="lg:col-span-2 space-y-8">
                {/* Documents Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <DocumentSection
                    applicationId={application.id}
                    documents={documents}
                    onDocumentUploaded={handleDocumentUploaded}
                  />
                </div>

                {/* Contact Advisor */}
                {application.status !== 'draft' && (
                  <ContactAdvisor
                    applicationNumber={application.application_number}
                    whatsappNumber={contactInfo.whatsappNumber}
                    contactEmail={contactInfo.contactEmail}
                  />
                )}
              </div>

              {/* Right Column - Timeline */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                  <ActivityTimeline events={getTimelineEvents()} />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
