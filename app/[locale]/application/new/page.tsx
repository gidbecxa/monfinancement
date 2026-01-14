'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useRequireAuth } from '@/hooks/useAuth'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import type { Step1FormData, Step2FormData } from '@/lib/validations'
import StepIndicator from '@/components/application/StepIndicator'
import Step0FundingAmount from '@/components/application/Step0FundingAmount'
import Step1PersonalInfo from '@/components/application/Step1PersonalInfo'
import Step2FinancialDetails from '@/components/application/Step2FinancialDetails'
import Step3AutoValidation from '@/components/application/Step3AutoValidation'
import { toast } from 'sonner'

type ApplicationData = {
  fundingAmount: number | null
  firstName: string
  lastName: string
  dateOfBirth: string
  gender?: string
  email: string
  residentialAddress: string
  countryOfResidence: string
  fundingType: string
  fundingReason: string
  profession: string
  monthlyIncome: number
}

export default function ApplicationPage() {
  const t = useTranslations('application')
  const router = useRouter()
  const { user, loading: authLoading } = useRequireAuth()

  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [applicationNumber, setApplicationNumber] = useState<string>('')
  const [fundingTypes, setFundingTypes] = useState<string[]>([])
  const [contactInfo, setContactInfo] = useState({
    whatsappNumber: '',
    whatsappTemplate: '',
    email: '',
    emailSubject: '',
    emailBody: '',
  })

  const [formData, setFormData] = useState<ApplicationData>({
    fundingAmount: null,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    residentialAddress: '',
    countryOfResidence: '',
    fundingType: '',
    fundingReason: '',
    profession: '',
    monthlyIncome: 0,
  })

  const supabase = createBrowserClient<Database>(
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

  // Load funding types and contact preferences
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Get funding types
        const { data: fundingTypesConfig } = await supabase
          .from('site_configuration')
          .select('config_value')
          .eq('config_key', 'funding_types')
          .single()

        if (fundingTypesConfig) {
          const config = fundingTypesConfig as { config_value: string[] }
          setFundingTypes(config.config_value || [])
        }

        // Get contact preferences
        const { data: contactPrefs } = await supabase
          .from('contact_preferences')
          .select('*')
          .eq('is_active', true)
          .single()

        if (contactPrefs) {
          const prefs = contactPrefs as {
            whatsapp_number: string
            whatsapp_message_template: string
            contact_email: string
            email_subject_template: string
          }
          setContactInfo({
            whatsappNumber: prefs.whatsapp_number || '',
            whatsappTemplate: prefs.whatsapp_message_template || '',
            email: prefs.contact_email || '',
            emailSubject: prefs.email_subject_template || '',
            emailBody: '',
          })
        }
      } catch (error) {
        console.error('Error loading config:', error)
      }
    }

    loadConfig()
  }, [supabase])

  // Check for existing draft application
  useEffect(() => {
    const loadDraft = async () => {
      if (!user?.user_id) return

      try {
        const { data } = await supabase
          .from('funding_applications')
          .select('*')
          .eq('user_id', user.user_id)
          .in('status', ['draft', 'submitted'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data) {
          const app = data as {
            id: string
            application_number: string
            current_step: number
            status: string
            funding_amount: number
            first_name: string
            last_name: string
            date_of_birth: string
            gender: string
            email: string
            residential_address: string
            country_of_residence: string
            funding_type: string
            funding_reason: string
            profession: string
            monthly_income: number
          }
          setApplicationId(app.id)
          setApplicationNumber(app.application_number || '')
          setCurrentStep(app.current_step || 0)

          // If already submitted, jump to step 3
          if (app.status === 'submitted') {
            setCurrentStep(3)
          }

          // Restore form data
          setFormData({
            fundingAmount: app.funding_amount ? Number(app.funding_amount) : null,
            firstName: app.first_name || '',
            lastName: app.last_name || '',
            dateOfBirth: app.date_of_birth || '',
            gender: app.gender || '',
            email: app.email || '',
            residentialAddress: app.residential_address || '',
            countryOfResidence: app.country_of_residence || '',
            fundingType: app.funding_type || '',
            fundingReason: app.funding_reason || '',
            profession: app.profession || '',
            monthlyIncome: app.monthly_income ? Number(app.monthly_income) : 0,
          })
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }

    if (!authLoading) {
      loadDraft()
    }
  }, [user, authLoading, supabase])

  const saveDraft = useCallback(async (showToast = true) => {
    if (!applicationId || !user?.user_id) return

    setIsSaving(true)
    try {
      type UpdatePayload = Database['public']['Tables']['funding_applications']['Update']
      
      const updateData: UpdatePayload = {
        funding_amount: formData.fundingAmount || undefined,
        first_name: formData.firstName || undefined,
        last_name: formData.lastName || undefined,
        date_of_birth: formData.dateOfBirth || undefined,
        gender: (formData.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined) || undefined,
        email: formData.email || undefined,
        residential_address: formData.residentialAddress || undefined,
        country_of_residence: formData.countryOfResidence || undefined,
        funding_type: formData.fundingType || undefined,
        funding_reason: formData.fundingReason || undefined,
        profession: formData.profession || undefined,
        monthly_income: formData.monthlyIncome || undefined,
        current_step: currentStep,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('funding_applications')
        // @ts-expect-error - Supabase type inference issue
        .update(updateData)
        .eq('id', applicationId)

      if (error) {
        throw error
      }

      if (showToast) {
        toast.success(t('draftSaved'))
      }
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setIsSaving(false)
    }
  }, [applicationId, formData, currentStep, user, supabase, t])

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!applicationId || currentStep === 0 || currentStep === 3) return

    const autoSave = setInterval(async () => {
      await saveDraft(false)
    }, 30000) // 30 seconds

    return () => clearInterval(autoSave)
  }, [applicationId, formData, currentStep, saveDraft])

  const handleStep0Next = async (amount: number) => {
    if (!user?.user_id) return

    setIsLoading(true)
    try {
      setFormData({ ...formData, fundingAmount: amount })

      // Create new application
      type InsertPayload = Database['public']['Tables']['funding_applications']['Insert']
      const insertData: InsertPayload = {
        user_id: user.user_id,
        funding_amount: amount,
        status: 'draft',
        current_step: 0,
      }
      // Supabase client type inference limitation requires cast
      const { data, error } = await supabase
        .from('funding_applications')
        .insert(insertData as never)
        .select()
        .single()

      if (error) throw error

      const app = data as { id: string; application_number: string }
      setApplicationId(app.id)
      setApplicationNumber(app.application_number || '')
      setCurrentStep(1)
      toast.success(t('applicationStarted'))
    } catch (error) {
      console.error('Error creating application:', error)
      toast.error(t('errorCreatingApplication'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep1Next = async (data: Step1FormData) => {
    setFormData({ ...formData, ...data })
    await saveDraft()
    setCurrentStep(2)
  }

  const handleStep2Next = async (data: Step2FormData) => {
    if (!applicationId) return
    
    setIsLoading(true)
    try {
      setFormData({ ...formData, ...data })

      // Submit application
      const { error } = await supabase
        .from('funding_applications')
        // @ts-expect-error - Supabase type inference issue
        .update({
          email: data.email,
          residential_address: data.residentialAddress,
          country_of_residence: data.countryOfResidence,
          funding_type: data.fundingType,
          funding_reason: data.fundingReason,
          profession: data.profession,
          monthly_income: data.monthlyIncome,
          status: 'submitted',
          current_step: 3,
          submitted_at: new Date().toISOString(),
          step_3_completed_at: new Date().toISOString(),
        })
        .eq('id', applicationId!)

      if (error) throw error

      setCurrentStep(3)
      toast.success(t('applicationSubmitted'))
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error(t('errorSubmitting'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1))
  }

  const handleReturnToDashboard = () => {
    router.push('/dashboard')
  }

  const stepLabels = [
    t('steps.amount'),
    t('steps.personal'),
    t('steps.details'),
    t('steps.complete'),
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {currentStep > 0 && currentStep < 3 && (
        <>
          <StepIndicator
            currentStep={currentStep}
            totalSteps={3}
            stepLabels={[stepLabels[1], stepLabels[2], stepLabels[3]]}
          />
          {isSaving && (
            <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-lg">
              <p className="text-sm text-gray-600">{t('savingDraft')}</p>
            </div>
          )}
        </>
      )}

      {currentStep === 0 && (
        <Step0FundingAmount
          fundingAmount={formData.fundingAmount}
          onFundingAmountChange={(amount) => setFormData({ ...formData, fundingAmount: amount })}
          onNext={() => handleStep0Next(formData.fundingAmount!)}
          isLoading={isLoading}
        />
      )}

      {currentStep === 1 && (
        <Step1PersonalInfo
          data={{
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender as 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined,
          }}
          onNext={handleStep1Next}
          onBack={handleBack}
          isLoading={isLoading}
        />
      )}

      {currentStep === 2 && (
        <Step2FinancialDetails
          data={{
            email: formData.email,
            residentialAddress: formData.residentialAddress,
            countryOfResidence: formData.countryOfResidence,
            fundingType: formData.fundingType,
            fundingReason: formData.fundingReason,
            profession: formData.profession,
            monthlyIncome: formData.monthlyIncome,
          }}
          fundingTypes={fundingTypes}
          onNext={handleStep2Next}
          onBack={handleBack}
          isLoading={isLoading}
        />
      )}

      {currentStep === 3 && (
        <Step3AutoValidation
          applicationNumber={applicationNumber}
          userName={`${formData.firstName} ${formData.lastName}`}
          whatsappNumber={contactInfo.whatsappNumber}
          whatsappTemplate={contactInfo.whatsappTemplate}
          contactEmail={contactInfo.email}
          emailSubjectTemplate={contactInfo.emailSubject}
          emailBodyTemplate={contactInfo.emailBody}
          onReturnToDashboard={handleReturnToDashboard}
        />
      )}
    </div>
  )
}
