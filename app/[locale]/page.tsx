import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Counter from '@/components/ui/Counter'
import { 
  Heart,
  Shield,
  Users,
  Home,
  GraduationCap,
  Briefcase,
  Baby,
  TrendingUp,
  CheckCircle,
  Euro,
  ThumbsUp,
  ArrowRight,
  Sparkles,
  HandHeart,
  Scale
} from 'lucide-react'

export default function HomePage() {
  const t = useTranslations('home')

  // Nos Offres - Aid Categories
  const aidCategories = [
    {
      icon: Heart,
      titleKey: 'aidHealth',
      descKey: 'aidHealthDesc',
      color: 'from-red-500 to-pink-600',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: Home,
      titleKey: 'aidHousing',
      descKey: 'aidHousingDesc',
      color: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: GraduationCap,
      titleKey: 'aidEducation',
      descKey: 'aidEducationDesc',
      color: 'from-purple-500 to-violet-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Briefcase,
      titleKey: 'aidProject',
      descKey: 'aidProjectDesc',
      color: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Baby,
      titleKey: 'aidFamily',
      descKey: 'aidFamilyDesc',
      color: 'from-orange-500 to-amber-600',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: HandHeart,
      titleKey: 'aidOther',
      descKey: 'aidOtherDesc',
      color: 'from-teal-500 to-cyan-600',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },
  ]

  // Allocation Rules
  const allocationRules = [
    {
      icon: Users,
      titleKey: 'rule1Title',
      descKey: 'rule1Desc',
    },
    {
      icon: Scale,
      titleKey: 'rule2Title',
      descKey: 'rule2Desc',
    },
    {
      icon: CheckCircle,
      titleKey: 'rule3Title',
      descKey: 'rule3Desc',
    },
    {
      icon: Shield,
      titleKey: 'rule4Title',
      descKey: 'rule4Desc',
    },
  ]

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

  // Testimonials
  const testimonials = [
    {
      name: 'Brigitte R.',
      location: 'Belgique (Charleroi)',
      text: 'Ce financement pour mes soins médicaux est arrivée juste à temps. C\'est plus qu\'une aide financière, c\'est un vrai soutien plus que vital.',
      image: '/images/testimonials/brigitte.jpeg',
    },
    {
      name: 'Caroline B.',
      location: 'Luxembourg',
      text: 'J\'ai obtenu un financement, pour finaliser les rénovations de ma nouvelle maison. Je ne saurai comment vous remercier.',
      image: '/images/testimonials/caroline.jpeg',
    },
    {
      name: 'Marcos V.',
      location: 'Portugal',
      text: 'O financiamento literalmente mudou o jogo para o meu negócio. O financiamento obtido me permitiu investir em novas tecnologias.',
      image: '/images/testimonials/marcos.jpeg',
    },
    {
      name: 'Edmond K.',
      location: 'Luxembourg',
      text: 'Ce financement m\'a été d\'une utilité décisive de ma vie. Grâce à ça, j\'ai relancer mon entreprise qui était au bord de la faillite.',
      image: '/images/testimonials/edmond.jpeg',
    },
    {
      name: 'Alexander M.',
      location: 'Deutschland-Allemagne',
      text: 'Ich habe eine Finanzierung erhalten, um die Renovierung meines neuen Hauses abzuschließen.',
      image: '/images/testimonials/alexander.jpeg',
    },
    {
      name: 'Marie L.',
      location: 'France (Linards)',
      text: 'Après une séparation difficile, j\'ai reçu une aide pour le reloger. Je ne pensais pas qu\'un soutien comme ça existait vraiment.',
      image: '/images/testimonials/marie.jpeg',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section - Inspired Design */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>
          {/* Animated shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pb-32">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 mt-8 animate-slide-down">
              <Sparkles className="w-5 h-5 text-primary-200" />
              <span className="text-primary-100 font-medium">{t('heroBadge')}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-fade-in-up">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              {t('heroSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <Link href="/application/new">
                <Button size="lg" className="bg-white !text-primary-900 hover:!bg-primary-900 hover:!text-white shadow-2xl text-lg px-10 py-4 group font-semibold">
                  {t('cta')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#about">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-4">
                  {t('learnMore')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* A Propos Section */}
      <section id="about" className="py-20 bg-white scroll-mt-20 -mt-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-primary-700 font-semibold text-sm uppercase tracking-wider bg-primary-50 px-4 py-2 rounded-full">
                  {t('aboutBadge')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('aboutTitle')}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                {t('aboutDescription')}
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-primary-50 via-white to-primary-50 rounded-3xl p-8 md:p-12 shadow-xl border border-primary-100">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left side - Icon and title */}
                <div>
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 mb-6 shadow-lg">
                    <Heart className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {t('about10YearsTitle')}
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    {t('about10YearsDesc')}
                  </p>
                  <Link href="/about">
                    <Button className="group">
                      {t('aboutSeeMore')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Right side - Key points */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{t('aboutPoint1')}</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{t('aboutPoint2')}</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{t('aboutPoint3')}</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{t('aboutPoint4')}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Offres Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-primary-700 font-semibold text-sm uppercase tracking-wider bg-white px-4 py-2 rounded-full shadow-sm">
                  {t('offersBadge')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('offersTitle')}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {t('offersSubtitle')}
              </p>
            </div>

            {/* Aid Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aidCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${category.iconBg} mb-6 group-hover:scale-110 transition-transform`}>
                    <category.icon className={`w-8 h-8 ${category.iconColor}`} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {t(category.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(category.descKey)}
                  </p>
                  {/* Gradient underline */}
                  <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${category.color} rounded-full mt-6`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Allocation Rules Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-primary-700 font-semibold text-sm uppercase tracking-wider bg-primary-50 px-4 py-2 rounded-full">
                  {t('rulesBadge')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('rulesTitle')}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {t('rulesSubtitle')}
              </p>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allocationRules.map((rule, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center">
                    <rule.icon className="w-7 h-7 text-primary-700" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {t(rule.titleKey)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(rule.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-primary-200 font-semibold text-sm uppercase tracking-wider bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  {t('statsBadge')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('statsTitle')}
              </h2>
              <p className="text-xl text-primary-100 leading-relaxed max-w-3xl mx-auto">
                {t('statsDescription')}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 mb-6">
                  <TrendingUp className="w-8 h-8 text-primary-200" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-3">
                  {t('stat1Title')}
                </p>
                <p className="text-5xl md:text-6xl font-bold text-white mb-4">
                  <Counter end={96} suffix="%" />
                </p>
                <p className="text-primary-100 leading-relaxed">
                  {t('stat1Desc')}
                </p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 mb-6">
                  <CheckCircle className="w-8 h-8 text-primary-200" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-3">
                  {t('stat2Title')}
                </p>
                <p className="text-5xl md:text-6xl font-bold text-white mb-4">
                  <Counter end={94} suffix="%" />
                </p>
                <p className="text-primary-100 leading-relaxed">
                  {t('stat2Desc')}
                </p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 mb-6">
                  <Euro className="w-8 h-8 text-primary-200" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-3">
                  {t('stat3Title')}
                </p>
                <p className="text-5xl md:text-6xl font-bold text-white mb-4">
                  <Counter end={0} suffix="€" />
                </p>
                <p className="text-primary-100 leading-relaxed">
                  {t('stat3Desc')}
                </p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/10 mb-6">
                  <ThumbsUp className="w-8 h-8 text-primary-200" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-3">
                  {t('stat4Title')}
                </p>
                <p className="text-5xl md:text-6xl font-bold text-white mb-4">
                  <Counter end={98} suffix="%" />
                </p>
                <p className="text-primary-100 leading-relaxed">
                  {t('stat4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-primary-700 font-semibold text-sm uppercase tracking-wider bg-primary-50 px-4 py-2 rounded-full">
                  {t('teamBadge')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('teamTitle')}
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-primary-700 mb-6">
                {t('teamSubtitle')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                {t('teamDescription')}
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="group text-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100"
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-block mb-4">
              <span className="text-primary-700 font-semibold text-sm uppercase tracking-wider bg-white px-4 py-2 rounded-full shadow-sm">
                {t('testimonialsBadge')}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('testimonialsTitle')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('testimonialsSubtitle')}
            </p>
          </div>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll-testimonials">
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-80 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-md flex-shrink-0 relative">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed line-clamp-4">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {t('partnersBadge')}
              </h2>
              <p className="text-gray-600">
                {t('partnersSubtitle')}
              </p>
            </div>

            {/* Partners Logos */}
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-20">
              {/* IMF Logo */}
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <Image
                  src="/images/partners/imf.png"
                  alt="International Monetary Fund (IMF)"
                  width={180}
                  height={80}
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>

              {/* World Bank Logo */}
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <Image
                  src="/images/partners/world_bank_logo.svg"
                  alt="World Bank"
                  width={180}
                  height={80}
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>

              {/* European Union Flag */}
              <div className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <Image
                  src="/images/partners/flag_of_europe.svg"
                  alt="European Union"
                  width={120}
                  height={80}
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <Link href="/application/new">
            <Button size="lg" className="bg-white !text-primary-900 hover:!bg-primary-900 hover:!text-white shadow-2xl text-lg px-12 py-5 group font-semibold">
              {t('ctaButton')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
