'use client'

import { useTranslations } from 'next-intl'
import { formatDistance } from 'date-fns'
import { fr, es, de, it, pt, enUS } from 'date-fns/locale'
import { useLocale } from 'next-intl'
import { Eye, Edit, Calendar, DollarSign } from 'lucide-react'
import Button from '@/components/ui/Button'

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

interface ApplicationsListProps {
  applications: Application[]
  onView: (application: Application) => void
  onContinue: (application: Application) => void
}

export function ApplicationsList({ applications, onView, onContinue }: ApplicationsListProps) {
  const t = useTranslations('dashboard')
  const locale = useLocale()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localeMap: Record<string, any> = {
    en: enUS,
    fr: fr,
    es: es,
    de: de,
    it: it,
    pt: pt,
  }

  const getStatusBadge = (status: Application['status']) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-orange-100 text-orange-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {t(`statuses.${status}`)}
      </span>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true,
      locale: localeMap[locale] || enUS,
    })
  }

  return (
    <div className="divide-y divide-gray-200">
      {applications.map((application) => (
        <div
          key={application.id}
          className="py-4 hover:bg-gray-50 transition-colors rounded-lg px-4 -mx-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {application.application_number}
                </h3>
                {getStatusBadge(application.status)}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-medium">{formatCurrency(application.funding_amount)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{t('created')} {formatDate(application.created_at)}</span>
                </div>
              </div>

              {application.status === 'draft' && (
                <p className="text-sm text-amber-600 mt-2">
                  {t('draftProgress', { step: application.current_step, total: 3 })}
                </p>
              )}
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2">
              {application.status === 'draft' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onContinue(application)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('continueDraft')}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(application)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('viewDetails')}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
