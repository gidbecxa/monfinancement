import { z } from 'zod'

/**
 * Step 0: Funding Amount Schema
 */
export const step0Schema = z.object({
  funding_amount: z
    .number()
    .min(1000, 'validation.minAmount')
    .max(5000000, 'validation.maxAmount'),
})

/**
 * Step 1: Personal Information Schema
 */
export const step1Schema = z.object({
  firstName: z
    .string()
    .min(2, 'validation.firstNameMin')
    .max(100, 'validation.firstNameMax')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'validation.firstNameInvalid'),
  lastName: z
    .string()
    .min(2, 'validation.lastNameMin')
    .max(100, 'validation.lastNameMax')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'validation.lastNameInvalid'),
  dateOfBirth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 18 && age <= 100
    }, 'validation.ageRequirement'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
})

/**
 * Step 2: Contact & Funding Details Schema
 */
export const step2Schema = z.object({
  email: z
    .string()
    .email('validation.invalidEmail')
    .toLowerCase(),
  residentialAddress: z
    .string()
    .min(10, 'validation.addressMin')
    .max(500, 'validation.addressMax'),
  countryOfResidence: z
    .string()
    .min(2, 'validation.countryRequired'),
  fundingType: z
    .string()
    .min(2, 'validation.fundingTypeRequired'),
  fundingReason: z
    .string()
    .min(1, 'validation.fundingReasonMin')
    .max(1000, 'validation.fundingReasonMax'),
  profession: z
    .string()
    .min(2, 'validation.professionMin')
    .max(100, 'validation.professionMax'),
  monthlyIncome: z
    .number()
    .min(0, 'validation.monthlyIncomeMin')
    .max(1000000000, 'validation.monthlyIncomeMax'),
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
    .regex(/^\+[1-9]\d{1,14}$/, 'validation.invalidPhoneFormat'),
})

/**
 * OTP Verification Schema
 */
export const otpVerificationSchema = z.object({
  otp: z
    .string()
    .length(6, 'validation.otpLength')
    .regex(/^\d{6}$/, 'validation.otpNumbers'),
})

/**
 * Admin Login Schema
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email('validation.invalidEmail'),
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
