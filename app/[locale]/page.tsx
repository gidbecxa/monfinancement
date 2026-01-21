import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import FamiliesCarousel from '@/components/home/FamiliesCarousel'
import { 
  CheckCircle, 
  Shield, 
  Users, 
  AlertTriangle, 
  UserCheck, 
  Lock, 
  XCircle,
  TrendingUp,
  FileCheck,
  Euro,
  ThumbsUp,
  Heart,
  Clock,
  Award
} from 'lucide-react'

export default function Home() {
  const t = useTranslations('home')

  // 7 Features based on client specifications
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
      icon: Users,
      titleKey: 'feature3Title',
      descKey: 'feature3Desc',
    },
    {
      icon: AlertTriangle,
      titleKey: 'feature4Title',
      descKey: 'feature4Desc',
    },
    {
      icon: UserCheck,
      titleKey: 'feature5Title',
      descKey: 'feature5Desc',
    },
    {
      icon: Lock,
      titleKey: 'feature6Title',
      descKey: 'feature6Desc',
    },
    {
      icon: XCircle,
      titleKey: 'feature7Title',
      descKey: 'feature7Desc',
    },
  ]

  // Team members
  const teamMembers = [
    {
      name: 'Équipe Conseil',
      role: t('teamRole1'),
      image: '/images/team/advisor.jpg', // Placeholder
    },
    {
      name: 'Contrôle de Gestion',
      role: t('teamRole2'),
      image: '/images/team/controller.jpg', // Placeholder
    },
    {
      name: 'Analystes Experts',
      role: t('teamRole3'),
      image: '/images/team/analyst.jpg', // Placeholder
    },
  ]

  // Statistics
  const stats = [
    {
      icon: TrendingUp,
      titleKey: 'stat1Title',
      valueKey: 'stat1Value',
      descKey: 'stat1Desc',
    },
    {
      icon: FileCheck,
      titleKey: 'stat2Title',
      valueKey: 'stat2Value',
      descKey: 'stat2Desc',
    },
    {
      icon: Euro,
      titleKey: 'stat3Title',
      valueKey: 'stat3Value',
      descKey: 'stat3Desc',
    },
    {
      icon: ThumbsUp,
      titleKey: 'stat4Title',
      valueKey: 'stat4Value',
      descKey: 'stat4Desc',
    },
  ]

  // Testimonials - Real client testimonials
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
      text: 'O financiamento literalmente mudou o jogo para o meu negócio. O financiamento obtido me permitiu investir em novas tecnologias e aumentar drasticamente minha produtividade. Estou impressionado com a eficácia deles',
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
      text: 'Ich habe eine Finanzierung erhalten, um die Renovierung meines neuen Hauses abzuschließen. Ich weiß nicht, wie ich Ihnen danken soll.',
      image: '/images/testimonials/alexander.jpeg',
    },
    {
      name: 'Marie L.',
      location: 'France (Linards)',
      text: 'Après une séparation difficile, j\'ai reçu une aide pour le reloger. Je ne pensais pas qu\'un soutien comme ça existait vraiment. Merci pour l\'aide',
      image: '/images/testimonials/marie.jpeg',
    },
    {
      name: 'Roland G.',
      location: 'Belgique (Charleroi)',
      text: 'J\'étais sans ressources après un accident de travail. Leur aide m\'a permis de tenir le temps de reprendre ma vie en main.',
      image: '/images/testimonials/roland.jpeg',
    },
    {
      name: 'Maylo Vincent R.',
      location: 'Martinique (Fort-de-France)',
      text: 'Mon dossier a été étudié avec sérieux. Même à distance, je me suis senti écouté et considéré. Merci',
      image: '/images/testimonials/maylo.jpeg',
    },
    {
      name: 'Prince George Maltais',
      location: 'Réunion',
      text: 'J\'ai pu finaliser ma formation en Dev Logiciel grâce à eux. La demande était simple, le suivi impeccable.',
      image: '/images/testimonials/prince.jpeg',
    },
  ]

  // Partner logos
  const partners = [
    { name: 'Société Générale', logo: '/images/partners/sg.svg' },
    { name: 'BNP Paribas', logo: '/images/partners/bnp.svg' },
    { name: 'HSBC', logo: '/images/partners/hsbc.svg' },
    { name: 'Revolut', logo: '/images/partners/revolut.svg' },
    { name: 'IMF', logo: '/images/partners/imf.png' },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 text-white py-24 md:py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.jpg"
            alt="Hero background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800/80 via-primary-900/80 to-primary-950/80"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 animate-fade-in leading-tight drop-shadow-lg">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-10 text-primary-50 animate-slide-up leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              {t('subtitle')}
            </p>
            <Link href="/application/new">
              <Button size="lg" variant="secondary" className="animate-scale-in text-lg px-10 py-4 shadow-2xl hover:shadow-primary-500/50 transition-all">
                {t('cta')}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section - 7 cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('features')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 mb-6 shadow-lg">
                    <feature.icon className="w-10 h-10 text-primary-800" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-10 h-10" />
                <p className="text-5xl md:text-6xl font-bold">{t('experienceYears')}</p>
              </div>
              <p className="text-xl text-primary-100">{t('experienceLabel')}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <Award className="w-10 h-10" />
                <p className="text-5xl md:text-6xl font-bold">{t('projectsSupported')}</p>
              </div>
              <p className="text-xl text-primary-100">{t('projectsLabel')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Family Photos Carousel Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Heart className="w-10 h-10 text-primary-700" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                {t('familiesTitle')}
              </h2>
            </div>
            
            <FamiliesCarousel />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">
              {t('aboutTitle')}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto">
              {t('aboutDescription')}
            </p>
            <div className="text-center mb-12">
              <button className="text-primary-800 font-semibold hover:text-primary-900 transition-colors text-lg underline">
                {t('aboutSeeMore')}
              </button>
            </div>

            {/* 10+ Years Section */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {t('about10YearsTitle')}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('about10YearsDesc')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary-800 shrink-0 mt-1" />
                  <p className="text-gray-800">{t('aboutPoint1')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary-800 shrink-0 mt-1" />
                  <p className="text-gray-800">{t('aboutPoint2')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary-800 shrink-0 mt-1" />
                  <p className="text-gray-800">{t('aboutPoint3')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary-800 shrink-0 mt-1" />
                  <p className="text-gray-800">{t('aboutPoint4')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Carousel Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            {t('partnersTitle')}
          </h2>
          
          {/* Partner logos */}
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="flex flex-wrap justify-center items-center gap-12">
              {partners.map((partner, index) => (
                <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              {t('teamTitle')}
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-primary-800 mb-6 text-center">
              {t('teamSubtitle')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              {t('teamDescription')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} variant="elevated" className="text-center hover:shadow-2xl transition-all">
                  <CardContent className="pt-8 pb-6">
                    {/* Team member image */}
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-primary-700 font-semibold">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              {t('statsTitle')}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              {t('statsDescription')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} variant="elevated" className="text-center bg-white hover:shadow-2xl transition-all hover:-translate-y-2">
                  <CardContent className="pt-8 pb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 mb-4 shadow-md">
                      <stat.icon className="w-8 h-8 text-primary-800" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      {t(stat.titleKey)}
                    </p>
                    <p className="text-5xl font-bold text-primary-800 mb-3">
                      {t(stat.valueKey)}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {t(stat.descKey)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              {t('testimonialsTitle')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('testimonialsSubtitle')}
            </p>
          </div>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll-testimonials">
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <Card key={index} variant="elevated" className="flex-shrink-0 w-80 hover:shadow-2xl transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden shadow-md">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 italic mb-6 leading-relaxed text-sm h-32 overflow-hidden">"{testimonial.text}"</p>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10">
            {t('ctaTitle')}
          </h2>
          <Link href="/application/new">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-4 shadow-2xl hover:shadow-primary-500/50 transition-all">
              {t('ctaButton')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
