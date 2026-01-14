'use client'

import { useTranslations } from 'next-intl'
import Card from '@/components/ui/Card'
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    total: number
    draft: number
    submitted: number
    under_review: number
    approved: number
    rejected: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const t = useTranslations('dashboard.stats')

  const cards = [
    {
      label: t('total'),
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t('draft'),
      value: stats.draft,
      icon: Loader,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
    },
    {
      label: t('submitted'),
      value: stats.submitted,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: t('underReview'),
      value: stats.under_review,
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: t('approved'),
      value: stats.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: t('rejected'),
      value: stats.rejected,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <Card.Content className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </Card.Content>
          </Card>
        )
      })}
    </div>
  )
}
