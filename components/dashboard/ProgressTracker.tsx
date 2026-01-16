'use client'

import { Check } from 'lucide-react'

interface ProgressTrackerProps {
  currentStep: number
  steps: {
    id: number
    label: string
    completed: boolean
  }[]
}

export function ProgressTracker({ currentStep, steps }: ProgressTrackerProps) {
  const completedSteps = steps.filter(s => s.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Application Progress</span>
          <span className="text-sm font-medium text-primary-600">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary-600 transition-all duration-500"
          style={{ width: `${(completedSteps / (steps.length - 1)) * 100}%`, zIndex: 0 }}
        />

        <div className="relative grid grid-cols-4 gap-4" style={{ zIndex: 1 }}>
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                  ${step.completed
                    ? 'bg-primary-600 text-white'
                    : currentStep === index
                    ? 'bg-white border-2 border-primary-600 text-primary-600'
                    : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              
              {/* Label */}
              <span
                className={`
                  text-xs text-center font-medium
                  ${step.completed || currentStep === index
                    ? 'text-gray-900'
                    : 'text-gray-500'
                  }
                `}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
