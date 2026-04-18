'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, User, ChevronDown, Menu, X, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href?: string
  children?: { label: string; href: string; description?: string }[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Properties',
    children: [
      { label: 'All Properties', href: '/properties', description: 'Browse our full catalogue' },
      { label: 'Rentals', href: '/properties/rentals', description: 'Find your next home' },
      { label: 'Sales', href: '/properties/sales', description: 'Invest in NYC real estate' },
      { label: 'Commercial', href: '/properties/commercial', description: 'Office & retail spaces' },
    ],
  },
  {
    label: 'Our Company',
    children: [
      { label: 'About Us', href: '/about', description: 'Our story and mission' },
      { label: 'Our Team', href: '/team', description: 'Meet our expert agents' },
      { label: 'Property Management', href: '/property-management', description: 'Full-service management' },
      { label: 'List With Us', href: '/list-with-us', description: 'Sell or rent your property' },
      { label: 'Refer a Friend', href: '/refer-a-friend', description: 'Earn referral rewards' },
      { label: 'Join Our Team', href: '/join-our-team', description: 'Career opportunities' },
    ],
  },
  { label: 'Landlords', href: '/landlords' },
  {
    label: 'Resources',
    children: [
      { label: 'Forms', href: '/resources/forms', description: 'Download applications & forms' },
      { label: "Renter's Guide", href: '/resources/renters-guide', description: 'Everything you need to rent' },
      { label: "Buyer's Guide", href: '/resources/buyers-guide', description: 'Navigate the buying process' },
      { label: "Seller's Guide", href: '/resources/sellers-guide', description: 'Maximize your sale' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

function DropdownMenu({ items }: { items: NonNullable<NavItem['children']> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 glass rounded-sm border border-gold/20 py-2 z-50"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block px-5 py-3 group hover:bg-gold/5 transition-colors duration-150"
        >
          <span className="block text-sm font-heading font-medium text-white group-hover:text-gold transition-colors">
            {item.label}
          </span>
          {item.description && (
            <span className="block text-xs text-text-muted mt-0.5">{item.description}</span>
          )}
        </Link>
      ))}
    </motion.div>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const isActive = item.href
    ? pathname === item.href
    : item.children?.some((c) => pathname.startsWith(c.href))

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={cn(
          'text-sm font-heading font-medium uppercase tracking-widest transition-colors duration-200',
          isActive ? 'text-gold' : 'text-text-secondary hover:text-white'
        )}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 text-sm font-heading font-medium uppercase tracking-widest transition-colors duration-200',
          isActive ? 'text-gold' : 'text-text-secondary hover:text-white'
        )}
      >
        {item.label}
        <ChevronDown
          className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence>{open && <DropdownMenu items={item.children!} />}</AnimatePresence>
    </div>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    onClose()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-bg-card border-l border-bg-border z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-bg-border">
              <span className="font-display text-xl font-light tracking-widest text-white">
                ALTAVE
              </span>
              <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center py-3 text-sm font-heading font-medium uppercase tracking-widest text-text-secondary hover:text-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between py-3 text-sm font-heading font-medium uppercase tracking-widest text-text-secondary hover:text-white transition-colors"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'w-3.5 h-3.5 transition-transform duration-200',
                            expanded === item.label && 'rotate-180'
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {expanded === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-2 space-y-1">
                              {item.children!.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block py-2 text-sm text-text-muted hover:text-gold transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </nav>

            <div className="px-6 pb-8 space-y-3 border-t border-bg-border pt-6">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-3 border border-bg-border text-sm font-heading font-medium uppercase tracking-widest text-text-secondary hover:text-white hover:border-gold/40 transition-all"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center w-full py-3 bg-gold text-bg-base text-sm font-heading font-semibold uppercase tracking-widest hover:bg-gold-light transition-colors"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-500',
          scrolled
            ? 'glass border-b border-gold/10 shadow-lg'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Building2 className="w-6 h-6 text-gold transition-transform duration-300 group-hover:scale-110" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-medium tracking-[0.2em] text-white uppercase">
                  Altave
                </span>
                <span className="font-heading text-[9px] font-semibold tracking-[0.35em] text-gold uppercase">
                  Realty Group
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.label} item={item} />
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/favorites"
                className="hidden sm:flex items-center gap-1.5 text-text-secondary hover:text-gold transition-colors"
                aria-label="Favorites"
              >
                <Heart className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 text-sm font-heading font-medium uppercase tracking-widest text-text-secondary hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/contact"
                className="hidden lg:block px-5 py-2.5 bg-gold text-bg-base text-xs font-heading font-semibold uppercase tracking-widest hover:bg-gold-light transition-colors duration-200"
              >
                Get Started
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-text-secondary hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
