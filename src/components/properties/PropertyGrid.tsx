'use client'

import { motion } from 'framer-motion'
import { PropertyCard, type PropertyCardData } from './PropertyCard'
import { staggerContainer, fadeUp } from '@/lib/animations'
import { Building2 } from 'lucide-react'

interface PropertyGridProps {
  properties: PropertyCardData[]
  loading?: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-bg-card border border-bg-border overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-bg-elevated" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-bg-elevated rounded w-3/4" />
        <div className="h-3 bg-bg-elevated rounded w-1/2" />
        <div className="flex gap-4 pt-2 border-t border-bg-border mt-4">
          <div className="h-3 bg-bg-elevated rounded w-12" />
          <div className="h-3 bg-bg-elevated rounded w-12" />
          <div className="h-3 bg-bg-elevated rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function PropertyGrid({ properties, loading }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Building2 className="w-12 h-12 text-text-muted mb-4" />
        <h3 className="font-display text-2xl text-white mb-2">No properties found</h3>
        <p className="text-text-muted text-sm max-w-xs">
          Try adjusting your filters to find more results.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {properties.map((p) => (
        <motion.div key={p.id} variants={fadeUp}>
          <PropertyCard property={p} />
        </motion.div>
      ))}
    </motion.div>
  )
}
