'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step1Schema, type Step1FormData } from '@/lib/validations'
import { useValidationTranslation } from '@/hooks/useValidationTranslation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { User } from 'lucide-react'

interface Step1Props {
  data: Partial<Step1FormData>
  onNext: (data: Step1FormData) => void
  onBack: () => void
  isLoading?: boolean
}

export default function Step1PersonalInfo({ data, onNext, onBack, isLoading = false }: Step1Props) {
  const t = useTranslations('application')
  const { translateError } = useValidationTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
    defaultValues: data,
  })

  const onSubmit = (formData: Step1FormData) => {
    onNext(formData)
  }

  return (
    <div className="px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-primary-800" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            {t('step1.title')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('step1.description')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('step1.fields.firstName.label')}
                placeholder={t('step1.fields.firstName.placeholder')}
                error={translateError(errors.firstName)}
                disabled={isLoading}
                {...register('firstName')}
              />

              <Input
                label={t('step1.fields.lastName.label')}
                placeholder={t('step1.fields.lastName.placeholder')}
                error={translateError(errors.lastName)}
                disabled={isLoading}
                {...register('lastName')}
              />
            </div>

            <Input
              label={t('step1.fields.dateOfBirth.label')}
              type="date"
              error={translateError(errors.dateOfBirth)}
              helperText={t('step1.fields.dateOfBirth.helper')}
              disabled={isLoading}
              {...register('dateOfBirth')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('step1.fields.gender.label')}
              </label>
              <select
                {...register('gender')}
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-600 transition-all duration-200"
              >
                <option value="">{t('step1.fields.gender.placeholder')}</option>
                <option value="male">{t('step1.fields.gender.options.male')}</option>
                <option value="female">{t('step1.fields.gender.options.female')}</option>
                <option value="other">{t('step1.fields.gender.options.other')}</option>
                <option value="prefer_not_to_say">{t('step1.fields.gender.options.preferNotToSay')}</option>
              </select>
              {errors.gender && (
                <p className="mt-2 text-sm text-error-600">{translateError(errors.gender)}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">{t('step1.fields.gender.optional')}</p>
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
