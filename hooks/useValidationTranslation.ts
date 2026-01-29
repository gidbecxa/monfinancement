import { useTranslations } from 'next-intl'
import { FieldError } from 'react-hook-form'

/**
 * Custom hook to translate validation error messages from react-hook-form
 * Handles both translation keys (validation.xxx) and fallback plain text
 */
export function useValidationTranslation() {
  const t = useTranslations()

  /**
   * Translate a single field error message
   * @param error - The field error from react-hook-form
   * @returns Translated error message or undefined
   */
  const translateError = (error: FieldError | undefined): string | undefined => {
    if (!error?.message) return undefined

    const message = error.message

    // Check if it's a translation key
    if (message.startsWith('validation.')) {
      // Handle special cases with parameters
      if (message === 'validation.minAmount') {
        return t(message, { min: '1,000' })
      }
      if (message === 'validation.maxAmount') {
        return t(message, { max: '5,000,000' })
      }

      // For other validation keys, translate directly
      return t(message)
    }

    // Fallback: return the message as is (for non-translated errors)
    return message
  }

  return { translateError }
}
