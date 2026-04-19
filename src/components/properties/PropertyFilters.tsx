'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FilterState {
  status: string
  areas: string[]
  bedrooms: string
  minPrice: number
  maxPrice: number
  minSqft: number
  maxSqft: number
  amenities: string[]
  petFriendly: boolean
  type: string
}

export const DEFAULT_FILTERS: FilterState = {
  status: '',
  areas: [],
  bedrooms: '',
  minPrice: 0,
  maxPrice: 0,
  minSqft: 0,
  maxSqft: 0,
  amenities: [],
  petFriendly: false,
  type: '',
}

const AREAS = [
  'Downtown Halifax',
  'North End',
  'South End',
  'Clayton Park',
  'Fairview',
  'Rockingham',
  'Bedford',
  'Dartmouth',
]

const AMENITIES_LIST = [
  'In-unit Laundry',
  'Dishwasher',
  'Gym',
  'Parking',
  'Balcony',
  'Rooftop Terrace',
  'Concierge',
  'Storage',
  'Bike Storage',
  'Harbour Views',
  'Waterfront',
]

const RENT_PRICE_MAX = 6000
const SALE_PRICE_MAX = 1500000

interface PropertyFiltersProps {
  filters: FilterState
  onChange: (f: FilterState) => void
  onReset: () => void
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

function PriceSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  const pct = max > 0 ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs text-text-muted font-heading uppercase tracking-widest">{label}</span>
        <span className="text-xs text-gold font-heading font-semibold">{value === 0 ? 'Any' : format(value)}</span>
      </div>
      <div className="relative h-1 bg-bg-border rounded">
        <div className="absolute h-1 bg-gold rounded" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gold border-2 border-bg-base rounded-full pointer-events-none shadow"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  )
}

