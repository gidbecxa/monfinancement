import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Counter from '@/components/ui/Counter'
import {
  Target,
  Users,
  Heart,
  FileText,
  CheckCircle,
  Search,
  Clock,
  TrendingUp,
  Archive,
  Euro,
  Briefcase,
  Scale
} from 'lucide-react'

export default function AboutPage() {
  const t = useTranslations('about')

  // Team members
  const teamMembers = [
    {
      name: 'Équipe Conseil',
      role: t('teamRole1'),
      image: '/images/team/advisor.jpg',
    },
    {
      name: 'Contrôle de Gestion',
      role: t('teamRole2'),
      image: '/images/team/controller.jpg',
    },
    {
      name: 'Analystes Experts',
      role: t('teamRole3'),
      image: '/images/team/analyst.jpg',
    },
  ]

  const objectives = [
    {
      icon: Briefcase,
      titleKey: 'objective1Title',
      descKey: 'objective1Desc',
    },
    {
      icon: Heart,
      titleKey: 'objective2Title',
      descKey: 'objective2Desc',
    },
    {
      icon: Target,
      titleKey: 'objective3Title',
      descKey: 'objective3Desc',
    },
    {
      icon: TrendingUp,
      titleKey: 'objective4Title',
      descKey: 'objective4Desc',
    },
    {
      icon: Users,
      titleKey: 'objective5Title',
      descKey: 'objective5Desc',
    },
    {
      icon: Scale,
      titleKey: 'objective6Title',
      descKey: 'objective6Desc',
    },
  ]

  const processSteps = [
    {
      icon: FileText,
      number: '1',
      titleKey: 'step1Title',
      descKey: 'step1Desc',
    },
    {
      icon: CheckCircle,
      number: '2',
      titleKey: 'step2Title',
      descKey: 'step2Desc',
    },
    {
      icon: Search,
      number: '3',
      titleKey: 'step3Title',
      descKey: 'step3Desc',
    },
    {
      icon: Clock,
      number: '4',
      titleKey: 'step4Title',
      descKey: 'step4Desc',
    },
    {
      icon: TrendingUp,
      number: '5',
      titleKey: 'step5Title',
      descKey: 'step5Desc',
    },
    {
      icon: Archive,
      number: '6',
      titleKey: 'step6Title',
      descKey: 'step6Desc',
    },
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

      {/* Presentation Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('presentationTitle')}
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="text-lg leading-relaxed">
                {t('presentationP1')}
              </p>
              <p className="text-lg leading-relaxed">
                {t('presentationP2')}
              </p>
              <p className="text-lg leading-relaxed font-semibold text-primary-900">
                {t('presentationP3')}
              </p>
              <p className="text-lg leading-relaxed">
                {t('presentationP4')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('objectivesTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {t('objectivesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-100 mb-6">
                  <objective.icon className="w-8 h-8 text-primary-700" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t(objective.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(objective.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('processTitle')}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {t('processSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-primary-300 transition-all hover:shadow-lg group"
              >
                {/* Step number badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-700 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {step.number}
                </div>

                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-100 mb-6 mt-4 group-hover:bg-primary-200 transition-colors">
                  <step.icon className="w-8 h-8 text-primary-700" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t(step.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 mb-6">
              <Users className="w-10 h-10 text-primary-700" strokeWidth={2} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('teamTitle')}
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('teamDesc')}
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-700 font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Balance Sheet / Statistics Section */}
      <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('balanceTitle')}
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
    </div>
  )
}
