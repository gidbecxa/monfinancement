import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle
} from 'lucide-react'

export default function ContactPage() {
  const t = useTranslations('contact')

  // Reuse testimonials from home page
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
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.jpg"
            alt="Contact hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 leading-relaxed">
              {t('heroSubtitle')}
            </p>
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

      {/* Contact Information Section */}
      <section className="py-20 bg-white -mt-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Headquarters */}
              <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-primary-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {t('headquartersTitle')}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {t('headquartersAddress')}
                    </p>
                    <p className="text-sm text-primary-700 font-semibold">
                      {t('annexLabel')} {t('annexAddress')}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-green-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-green-600 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {t('whatsappTitle')}
                    </h3>
                    <a 
                      href="https://wa.me/33629125401" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg text-green-700 font-semibold hover:text-green-800 transition-colors"
                    >
                      +33 6 29 12 54 01
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Phone className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {t('phoneTitle')}
                    </h3>
                    <a 
                      href="tel:+33629125401" 
                      className="text-lg text-blue-700 font-semibold hover:text-blue-800 transition-colors"
                    >
                      +33 6 29 12 54 01
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {t('emailTitle')}
                    </h3>
                    <a 
                      href="mailto:contact@monfinancement.co" 
                      className="text-lg text-purple-700 font-semibold hover:text-purple-800 transition-colors break-all"
                    >
                      contact@monfinancement.co
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-orange-100 md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-orange-600 flex items-center justify-center">
                    <Clock className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {t('hoursTitle')}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">
                        <span className="text-gray-900 font-semibold">{t('weekdays')}</span> {t('weekdaysHours')}
                      </p>
                      <p className="text-gray-700 font-medium">
                        <span className="text-gray-900 font-semibold">{t('saturday')}</span> {t('saturdayHours')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
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

        {/* Testimonials Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
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
                  <p className="text-gray-700 italic leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
