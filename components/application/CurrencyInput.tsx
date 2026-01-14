'use client'

import { forwardRef, useState } from 'react'
import { DollarSign, Euro } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  currency?: 'EUR' | 'USD'
  onValueChange?: (value: number | null) => void
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, error, helperText, currency = 'EUR', className, onValueChange, value, ...props }, ref) => {
    // Format number with thousand separators
    const formatNumber = (num: string): string => {
      const cleanNum = num.replace(/\D/g, '')
      if (!cleanNum) return ''
      
      const number = parseInt(cleanNum, 10)
      return number.toLocaleString('fr-FR')
    }

    // Parse formatted string back to number
    const parseNumber = (formatted: string): number | null => {
      const cleanNum = formatted.replace(/\D/g, '')
      if (!cleanNum) return null
      return parseInt(cleanNum, 10)
    }

    // Compute display value from prop value
    const getDisplayValue = (): string => {
      if (value === undefined || value === null) return ''
      const numValue = typeof value === 'number' ? value : parseNumber(String(value))
      return numValue ? formatNumber(String(numValue)) : ''
    }

    const [localValue, setLocalValue] = useState(getDisplayValue())
    const displayValue = localValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formatted = formatNumber(inputValue)
      setLocalValue(formatted)
      
      const numericValue = parseNumber(formatted)
      onValueChange?.(numericValue)
    }

    const CurrencyIcon = currency === 'EUR' ? Euro : DollarSign

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <CurrencyIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            className={cn(
              'w-full pl-12 pr-4 py-3 text-2xl font-semibold border-2 rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-4 focus:ring-primary-100',
              !error && 'border-gray-200 focus:border-primary-600',
              error && 'border-error-500 focus:border-error-600 focus:ring-error-100',
              className
            )}
            {...props}
          />
        </div>

        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-600">{helperText}</p>
        )}

        {error && (
          <p className="mt-2 text-sm text-error-600 font-medium">{error}</p>
        )}
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'

export default CurrencyInput
