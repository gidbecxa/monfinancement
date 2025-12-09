import { z } from 'zod'

/**
 * Step 0: Funding Amount Schema
 */
export const step0Schema = z.object({
  funding_amount: z
    .number()
    .min(1000, 'Minimum funding amount is 1,000')
    .max(10000000, 'Maximum funding amount is 10,000,000'),
})

/**
 * Step 1: Personal Information Schema
 */
export const step1Schema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name must be less than 100 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name contains invalid characters'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name contains invalid characters'),
  date_of_birth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 18 && age <= 100
    }, 'You must be between 18 and 100 years old'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
})

/**
 * Step 2: Contact & Funding Details Schema
 */
export const step2Schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  residential_address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters'),
  country_of_residence: z
    .string()
    .min(2, 'Please select a country'),
  funding_type: z
    .string()
    .min(2, 'Please select a funding type'),
  funding_reason: z
    .string()
    .min(20, 'Please provide at least 20 characters explaining your funding reason')
    .max(1000, 'Funding reason must be less than 1000 characters'),
  profession: z
    .string()
    .min(2, 'Profession must be at least 2 characters')
    .max(100, 'Profession must be less than 100 characters'),
  monthly_income: z
    .number()
    .min(0, 'Monthly income must be a positive number')
    .max(1000000000, 'Please enter a valid monthly income'),
})

/**
 * Complete Application Schema (all steps combined)
 */
export const completeApplicationSchema = step0Schema
  .merge(step1Schema)
  .merge(step2Schema)

/**
 * Phone Authentication Schema
 */
export const phoneAuthSchema = z.object({
  phone_number: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Use international format (e.g., +33612345678)'),
})

/**
 * OTP Verification Schema
 */
export const otpVerificationSchema = z.object({
  otp: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
})

/**
 * Admin Login Schema
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

/**
 * File Upload Schema
 */
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      'File must be JPEG, PNG, or PDF'
    ),
  document_type: z.enum(['identity_front', 'identity_back', 'rib']),
})

// Export types inferred from schemas
export type Step0FormData = z.infer<typeof step0Schema>
export type Step1FormData = z.infer<typeof step1Schema>
export type Step2FormData = z.infer<typeof step2Schema>
export type CompleteApplicationData = z.infer<typeof completeApplicationSchema>
export type PhoneAuthData = z.infer<typeof phoneAuthSchema>
export type OTPVerificationData = z.infer<typeof otpVerificationSchema>
export type AdminLoginData = z.infer<typeof adminLoginSchema>
export type FileUploadData = z.infer<typeof fileUploadSchema>
