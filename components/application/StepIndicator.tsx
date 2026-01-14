'use client'

import { Check } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export default function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                    isCompleted && 'bg-success-600 text-white',
                    isCurrent && 'bg-primary-800 text-white ring-4 ring-primary-100',
                    isUpcoming && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <span
                  className={cn(
                    'mt-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap',
                    isCompleted && 'text-success-700',
                    isCurrent && 'text-primary-800',
                    isUpcoming && 'text-gray-500'
                  )}
                >
                  {stepLabels[index]}
                </span>
              </div>

              {/* Connecting Line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-4">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      isCompleted && 'bg-success-600',
                      !isCompleted && 'bg-gray-200'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
