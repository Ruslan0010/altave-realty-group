'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = ['Rent', 'Buy', 'Commercial'] as const
type Tab = (typeof TABS)[number]

const CITIES = ['All Cities', 'Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island', 'Hoboken']
const BEDROOMS = ['Any', 'Studio', '1', '2', '3', '4+']
const MAX_PRICES: Record<Tab, string[]> = {
  Rent: ['Any Price', '$1,500/mo', '$2,500/mo', '$3,500/mo', '$5,000/mo', '$7,500/mo', '$10,000+/mo'],
  Buy: ['Any Price', '$500K', '$750K', '$1M', '$1.5M', '$2M', '$3M+'],
  Commercial: ['Any Price', '$3,000/mo', '$5,000/mo', '$10,000/mo', '$20,000/mo', '$50,000+/mo'],
}

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative flex-1 min-w-[130px]">
      <label className="block text-text-muted text-[10px] uppercase tracking-widest mb-1 font-heading">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent text-white text-sm font-body pr-6 py-1 focus:outline-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-bg-elevated text-white">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
      </div>
    </div>
  )
}

function SearchBar() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('Rent')
  const [city, setCity] = useState('All Cities')
  const [beds, setBeds] = useState('Any')
  const [maxPrice, setMaxPrice] = useState('Any Price')

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('type', tab.toLowerCase())
    if (city !== 'All Cities') params.set('city', city)
    if (beds !== 'Any') params.set('beds', beds)
    if (maxPrice !== 'Any Price') params.set('maxPrice', maxPrice)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="glass rounded-sm w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gold/20">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-3.5 text-xs font-heading font-semibold uppercase tracking-widest transition-all duration-200',
              tab === t
                ? 'text-gold border-b-2 border-gold -mb-px'
                : 'text-text-muted hover:text-white'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="p-5 flex flex-col sm:flex-row items-end gap-5">
        <Select label="City" options={CITIES} value={city} onChange={setCity} />
        <div className="hidden sm:block w-px h-10 bg-bg-border self-center" />
        <Select label="Bedrooms" options={BEDROOMS} value={beds} onChange={setBeds} />
        <div className="hidden sm:block w-px h-10 bg-bg-border self-center" />
        <Select label="Max Price" options={MAX_PRICES[tab]} value={maxPrice} onChange={setMaxPrice} />

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gold text-bg-base font-heading font-semibold text-xs uppercase tracking-widest hover:bg-gold-light transition-colors duration-200 whitespace-nowrap w-full sm:w-auto"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </div>
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 180])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Parallax bg */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-20 grain">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 via-bg-base/30 to-bg-base" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-base/40 via-transparent to-bg-base/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gold uppercase tracking-[0.4em] text-xs font-heading font-semibold mb-6"
        >
          New York&apos;s Premier Real Estate
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-hero font-light text-white leading-[1.05]"
        >
          Elevate Your
          <motion.em
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-gold italic block"
          >
            Space
          </motion.em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 text-text-secondary font-body text-lg max-w-xl"
        >
          Premium rentals, sales, and commercial properties across New York City and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full mt-10"
        >
          <SearchBar />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-text-muted text-[10px] uppercase tracking-widest font-heading">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border border-gold/40 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