export function PropertyFilters({
  filters,
  onChange,
  onReset,
  className,
  isMobile,
  onClose,
}: PropertyFiltersProps) {
  const [openSection, setOpenSection] = useState<string | null>('status')

  const isSale = filters.status === 'SALE'
  const priceMax = isSale ? SALE_PRICE_MAX : RENT_PRICE_MAX
  const priceStep = isSale ? 25000 : 100

  const toggleArea = (area: string) => {
    const next = filters.areas.includes(area)
      ? filters.areas.filter((a) => a !== area)
      : [...filters.areas, area]
    onChange({ ...filters, areas: next })
  }

  const toggleAmenity = (am: string) => {
    const next = filters.amenities.includes(am)
      ? filters.amenities.filter((a) => a !== am)
      : [...filters.amenities, am]
    onChange({ ...filters, amenities: next })
  }

  const activeCount = [
    filters.status,
    filters.areas.length > 0,
    filters.bedrooms,
    filters.maxPrice > 0,
    filters.maxSqft > 0,
    filters.amenities.length > 0,
    filters.petFriendly,
  ].filter(Boolean).length

  const Section = ({
    id,
    title,
    children,
  }: {
    id: string
    title: string
    children: React.ReactNode
  }) => (
    <div className="border-b border-bg-border">
      <button
        onClick={() => setOpenSection(openSection === id ? null : id)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-sm font-heading font-semibold text-white uppercase tracking-widest">{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-text-muted transition-transform duration-200',
            openSection === id && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {openSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className={cn('bg-bg-card border border-bg-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-bg-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gold" />
          <span className="font-heading font-bold text-white text-sm uppercase tracking-widest">Filters</span>
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-gold text-bg-base text-[10px] font-bold font-heading rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-text-muted hover:text-gold transition-colors font-heading"
            >
              Reset
            </button>
          )}
          {isMobile && onClose && (
            <button onClick={onClose} className="text-text-muted hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Status */}
        <Section id="status" title="Listing Type">
          <div className="flex flex-col gap-2">
            {[
              { value: '', label: 'All Listings' },
              { value: 'RENT', label: 'For Rent' },
              { value: 'SALE', label: 'For Sale' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={cn(
                    'w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors',
                    filters.status === opt.value
                      ? 'bg-gold border-gold'
                      : 'border-bg-border group-hover:border-gold/50'
                  )}
                >
                  {filters.status === opt.value && <div className="w-2 h-2 bg-bg-base" />}
                </div>
                <span className="text-sm text-text-secondary group-hover:text-white transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Property Type */}
        <Section id="type" title="Property Type">
          <div className="flex flex-wrap gap-2">
            {['', 'RESIDENTIAL', 'CONDO', 'TOWNHOUSE', 'STUDIO', 'LOFT', 'COMMERCIAL'].map((t) => (
              <button
                key={t}
                onClick={() => onChange({ ...filters, type: t })}
                className={cn(
                  'px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider border transition-all duration-200',
                  filters.type === t
                    ? 'bg-gold border-gold text-bg-base'
                    : 'border-bg-border text-text-muted hover:border-gold/50 hover:text-white'
                )}
              >
                {t === '' ? 'All' : t === 'RESIDENTIAL' ? 'House' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </Section>

        {/* Neighbourhoods */}
        <Section id="areas" title="Neighbourhood">
          <div className="flex flex-col gap-2">
            {AREAS.map((area) => (
              <label key={area} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={cn(
                    'w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors',
                    filters.areas.includes(area)
                      ? 'bg-gold border-gold'
                      : 'border-bg-border group-hover:border-gold/50'
                  )}
                  onClick={() => toggleArea(area)}
                >
                  {filters.areas.includes(area) && (
                    <svg className="w-2.5 h-2.5 text-bg-base" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M1 5l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm text-text-secondary group-hover:text-white transition-colors"
                  onClick={() => toggleArea(area)}
                >
                  {area}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Bedrooms */}
        <Section id="bedrooms" title="Bedrooms">
          <div className="flex flex-wrap gap-2">
            {['', 'Studio', '1', '2', '3', '4+'].map((b) => (
              <button
                key={b}
                onClick={() => onChange({ ...filters, bedrooms: b })}
                className={cn(
                  'px-3 py-1.5 text-xs font-heading font-semibold uppercase tracking-wider border transition-all duration-200 min-w-[52px]',
                  filters.bedrooms === b
                    ? 'bg-gold border-gold text-bg-base'
                    : 'border-bg-border text-text-muted hover:border-gold/50 hover:text-white'
                )}
              >
                {b === '' ? 'Any' : b}
              </button>
            ))}
          </div>
        </Section>

        {/* Price */}
        <Section id="price" title="Max Price">
          <PriceSlider
            label="Up to"
            value={filters.maxPrice}
            min={0}
            max={priceMax}
            step={priceStep}
            onChange={(v) => onChange({ ...filters, maxPrice: v })}
            format={(v) =>
              isSale
                ? v >= 1000000
                  ? `$${(v / 1000000).toFixed(1)}M`
                  : `$${(v / 1000).toFixed(0)}K`
                : `$${v.toLocaleString()}/mo`
            }
          />
        </Section>

        {/* Size */}
        <Section id="sqft" title="Min Size (sqft)">
          <PriceSlider
            label="At least"
            value={filters.minSqft}
            min={0}
            max={4000}
            step={100}
            onChange={(v) => onChange({ ...filters, minSqft: v })}
            format={(v) => `${v.toLocaleString()} sqft`}
          />
        </Section>

        {/* Amenities */}
        <Section id="amenities" title="Amenities">
          <div className="flex flex-col gap-2">
            {AMENITIES_LIST.map((am) => (
              <label key={am} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={cn(
                    'w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors',
                    filters.amenities.includes(am)
                      ? 'bg-gold border-gold'
                      : 'border-bg-border group-hover:border-gold/50'
                  )}
                  onClick={() => toggleAmenity(am)}
                >
                  {filters.amenities.includes(am) && (
                    <svg className="w-2.5 h-2.5 text-bg-base" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M1 5l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm text-text-secondary group-hover:text-white transition-colors"
                  onClick={() => toggleAmenity(am)}
                >
                  {am}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Pet Friendly */}
        <div className="pt-4">
          <button
            onClick={() => onChange({ ...filters, petFriendly: !filters.petFriendly })}
            className="flex items-center justify-between w-full"
          >
            <span className="text-sm font-heading font-semibold text-white uppercase tracking-widest">
              Pet Friendly
            </span>
            <div
              className={cn(
                'relative w-10 h-5 rounded-full transition-colors duration-200',
                filters.petFriendly ? 'bg-gold' : 'bg-bg-border'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                  filters.petFriendly ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
