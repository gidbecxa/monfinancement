'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { CheckCircle, Copy, Check, Mail, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Step3Props {
  applicationNumber: string
  userName: string
  whatsappNumber: string
  whatsappTemplate: string
  contactEmail: string
  emailSubjectTemplate: string
  emailBodyTemplate: string
  onReturnToDashboard: () => void
}

export default function Step3AutoValidation({
  applicationNumber,
  userName,
  whatsappNumber,
  whatsappTemplate,
  contactEmail,
  emailSubjectTemplate,
  emailBodyTemplate,
  onReturnToDashboard,
}: Step3Props) {
  const t = useTranslations('application')
  const [copied, setCopied] = useState(false)

  const handleCopyApplicationNumber = () => {
    navigator.clipboard.writeText(applicationNumber)
    setCopied(true)
    toast.success(t('step3.applicationNumberCopied'))
    setTimeout(() => setCopied(false), 2000)
  }

  // Replace placeholders in templates
  const whatsappMessage = whatsappTemplate
    .replace('[APPLICATION_NUMBER]', applicationNumber)
    .replace('[USER_NAME]', userName)

  const emailSubject = emailSubjectTemplate
    .replace('[APPLICATION_NUMBER]', applicationNumber)
    .replace('[USER_NAME]', userName)

  const emailBody = emailBodyTemplate
    .replace('[APPLICATION_NUMBER]', applicationNumber)
    .replace('[USER_NAME]', userName)

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleEmailClick = () => {
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoUrl
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-12 h-12 text-success-600" />
          </div>
          <CardTitle className="text-3xl md:text-4xl text-success-700">
            {t('step3.title')}
          </CardTitle>
          <CardDescription className="text-lg mt-3">
            {t('step3.description')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Application Number Display */}
          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6">
            <p className="text-sm font-medium text-gray-700 text-center mb-3">
              {t('step3.applicationNumberLabel')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl md:text-4xl font-bold text-primary-800 tracking-wider font-mono">
                {applicationNumber}
              </p>
              <button
                onClick={handleCopyApplicationNumber}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                title={t('step3.copyApplicationNumber')}
              >
                {copied ? (
                  <Check className="w-6 h-6 text-success-600" />
                ) : (
                  <Copy className="w-6 h-6 text-primary-600" />
                )}
              </button>
            </div>
            <p className="text-xs text-center text-gray-600 mt-3">
              {t('step3.saveApplicationNumber')}
            </p>
          </div>

          {/* Contact Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <p className="text-sm font-medium text-blue-900 mb-2">
              📋 {t('step3.nextStepsTitle')}
            </p>
            <p className="text-sm text-blue-800">
              {t('step3.nextStepsMessage')}
            </p>
          </div>

          {/* Contact Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 text-center mb-4">
              {t('step3.contactAdvisor')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-success-600 hover:bg-success-700 text-white"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('step3.contactWhatsApp')}
              </Button>

              <Button
                onClick={handleEmailClick}
                variant="outline"
                className="w-full border-2"
                size="lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t('step3.contactEmail')}
              </Button>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <p className="text-sm font-medium text-warning-800 mb-2">
              ⚠️ {t('step3.importantNotice')}
            </p>
            <ul className="text-xs text-warning-700 space-y-1 list-disc list-inside">
              <li>{t('step3.notice1')}</li>
              <li>{t('step3.notice2')}</li>
              <li>{t('step3.notice3')}</li>
            </ul>
          </div>

          {/* Return to Dashboard */}
          <div className="pt-4">
            <Button
              onClick={onReturnToDashboard}
              variant="ghost"
              className="w-full"
            >
              {t('step3.returnToDashboard')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
