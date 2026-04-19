'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, LayoutGrid, List, Map, X, ChevronDown } from 'lucide-react'
import { PropertyFilters, DEFAULT_FILTERS, type FilterState } from '@/components/properties/PropertyFilters'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import type { PropertyCardData } from '@/components/properties/PropertyCard'
import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

const PropertyMap = dynamic(
  () => import('@/components/properties/PropertyMap').then((m) => m.PropertyMap),
  { ssr: false }
)

type ViewMode = 'grid' | 'map' | 'list'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'sqft_desc', label: 'Largest First' },
]

function PropertiesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    status: searchParams.get('status') ?? '',
    areas: searchParams.get('area') ? [searchParams.get('area')!] : [],
  }))

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sort, setSort] = useState('newest')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [properties, setProperties] = useState<PropertyCardData[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchProperties = useCallback(
    async (f: FilterState, p: number, append = false) => {
      if (!append) setLoading(true)
      else setLoadingMore(true)

      const params = new URLSearchParams()
      if (f.status) params.set('status', f.status)
      if (f.type) params.set('type', f.type)
      if (f.areas.length) params.set('areas', f.areas.join(','))
      if (f.bedrooms) params.set('beds', f.bedrooms)
      if (f.maxPrice > 0) params.set('maxPrice', String(f.maxPrice))
      if (f.minSqft > 0) params.set('minSqft', String(f.minSqft))
      if (f.petFriendly) params.set('petFriendly', 'true')
      params.set('sort', sort)
      params.set('page', String(p))
      params.set('limit', '9')

      try {
        const res = await fetch(`/api/properties?${params}`)
        const data = await res.json()
        setProperties((prev) => (append ? [...prev, ...data.properties] : data.properties))
        setTotal(data.total ?? 0)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [sort]
  )

  useEffect(() => {
    setPage(1)
    fetchProperties(filters, 1, false)
  }, [filters, sort, fetchProperties])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    fetchProperties(filters, next, true)
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const hasMore = properties.length < total

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Page Hero */}
      <div className="relative py-20 lg:py-28 bg-bg-elevated border-b border-bg-border overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=60')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/60 to-bg-elevated" />
        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-gold/40 w-12" />
              <span className="text-gold text-xs uppercase tracking-[0.3em] font-heading font-semibold">
                Halifax, Nova Scotia
              </span>
            </div>
            <h1 className="font-display text-display font-light text-white">
              Browse <em className="italic text-gold">Properties</em>
            </h1>
            <p className="mt-4 text-text-secondary max-w-xl">
              Rentals, sales, and commercial spaces across Halifax Regional Municipality. Updated daily.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-text-secondary text-sm font-body">
            {loading ? (
              <span className="text-text-muted">Searching…</span>
            ) : (
              <>
                <span className="text-white font-semibold">{total}</span> properties found
              </>
            )}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-bg-border text-text-secondary hover:text-white hover:border-gold/40 transition-all text-xs font-heading font-semibold uppercase tracking-widest"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-bg-card border border-bg-border text-text-secondary text-xs font-heading py-2.5 pl-4 pr-10 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-widest cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-bg-card normal-case tracking-normal">
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            </div>

            {/* View mode */}
            <div className="flex border border-bg-border">
              {([['grid', LayoutGrid], ['list', List], ['map', Map]] as const).map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center transition-colors',
                    viewMode === mode ? 'bg-gold text-bg-base' : 'text-text-muted hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28">
              <PropertyFilters filters={filters} onChange={setFilters} onReset={handleReset} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {viewMode === 'map' ? (
              <div className="h-[70vh] border border-bg-border overflow-hidden">
                <PropertyMap properties={properties} />
              </div>
            ) : (
              <>
                <PropertyGrid
                  properties={properties}
                  loading={loading}
                />

                {hasMore && !loading && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-10 py-4 border border-gold text-gold font-heading font-semibold text-xs uppercase tracking-widest hover:bg-gold hover:text-bg-base transition-all duration-300 disabled:opacity-50"
                    >
                      {loadingMore ? 'Loading…' : `Load More (${total - properties.length} remaining)`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bg-base/80 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 z-50 overflow-y-auto lg:hidden"
            >
              <PropertyFilters
                filters={filters}
                onChange={setFilters}
                onReset={handleReset}
                isMobile
                onClose={() => setMobileFiltersOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense>
      <PropertiesContent />
    </Suspense>
  )
}
