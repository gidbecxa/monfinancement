'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { X, User, Phone, Save } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'sonner'

interface ProfileSettingsProps {
  onClose: () => void
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const t = useTranslations('dashboard.profile')
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    phone_number: '',
    first_name: '',
    last_name: '',
    email: '',
  })

  const loadProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (userData) {
        const data = userData as {
          phone_number: string
          first_name: string
          last_name: string
          email: string
        }
        setProfile({
          phone_number: data.phone_number || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('users')
        // @ts-expect-error - Supabase type inference issue
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      toast.success(t('saved'))
      setTimeout(() => onClose(), 1000)
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error(t('error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">{t('title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <Input
                label={t('phoneNumber')}
                value={profile.phone_number}
                disabled
                leftIcon={<Phone className="w-5 h-5" />}
                helperText={t('phoneHelper')}
              />

              <Input
                label={t('firstName')}
                value={profile.first_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, first_name: e.target.value })}
                placeholder={t('firstNamePlaceholder')}
                leftIcon={<User className="w-5 h-5" />}
              />

              <Input
                label={t('lastName')}
                value={profile.last_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, last_name: e.target.value })}
                placeholder={t('lastNamePlaceholder')}
                leftIcon={<User className="w-5 h-5" />}
              />

              <Input
                label={t('email')}
                type="email"
                value={profile.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, email: e.target.value })}
                placeholder={t('emailPlaceholder')}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {t('save')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
