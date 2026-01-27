'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Counter from '@/components/ui/Counter'
import {
  GraduationCap,
  Euro,
  Heart,
  Target,
  AlertCircle,
  Users,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Briefcase
} from 'lucide-react'
import { useState } from 'react'

export default function NosOffresPage() {
  const t = useTranslations('offers')

  const offers = [
    {
      icon: GraduationCap,
      number: '01',
      titleKey: 'offer1Title',
      descKey: 'offer1Desc',
      color: 'from-purple-500 to-violet-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Euro,
      number: '02',
      titleKey: 'offer2Title',
      descKey: 'offer2Desc',
      color: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Heart,
      number: '03',
      titleKey: 'offer3Title',
      descKey: 'offer3Desc',
      color: 'from-red-500 to-pink-600',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: Target,
      number: '04',
      titleKey: 'offer4Title',
      descKey: 'offer4Desc',
      color: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: AlertCircle,
      number: '05',
      titleKey: 'offer5Title',
      descKey: 'offer5Desc',
      color: 'from-orange-500 to-amber-600',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: Users,
      number: '06',
      titleKey: 'offer6Title',
      descKey: 'offer6Desc',
      color: 'from-teal-500 to-cyan-600',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },
    {
      icon: Stethoscope,
      number: '07',
      titleKey: 'offer7Title',
      descKey: 'offer7Desc',
      color: 'from-indigo-500 to-purple-600',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
  ]

  const faqs = [
    { questionKey: 'faq1Question', answerKey: 'faq1Answer' },
    { questionKey: 'faq2Question', answerKey: 'faq2Answer' },
    { questionKey: 'faq3Question', answerKey: 'faq3Answer' },
    { questionKey: 'faq4Question', answerKey: 'faq4Answer' },
    { questionKey: 'faq5Question', answerKey: 'faq5Answer' },
    { questionKey: 'faq6Question', answerKey: 'faq6Answer' },
    { questionKey: 'faq7Question', answerKey: 'faq7Answer' },
    { questionKey: 'faq8Question', answerKey: 'faq8Answer' },
    { questionKey: 'faq9Question', answerKey: 'faq9Answer' },
    { questionKey: 'faq10Question', answerKey: 'faq10Answer' },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed">
              {t('introText')}
            </p>
          </div>
        </div>
      </section>

      {/* Offers Grid Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {offers.map((offer, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 flex flex-col"
              >
                {/* Number badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                  {offer.number}
                </div>

                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${offer.iconBg} mb-6 group-hover:scale-110 transition-transform`}>
                  <offer.icon className={`w-10 h-10 ${offer.iconColor}`} strokeWidth={2} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t(offer.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  {t(offer.descKey)}
                </p>

                <Link href="/application/new" className="mt-auto">
                  <Button variant="outline" className="w-full group-hover:bg-primary-700 group-hover:text-white group-hover:border-primary-700 transition-all">
                    {t('applyNow')}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('statsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-4">
                <FileText className="w-7 h-7 text-primary-200" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-2">
                {t('stat1Title')}
              </p>
              <p className="text-4xl md:text-5xl font-bold text-white">
                <Counter end={17867} />
              </p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-4">
                <CheckCircle className="w-7 h-7 text-primary-200" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-2">
                {t('stat2Title')}
              </p>
              <p className="text-4xl md:text-5xl font-bold text-white">
                <Counter end={16564} />
              </p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-4">
                <Euro className="w-7 h-7 text-primary-200" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-2">
                {t('stat3Title')}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                <Counter end={1577924586} />
                <span className="ml-1">€</span>
              </p>
            </div>

            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-4">
                <Briefcase className="w-7 h-7 text-primary-200" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-2">
                {t('stat4Title')}
              </p>
              <p className="text-4xl md:text-5xl font-bold text-white">
                <Counter end={62228} />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('faqTitle')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('faqSubtitle')}
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} questionKey={faq.questionKey} answerKey={faq.answerKey} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('ctaTitle')}
            </h2>
            <Link href="/application/new">
              <Button size="lg" className="!bg-white !text-primary-900 hover:!bg-primary-50 !px-12 !py-6 !text-lg font-bold shadow-2xl hover:scale-105 transition-transform">
                {t('ctaButton')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function FAQItem({ questionKey, answerKey }: { questionKey: string; answerKey: string }) {
  const t = useTranslations('offers')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
      >
        <span className="text-lg font-semibold text-gray-900 pr-8">
          {t(questionKey)}
        </span>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-primary-700 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-6 h-6 text-primary-700 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-700 leading-relaxed">
            {t(answerKey)}
          </p>
        </div>
      )}
    </div>
  )
}
