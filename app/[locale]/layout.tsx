import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Inter, JetBrains_Mono } from "next/font/google"
import '@/app/globals.css'
import type { Metadata } from 'next'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://monfinancement.co'
  const ogImageUrl = `${baseUrl}/og-image.svg`
  const videoUrl = `${baseUrl}/videos/7348052.mp4`
  
  return {
    metadataBase: new URL(baseUrl),
    title: 'Monfinancement - Financements Non Remboursables',
    description: 'Programme d\'aide humanitaire offrant des financements non remboursables pour la santé, l\'éducation, le logement et les projets. En partenariat avec le FMI et la Banque Mondiale.',
    keywords: ['financement', 'aide humanitaire', 'non remboursable', 'FMI', 'Banque Mondiale', 'soutien financier', 'aide sociale'],
    authors: [{ name: 'Monfinancement' }],
    creator: 'Monfinancement',
    publisher: 'Monfinancement',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: baseUrl,
      title: 'Monfinancement - Financements Non Remboursables',
      description: 'Programme d\'aide humanitaire offrant des financements non remboursables. En partenariat avec le FMI et la Banque Mondiale.',
      siteName: 'Monfinancement',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Monfinancement - Programme d\'aide humanitaire',
        }
      ],
      videos: [
        {
          url: videoUrl,
          secureUrl: videoUrl,
          type: 'video/mp4',
          width: 1920,
          height: 1080,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Monfinancement - Financements Non Remboursables',
      description: 'Programme d\'aide humanitaire offrant des financements non remboursables.',
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt')) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
