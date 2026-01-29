'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step2Schema, type Step2FormData } from '@/lib/validations'
import { useValidationTranslation } from '@/hooks/useValidationTranslation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import CurrencyInput from './CurrencyInput'
import { Briefcase, Mail, MapPin } from 'lucide-react'
import { useState } from 'react'

interface Step2Props {
  data: Partial<Step2FormData>
  fundingTypes: string[]
  onNext: (data: Step2FormData) => void
  onBack: () => void
  isLoading?: boolean
}

export default function Step2FinancialDetails({
  data,
  fundingTypes,
  onNext,
  onBack,
  isLoading = false,
}: Step2Props) {
  const t = useTranslations('application')
  const tFundingTypes = useTranslations('fundingTypes')
  const { translateError } = useValidationTranslation()
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(data.monthlyIncome || null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: 'onBlur',
    defaultValues: data,
  })

  // Watch funding reason for character counter
  // Note: React Compiler will skip memoization for this component due to react-hook-form's watch() API
  const fundingReason = watch('fundingReason') || ''
  const maxReasonLength = 1000

  const onSubmit = (formData: Step2FormData) => {
    onNext({ ...formData, monthlyIncome: monthlyIncome || 0 })
  }

  const handleMonthlyIncomeChange = (value: number | null) => {
    setMonthlyIncome(value)
    setValue('monthlyIncome', value || 0, { shouldValidate: true })
  }

  return (
    <div className="px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-primary-800" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            {t('step2.title')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('step2.description')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-600" />
                {t('step2.sections.contact')}
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <Input
                  label={t('step2.fields.email.label')}
                  type="email"
                  placeholder={t('step2.fields.email.placeholder')}
                  error={translateError(errors.email)}
                  disabled={isLoading}
                  {...register('email')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('step2.fields.address.label')}
                  </label>
                  <textarea
                    {...register('residentialAddress')}
                    rows={3}
                    placeholder={t('step2.fields.address.placeholder')}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-600 transition-all duration-200 resize-none"
                  />
                  {errors.residentialAddress && (
                    <p className="mt-2 text-sm text-error-600">{translateError(errors.residentialAddress)}</p>
                  )}
                </div>

                <Input
                  label={t('step2.fields.country.label')}
                  placeholder={t('step2.fields.country.placeholder')}
                  error={translateError(errors.countryOfResidence)}
                  disabled={isLoading}
                  {...register('countryOfResidence')}
                />
              </div>
            </div>

            {/* Funding Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                {t('step2.sections.funding')}
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('step2.fields.fundingType.label')}
                  </label>
                  <div className="space-y-2">
                    {fundingTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors"
                      >
                        <input
                          type="radio"
                          value={type}
                          {...register('fundingType')}
                          disabled={isLoading}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {tFundingTypes(type as any) || type}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.fundingType && (
                    <p className="mt-2 text-sm text-error-600">{translateError(errors.fundingType)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('step2.fields.fundingReason.label')}
                  </label>
                  <textarea
                    {...register('fundingReason')}
                    rows={4}
                    maxLength={maxReasonLength}
                    placeholder={t('step2.fields.fundingReason.placeholder')}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-600 transition-all duration-200 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.fundingReason && (
                      <p className="text-sm text-error-600">{translateError(errors.fundingReason)}</p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {fundingReason.length} / {maxReasonLength}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                {t('step2.sections.financial')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t('step2.fields.profession.label')}
                  placeholder={t('step2.fields.profession.placeholder')}
                  error={translateError(errors.profession)}
                  disabled={isLoading}
                  {...register('profession')}
                />

                <CurrencyInput
                  label={t('step2.fields.monthlyIncome.label')}
                  value={monthlyIncome || ''}
                  onValueChange={handleMonthlyIncomeChange}
                  currency="EUR"
                  placeholder={t('step2.fields.monthlyIncome.placeholder')}
                  error={translateError(errors.monthlyIncome)}
                  helperText={!errors.monthlyIncome ? t('step2.fields.monthlyIncome.helper') : undefined}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {t('common.buttons.back')}
              </Button>

              <Button
                type="submit"
                disabled={!isValid || isLoading}
                isLoading={isLoading}
                className="w-full sm:flex-1"
              >
                {t('common.buttons.next')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
