import Link from 'next/link'
import { Building2, Phone, Mail, MapPin } from 'lucide-react'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

const LINKS = {
  properties: [
    { label: 'All Properties', href: '/properties' },
    { label: 'Rentals', href: '/properties/rentals' },
    { label: 'Sales', href: '/properties/sales' },
    { label: 'Commercial', href: '/properties/commercial' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/team' },
    { label: 'Property Management', href: '/property-management' },
    { label: 'List With Us', href: '/list-with-us' },
    { label: 'Join Our Team', href: '/join-our-team' },
  ],
  resources: [
    { label: "Renter's Guide", href: '/resources/renters-guide' },
    { label: "Buyer's Guide", href: '/resources/buyers-guide' },
    { label: "Seller's Guide", href: '/resources/sellers-guide' },
    { label: 'Forms', href: '/resources/forms' },
    { label: 'Blog', href: '/blog' },
  ],
}

const SOCIALS = [
  { icon: InstagramIcon, href: 'https://instagram.com/altaverealty', label: 'Instagram' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/company/altaverealty', label: 'LinkedIn' },
  { icon: FacebookIcon, href: 'https://facebook.com/altaverealty', label: 'Facebook' },
]

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-5">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-text-muted hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-bg-card border-t border-bg-border">
      {/* Main footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <Building2 className="w-6 h-6 text-gold" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-medium tracking-[0.2em] text-white uppercase">
                  Altave
                </span>
                <span className="font-heading text-[9px] font-semibold tracking-[0.35em] text-gold uppercase">
                  Realty Group
                </span>
              </div>
            </Link>

            <p className="text-sm text-text-muted leading-relaxed max-w-xs mb-8">
              Altave Realty Group is Halifax&apos;s premier full-service real estate firm,
              delivering an elevated experience for rentals, sales, and commercial properties
              across Halifax Regional Municipality.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-8">
              <a
                href="tel:+19025550100"
                className="flex items-center gap-3 text-sm text-text-muted hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                +1 (902) 555-0100
              </a>
              <a
                href="mailto:info@altaverealty.com"
                className="flex items-center gap-3 text-sm text-text-muted hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                info@altaverealty.com
              </a>
              <div className="flex items-start gap-3 text-sm text-text-muted">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>
                  1871 Hollis St, Suite 800
                  <br />
                  Halifax, NS B3J 0C3
                </span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-bg-border text-text-muted hover:border-gold hover:text-gold transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title="Properties" links={LINKS.properties} />
          <FooterColumn title="Company" links={LINKS.company} />
          <FooterColumn title="Resources" links={LINKS.resources} />
        </div>
      </div>

      {/* Gold separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Bottom bar */}
      <div className="container-custom py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>
            &copy; {new Date().getFullYear()} Altave Realty Group. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-gold transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
