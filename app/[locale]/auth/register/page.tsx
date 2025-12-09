'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { registerUser } from '@/lib/auth/client'
import { isValidPhoneNumber } from '@/utils/helpers'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Phone, Shield, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [pin, setPin] = useState('')
  const [copied, setCopied] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error(t('invalidPhone'))
      return
    }

    setLoading(true)

    try {
      const response = await registerUser(phoneNumber)
      setPin(response.pin)
      setRegistered(true)
      toast.success(t('registrationSuccess'))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(errorMessage || t('registrationFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPin = () => {
    navigator.clipboard.writeText(pin)
    setCopied(true)
    toast.success(t('pinCopied'))
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContinueToLogin = () => {
    router.push('/auth/login')
  }

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-success-600" />
            </div>
            <CardTitle>{t('registrationComplete')}</CardTitle>
            <CardDescription>{t('saveYourPin')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2 text-center">{t('yourPin')}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <p className="text-4xl font-bold text-primary-800 tracking-widest">{pin}</p>
                <button
                  onClick={handleCopyPin}
                  className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                  title={t('copyPin')}
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-success-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-primary-600" />
                  )}
                </button>
              </div>
              
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <p className="text-sm text-warning-800 font-medium mb-2">
                  ⚠️ {t('importantNotice')}
                </p>
                <ul className="text-xs text-warning-700 space-y-1 list-disc list-inside">
                  <li>{t('pinWarning1')}</li>
                  <li>{t('pinWarning2')}</li>
                  <li>{t('pinWarning3')}</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleContinueToLogin}
              className="w-full"
              size="lg"
            >
              {t('continueToLogin')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t('createAccount')}</CardTitle>
          <CardDescription>{t('registerDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <Input
              label={t('phoneNumber')}
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+229 XX XX XX XX"
              leftIcon={<Phone className="w-5 h-5" />}
              required
              disabled={loading}
              helperText={t('phoneHelperText')}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>{t('howItWorks')}:</strong>
              </p>
              <ol className="text-xs text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                <li>{t('registerStep1')}</li>
                <li>{t('registerStep2')}</li>
                <li>{t('registerStep3')}</li>
              </ol>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
              disabled={loading || !phoneNumber}
            >
              {t('register')}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {t('alreadyHaveAccount')}{' '}
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('login')}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
