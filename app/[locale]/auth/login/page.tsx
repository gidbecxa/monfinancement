'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { loginUser } from '@/lib/auth/client'
import { getPostLoginRedirect } from '@/lib/auth/redirect'
import { isValidPhoneNumber } from '@/utils/helpers'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Phone, Lock, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const t = useTranslations('auth')
  const router = useRouter()
  
  const [phoneNumber, setPhoneNumber] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPinRegenerated, setShowPinRegenerated] = useState(false)
  const [newPin, setNewPin] = useState('')

  // Check if user is already logged in
  useEffect(() => {
    const sessionToken = localStorage.getItem('session_token')
    const expiresAt = localStorage.getItem('session_expires_at')
    
    if (sessionToken && expiresAt) {
      const expiryDate = new Date(expiresAt)
      if (expiryDate > new Date()) {
        router.push('/dashboard')
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate phone number
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error(t('invalidPhone'))
      return
    }

    // Validate PIN (6 digits)
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      toast.error(t('invalidPin'))
      return
    }

    setLoading(true)

    try {
      // Get user's IP address and user agent
      const userAgent = navigator.userAgent
      
      const response = await loginUser(phoneNumber, pin, undefined, userAgent)
      
      // Check if PIN was regenerated
      if (response.pin_regenerated && response.new_pin) {
        setNewPin(response.new_pin)
        setShowPinRegenerated(true)
        toast.success(t('pinRegenerated'))
      } else {
        toast.success(t('loginSuccess'))
        
        // Determine where to redirect based on user's application status
        const redirect = await getPostLoginRedirect(response.user_id)
        router.push(redirect.path)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(errorMessage || t('loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleContinueToDashboard = async () => {
    const userId = localStorage.getItem('user_id')
    if (userId) {
      const redirect = await getPostLoginRedirect(userId)
      router.push(redirect.path)
    } else {
      router.push('/dashboard')
    }
  }

  if (showPinRegenerated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-warning-600" />
            </div>
            <CardTitle>{t('pinRegeneratedTitle')}</CardTitle>
            <CardDescription>{t('pinRegeneratedDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2 text-center">{t('yourNewPin')}</p>
              <p className="text-4xl font-bold text-primary-800 tracking-widest text-center mb-4">
                {newPin}
              </p>
              
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <p className="text-sm text-warning-800 font-medium mb-2">
                  ⚠️ {t('importantNotice')}
                </p>
                <ul className="text-xs text-warning-700 space-y-1 list-disc list-inside">
                  <li>{t('pinWarning1')}</li>
                  <li>{t('pinWarning2')}</li>
                  <li>{t('pinRegeneratedReason')}</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleContinueToDashboard}
              className="w-full"
              size="lg"
            >
              {t('continueToDashboard')}
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
          <CardTitle>{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label={t('phoneNumber')}
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+229 XX XX XX XX"
              leftIcon={<Phone className="w-5 h-5" />}
              required
              disabled={loading}
            />

            <Input
              label={t('pin')}
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              required
              disabled={loading}
              maxLength={6}
              helperText={t('pinHelperText')}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
              disabled={loading || !phoneNumber || !pin}
            >
              {t('login')}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {t('dontHaveAccount')}{' '}
              <button
                type="button"
                onClick={() => router.push('/auth/register')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {t('register')}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
