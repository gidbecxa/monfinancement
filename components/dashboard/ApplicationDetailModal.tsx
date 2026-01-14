'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { format } from 'date-fns'
import { fr, es, de, it, pt, enUS } from 'date-fns/locale'
import { X, Calendar, DollarSign, User, Mail, MapPin, Globe, Briefcase, FileText } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

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
  date_of_birth?: string
  gender?: string
  email?: string
  residential_address?: string
  country_of_residence?: string
  funding_type?: string
  funding_reason?: string
  profession?: string
  monthly_income?: number
}

interface ApplicationDetailModalProps {
  application: Application
  onClose: () => void
}

export function ApplicationDetailModal({ application, onClose }: ApplicationDetailModalProps) {
  const t = useTranslations('dashboard.detail')
  const tStatus = useTranslations('dashboard.statuses')
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', {
      locale: localeMap[locale] || enUS,
    })
  }

  const getStatusColor = (status: Application['status']) => {
    const colors = {
      draft: 'text-gray-700 bg-gray-100',
      submitted: 'text-yellow-700 bg-yellow-100',
      under_review: 'text-orange-700 bg-orange-100',
      approved: 'text-green-700 bg-green-100',
      rejected: 'text-red-700 bg-red-100',
    }
    return colors[status]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {application.application_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Timeline */}
          <Card>
            <Card.Content className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('status')}</p>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {tStatus(application.status)}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{t('created')}: {formatDate(application.created_at)}</span>
                  </div>
                  {application.submitted_at && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{t('submitted')}: {formatDate(application.submitted_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Funding Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('fundingInfo')}</h3>
            <Card>
              <Card.Content className="p-4 space-y-3">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">{t('amount')}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(application.funding_amount)}
                    </p>
                  </div>
                </div>
                {application.funding_type && (
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{t('fundingType')}</p>
                      <p className="text-base text-gray-900">{application.funding_type}</p>
                    </div>
                  </div>
                )}
                {application.funding_reason && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('fundingReason')}</p>
                    <p className="text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {application.funding_reason}
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Personal Information */}
          {application.first_name && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('personalInfo')}</h3>
              <Card>
                <Card.Content className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">{t('fullName')}</p>
                        <p className="text-base text-gray-900">
                          {application.first_name} {application.last_name}
                        </p>
                      </div>
                    </div>
                    {application.date_of_birth && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">{t('dateOfBirth')}</p>
                          <p className="text-base text-gray-900">
                            {formatDate(application.date_of_birth)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}

          {/* Contact Information */}
          {application.email && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('contactInfo')}</h3>
              <Card>
                <Card.Content className="p-4 space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">{t('email')}</p>
                      <p className="text-base text-gray-900">{application.email}</p>
                    </div>
                  </div>
                  {application.residential_address && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">{t('address')}</p>
                        <p className="text-base text-gray-900">{application.residential_address}</p>
                      </div>
                    </div>
                  )}
                  {application.country_of_residence && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">{t('country')}</p>
                        <p className="text-base text-gray-900">{application.country_of_residence}</p>
                      </div>
                    </div>
                  )}
                </Card.Content>
              </Card>
            </div>
          )}

          {/* Financial Information */}
          {application.profession && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('financialInfo')}</h3>
              <Card>
                <Card.Content className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">{t('profession')}</p>
                        <p className="text-base text-gray-900">{application.profession}</p>
                      </div>
                    </div>
                    {application.monthly_income && (
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">{t('monthlyIncome')}</p>
                          <p className="text-base text-gray-900">
                            {formatCurrency(application.monthly_income)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
