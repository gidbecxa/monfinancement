'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useAuth } from '@/hooks/useAuth'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import Button from '@/components/ui/Button'
import { LogOut, LayoutDashboard, User } from 'lucide-react'

export default function Header() {
  const t = useTranslations('nav')
  const { isAuthenticated, logout, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-800">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="hidden sm:inline-block font-bold text-xl text-gray-900">
              Monfinancement
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-primary-800 transition-colors"
            >
              {t('home')}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-primary-800 transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              href="/nos-offres"
              className="text-sm font-medium text-gray-700 hover:text-primary-800 transition-colors"
            >
              {t('offers')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-primary-800 transition-colors"
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {!loading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {t('dashboard')}
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('logout')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">
                        {t('login')}
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm">
                        <User className="w-4 h-4 mr-2" />
                        {t('register')}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
