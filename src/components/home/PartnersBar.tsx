'use client'

import { motion } from 'framer-motion'

const PARTNERS = [
  'Douglas Elliman',
  'Corcoran Group',
  'Compass',
  'Brown Harris Stevens',
  'Halstead',
  'Warburg Realty',
  'Sotheby\'s International',
  'Christie\'s Real Estate',
]

export function PartnersBar() {
  const doubled = [...PARTNERS, ...PARTNERS]

  return (
    <section className="py-12 bg-bg-card border-y border-bg-border overflow-hidden">
      <p className="text-center text-text-muted text-[10px] font-heading uppercase tracking-[0.3em] mb-8">
        Trusted Partners &amp; Affiliations
      </p>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-card to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-16 w-max"
        >
          {doubled.map((partner, i) => (
            <div
              key={`${partner}-${i}`}
              className="flex items-center gap-3 text-text-muted hover:text-gold transition-colors duration-200 whitespace-nowrap group cursor-default"
            >
              <div className="w-1.5 h-1.5 bg-gold/40 group-hover:bg-gold transition-colors duration-200" />
              <span className="font-heading text-sm font-medium uppercase tracking-wider">
                {partner}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
