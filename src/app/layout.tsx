import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Altave Realty Group | Elevate Your Space',
    template: '%s | Altave Realty Group',
  },
  description:
    'Altave Realty Group — premium full-service real estate in Halifax, Nova Scotia. Luxury rentals, sales, and commercial properties across Downtown Halifax, Bedford, Dartmouth, and beyond.',
  keywords: [
    'Halifax real estate',
    'Halifax rentals',
    'condos for rent Halifax',
    'homes for sale Halifax NS',
    'commercial properties Halifax',
    'Altave Realty Group',
  ],
  authors: [{ name: 'Altave Realty Group', url: 'https://altaverealty.com' }],
  creator: 'Altave Realty Group',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://altaverealty.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://altaverealty.com',
    siteName: 'Altave Realty Group',
    title: 'Altave Realty Group | Elevate Your Space',
    description:
      'Premium full-service real estate in Halifax, Nova Scotia. Luxury rentals, sales, and commercial properties.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Altave Realty Group' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Altave Realty Group | Elevate Your Space',
    description: 'Premium full-service real estate in Halifax, Nova Scotia.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cormorant.variable} ${montserrat.variable} ${inter.variable} bg-bg-base text-text-primary font-body antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
