/**
 * Generate unique 8-character application number
 * Format: AXBXCXDX where X is alphanumeric (excluding confusing chars)
 * Last character rotates 0-9
 */
export function generateApplicationNumber(previousLastDigit?: number): string {
  // Characters pool excluding confusing ones (0, O, 1, I, l)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  
  // Generate 7 random characters
  let result = ''
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // Add rotating last digit (0-9)
  const lastDigit = previousLastDigit !== undefined 
    ? (previousLastDigit + 1) % 10 
    : Math.floor(Math.random() * 10)
  
  return result + lastDigit
}

/**
 * Format phone number to E.164 international standard
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+1'): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Add country code if not present
  if (!phone.startsWith('+')) {
    return `${countryCode}${cleaned}`
  }
  
  return `+${cleaned}`
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic validation for international format
  const phoneRegex = /^\+[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(date: string | Date, locale: string = 'fr-FR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * Validate age (must be 18-100)
 */
export function isValidAge(dateOfBirth: string): boolean {
  const age = calculateAge(dateOfBirth)
  return age >= 18 && age <= 100
}

/**
 * Validate file size (max 10MB for identity, 5MB for RIB)
 */
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'text-gray-600 bg-gray-100',
    submitted: 'text-blue-600 bg-blue-100',
    under_review: 'text-warning-600 bg-warning-100',
    approved: 'text-success-600 bg-success-100',
    rejected: 'text-error-600 bg-error-100',
  }
  return colors[status] || 'text-gray-600 bg-gray-100'
}

/**
 * Debounce function for input validation
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Class name utility for conditional classes
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
