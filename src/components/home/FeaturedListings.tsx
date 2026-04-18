'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PropertyCard, type PropertyCardData } from '@/components/properties/PropertyCard'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { staggerContainer, fadeUp } from '@/lib/animations'
import { cn } from '@/lib/utils'

const TABS = ['All', 'Rentals', 'Sales', 'Commercial'] as const
type Tab = (typeof TABS)[number]

interface FeaturedListingsProps {
  properties: PropertyCardData[]
}

export function FeaturedListings({ properties }: FeaturedListingsProps) {
  const [tab, setTab] = useState<Tab>('All')

  const filtered = properties.filter((p) => {
    if (tab === 'All') return true
    if (tab === 'Rentals') return p.status === 'RENT'
    if (tab === 'Sales') return p.status === 'SALE'
    if (tab === 'Commercial') return p.type === 'COMMERCIAL'
    return true
  })

  return (
    <section className="py-24 lg:py-32 bg-bg-base">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <SectionTitle
            overline="Handpicked for You"
            title="Featured"
            titleGold="Properties"
            description="Explore our curated selection of premium properties across New York City."
          />

          {/* Tabs */}
          <div className="flex items-center gap-1 border border-bg-border p-1 self-start lg:self-auto flex-shrink-0">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-2 text-xs font-heading font-semibold uppercase tracking-widest transition-all duration-200',
                  tab === t
                    ? 'bg-gold text-bg-base'
                    : 'text-text-muted hover:text-white'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          key={tab}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.length > 0 ? (
            filtered.slice(0, 6).map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <PropertyCard property={p} />
              </motion.div>
            ))
          ) : (
            <motion.p variants={fadeUp} className="col-span-3 text-center text-text-muted py-12">
              No properties in this category yet.
            </motion.p>
          )}
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <MagneticButton>
            <Link
              href="/properties"
              className="flex items-center gap-3 px-10 py-4 border border-gold text-gold font-heading font-semibold text-xs uppercase tracking-widest hover:bg-gold hover:text-bg-base transition-all duration-300"
            >
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
