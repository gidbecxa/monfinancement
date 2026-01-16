'use client'

import { MessageCircle, Mail, ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ContactAdvisorProps {
  whatsappNumber?: string
  whatsappTemplate?: string
  contactEmail?: string
  emailSubject?: string
  emailBody?: string
  applicationNumber?: string
}

export function ContactAdvisor({
  whatsappNumber = '+33612345678',
  whatsappTemplate = 'Hello, I need assistance with my funding application',
  contactEmail = 'contact@monfinancement.co',
  emailSubject = 'Assistance Request',
  emailBody = 'Hello,\n\nI need assistance with my funding application.\n\nApplication Number: {{applicationNumber}}\n\nThank you.',
  applicationNumber,
}: ContactAdvisorProps) {
  
  const handleWhatsAppClick = () => {
    const message = whatsappTemplate + (applicationNumber ? ` #${applicationNumber}` : '')
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleEmailClick = () => {
    const subject = emailSubject + (applicationNumber ? ` - #${applicationNumber}` : '')
    const body = emailBody.replace('{{applicationNumber}}', applicationNumber || 'N/A')
    const url = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = url
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <MessageCircle className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Assistance?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our advisors are here to help you with your funding application. Contact us via WhatsApp or email for quick support.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleWhatsAppClick}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white border-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Support
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleEmailClick}
              className="border-primary-300 hover:border-primary-400 hover:bg-primary-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
          </div>

          {applicationNumber && (
            <p className="text-xs text-gray-500 mt-3">
              Your application number <span className="font-mono font-semibold text-gray-700">#{applicationNumber}</span> will be included in your message.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
