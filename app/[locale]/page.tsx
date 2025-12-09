import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import { CheckCircle, Shield, Clock, Users } from 'lucide-react'

export default function Home() {
  const t = useTranslations('home')

  const features = [
    {
      icon: CheckCircle,
      titleKey: 'feature1Title',
      descKey: 'feature1Desc',
    },
    {
      icon: Shield,
      titleKey: 'feature2Title',
      descKey: 'feature2Desc',
    },
    {
      icon: Clock,
      titleKey: 'feature3Title',
      descKey: 'feature3Desc',
    },
    {
      icon: Users,
      titleKey: 'feature4Title',
      descKey: 'feature4Desc',
    },
  ]

  const steps = [
    { step: '01', titleKey: 'step1Title', descKey: 'step1Desc' },
    { step: '02', titleKey: 'step2Title', descKey: 'step2Desc' },
    { step: '03', titleKey: 'step3Title', descKey: 'step3Desc' },
    { step: '04', titleKey: 'step4Title', descKey: 'step4Desc' },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 to-primary-900 text-white py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
              {t('subtitle')}
            </p>
            <Link href="/application/new">
              <Button size="lg" variant="secondary" className="animate-scale-in">
                {t('cta')}
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('features')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" className="text-center hover:shadow-strong transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
                    <feature.icon className="w-8 h-8 text-primary-800" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('howItWorks')}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {steps.map((item) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="shrink-0 w-16 h-16 rounded-full bg-primary-800 text-white flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      {t(item.titleKey)}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {t(item.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link href="/application/new">
            <Button size="lg" variant="secondary">
              {t('ctaButton')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
