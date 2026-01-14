'use client'

import { useTranslations } from 'next-intl'
import CurrencyInput from './CurrencyInput'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { TrendingUp } from 'lucide-react'

interface Step0Props {
  fundingAmount: number | null
  onFundingAmountChange: (amount: number | null) => void
  onNext: () => void
  isLoading?: boolean
}

const MIN_AMOUNT = 1000
const MAX_AMOUNT = 10000000

export default function Step0FundingAmount({
  fundingAmount,
  onFundingAmountChange,
  onNext,
  isLoading = false,
}: Step0Props) {
  const t = useTranslations('application')

  const handleNext = () => {
    if (fundingAmount && fundingAmount >= MIN_AMOUNT && fundingAmount <= MAX_AMOUNT) {
      onNext()
    }
  }

  const isValid = fundingAmount !== null && fundingAmount >= MIN_AMOUNT && fundingAmount <= MAX_AMOUNT
  const error = fundingAmount !== null && !isValid
    ? t('step0.errors.invalidAmount', { min: MIN_AMOUNT.toLocaleString(), max: MAX_AMOUNT.toLocaleString() })
    : undefined

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-primary-800" />
          </div>
          <CardTitle className="text-3xl md:text-4xl">
            {t('step0.title')}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {t('step0.description')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <CurrencyInput
            label={t('step0.fields.amount.label')}
            value={fundingAmount || ''}
            onValueChange={onFundingAmountChange}
            currency="EUR"
            placeholder={t('step0.fields.amount.placeholder')}
            error={error}
            helperText={!error ? t('step0.fields.amount.helper') : undefined}
            disabled={isLoading}
            autoFocus
          />

          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            <div>
              <span className="font-medium text-gray-800">{t('step0.minimum')}:</span>
              <span className="ml-2">€{MIN_AMOUNT.toLocaleString('fr-FR')}</span>
            </div>
            <div className="hidden sm:block text-gray-400">|</div>
            <div>
              <span className="font-medium text-gray-800">{t('step0.maximum')}:</span>
              <span className="ml-2">€{MAX_AMOUNT.toLocaleString('fr-FR')}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleNext}
              className="w-full"
              size="lg"
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              {t('common.buttons.continue')}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              {t('step0.secureNote')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
