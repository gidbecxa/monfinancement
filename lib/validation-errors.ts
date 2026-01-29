import { z } from 'zod'

/**
 * Validation error translation keys
 * These keys map to the translation files under "validation" namespace
 */
export const validationErrors = {
  // Step 0 - Funding Amount
  minAmount: 'validation.minAmount',
  maxAmount: 'validation.maxAmount',
  
  // Step 1 - Personal Info
  firstNameMin: 'validation.firstNameMin',
  firstNameMax: 'validation.firstNameMax',
  firstNameInvalid: 'validation.firstNameInvalid',
  lastNameMin: 'validation.lastNameMin',
  lastNameMax: 'validation.lastNameMax',
  lastNameInvalid: 'validation.lastNameInvalid',
  ageRequirement: 'validation.ageRequirement',
  
  // Step 2 - Contact & Funding
  invalidEmail: 'validation.invalidEmail',
  addressMin: 'validation.addressMin',
  addressMax: 'validation.addressMax',
  countryRequired: 'validation.countryRequired',
  fundingTypeRequired: 'validation.fundingTypeRequired',
  fundingReasonMin: 'validation.fundingReasonMin',
  fundingReasonMax: 'validation.fundingReasonMax',
  professionMin: 'validation.professionMin',
  professionMax: 'validation.professionMax',
  monthlyIncomeMin: 'validation.monthlyIncomeMin',
  monthlyIncomeMax: 'validation.monthlyIncomeMax',
  
  // Auth
  invalidPhoneFormat: 'validation.invalidPhoneFormat',
  otpLength: 'validation.otpLength',
  otpNumbers: 'validation.otpNumbers',
} as const

/**
 * Create Zod schemas with translation keys instead of hardcoded messages
 * The actual translation will be done at runtime by the form components
 */

export const step0SchemaKeys = z.object({
  funding_amount: z
    .number()
    .min(1000, validationErrors.minAmount)
    .max(5000000, validationErrors.maxAmount),
})

export const step1SchemaKeys = z.object({
  firstName: z
    .string()
    .min(2, validationErrors.firstNameMin)
    .max(100, validationErrors.firstNameMax)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, validationErrors.firstNameInvalid),
  lastName: z
    .string()
    .min(2, validationErrors.lastNameMin)
    .max(100, validationErrors.lastNameMax)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, validationErrors.lastNameInvalid),
  dateOfBirth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 18 && age <= 100
    }, validationErrors.ageRequirement),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
})

export const step2SchemaKeys = z.object({
  email: z
    .string()
    .email(validationErrors.invalidEmail)
    .toLowerCase(),
  residentialAddress: z
    .string()
    .min(10, validationErrors.addressMin)
    .max(500, validationErrors.addressMax),
  countryOfResidence: z
    .string()
    .min(2, validationErrors.countryRequired),
  fundingType: z
    .string()
    .min(2, validationErrors.fundingTypeRequired),
  fundingReason: z
    .string()
    .min(1, validationErrors.fundingReasonMin)
    .max(1000, validationErrors.fundingReasonMax),
  profession: z
    .string()
    .min(2, validationErrors.professionMin)
    .max(100, validationErrors.professionMax),
  monthlyIncome: z
    .number()
    .min(0, validationErrors.monthlyIncomeMin)
    .max(1000000000, validationErrors.monthlyIncomeMax),
})

export const phoneAuthSchemaKeys = z.object({
  phone_number: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, validationErrors.invalidPhoneFormat),
})

export const otpVerificationSchemaKeys = z.object({
  otp: z
    .string()
    .length(6, validationErrors.otpLength)
    .regex(/^\d{6}$/, validationErrors.otpNumbers),
})

/**
 * Helper function to translate validation errors
 * Use this with react-hook-form to translate Zod error messages
 * 
 * @param errors - The errors object from react-hook-form
 * @param t - The translation function from next-intl
 * @returns Translated error messages
 */
export function translateValidationError(errorMessage: string | undefined, t: (key: string, values?: Record<string, string | number>) => string): string | undefined {
  if (!errorMessage) return undefined
  
  // Check if it's a translation key
  if (errorMessage.startsWith('validation.')) {
    // Handle errors with parameters (like min/max amounts)
    if (errorMessage === validationErrors.minAmount) {
      return t(errorMessage, { min: '1,000' })
    }
    if (errorMessage === validationErrors.maxAmount) {
      return t(errorMessage, { max: '5,000,000' })
    }
    
    // For other keys, just translate directly
    return t(errorMessage)
  }
  
  // If it's not a translation key, return as is (fallback for legacy errors)
  return errorMessage
}
