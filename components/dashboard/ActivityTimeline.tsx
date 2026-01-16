'use client'

import { Clock, CheckCircle, FileText, Upload, Send, AlertCircle } from 'lucide-react'

interface TimelineEvent {
  id: string
  type: 'created' | 'submitted' | 'document_uploaded' | 'under_review' | 'approved' | 'rejected'
  title: string
  description?: string
  timestamp: string
}

interface ActivityTimelineProps {
  events: TimelineEvent[]
}

const EVENT_ICONS = {
  created: FileText,
  submitted: Send,
  document_uploaded: Upload,
  under_review: Clock,
  approved: CheckCircle,
  rejected: AlertCircle,
}

const EVENT_COLORS = {
  created: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-600',
  document_uploaded: 'bg-purple-100 text-purple-600',
  under_review: 'bg-amber-100 text-amber-600',
  approved: 'bg-success-100 text-success-600',
  rejected: 'bg-error-100 text-error-600',
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {events.map((event) => {
            const Icon = EVENT_ICONS[event.type]
            const colorClass = EVENT_COLORS[event.type]

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Icon */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600">{event.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
