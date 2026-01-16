'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ApplicationOverviewCardProps {
  applicationNumber: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  fundingAmount: number
  submittedAt?: string
  createdAt: string
}

const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  submitted: {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  approved: {
    label: 'Approved',
    color: 'bg-success-100 text-success-700 border-success-200',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-error-100 text-error-700 border-error-200',
  },
}

export function ApplicationOverviewCard({
  applicationNumber,
  status,
  fundingAmount,
  submittedAt,
  createdAt,
}: ApplicationOverviewCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(applicationNumber)
    setCopied(true)
    toast.success('Application number copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const statusConfig = STATUS_CONFIG[status]

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-medium text-primary-100 mb-2">Application Number</h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold tracking-wide">{applicationNumber}</span>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Copy application number"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-primary-100 mb-1">Funding Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(fundingAmount)}</p>
        </div>

        <div>
          <p className="text-sm text-primary-100 mb-1">Created</p>
          <p className="text-lg font-semibold">{formatDate(createdAt)}</p>
        </div>

        {submittedAt && (
          <div>
            <p className="text-sm text-primary-100 mb-1">Submitted</p>
            <p className="text-lg font-semibold">{formatDate(submittedAt)}</p>
          </div>
        )}
      </div>

      {status === 'draft' && (
        <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
          <p className="text-sm">
            💡 Your application is in draft mode. Complete all steps and submit to begin the review process.
          </p>
        </div>
      )}

      {status === 'under_review' && (
        <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
          <p className="text-sm">
            ⏳ Your application is currently under review. We&apos;ll notify you once a decision has been made.
          </p>
        </div>
      )}

      {status === 'approved' && (
        <div className="mt-6 p-4 bg-success-500/20 rounded-lg border border-success-400/30">
          <p className="text-sm font-medium">
            ✅ Congratulations! Your funding application has been approved.
          </p>
        </div>
      )}

      {status === 'rejected' && (
        <div className="mt-6 p-4 bg-error-500/20 rounded-lg border border-error-400/30">
          <p className="text-sm">
            ❌ Your application was not approved. Please contact support for more information.
          </p>
        </div>
      )}
    </div>
  )
}
