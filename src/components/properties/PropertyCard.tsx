'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PropertyCardData {
  id: string
  slug: string
  title: string
  address: string
  city: string
  price: number
  status: 'RENT' | 'SALE' | 'LEASED' | 'SOLD'
  type: string
  bedrooms?: number | null
  bathrooms?: number | null
  sqft?: number | null
  images: string[]
  isNew?: boolean
  isHot?: boolean
  isReduced?: boolean
  isFeatured?: boolean
  agent?: {
    name: string
    photo: string
  } | null
}

const STATUS_LABELS: Record<string, string> = {
  RENT: 'For Rent',
  SALE: 'For Sale',
  LEASED: 'Leased',
  SOLD: 'Sold',
}

const STATUS_COLORS: Record<string, string> = {
  RENT: 'bg-status-rent text-bg-base',
  SALE: 'bg-status-sale text-bg-base',
  LEASED: 'bg-text-muted text-white',
  SOLD: 'bg-text-muted text-white',
}

interface PropertyCardProps {
  property: PropertyCardData
  className?: string
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const img = property.images[0] ?? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'
  const priceLabel =
    property.status === 'RENT'
      ? `$${property.price.toLocaleString()}/mo`
      : `$${property.price.toLocaleString()}`

  return (
    <motion.article
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      className={cn(
        'group relative bg-bg-card border border-bg-border overflow-hidden transition-shadow duration-300 hover:shadow-gold hover:border-gold/40',
        className
      )}
    >
      {/* Shimmer on hover */}
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{ x: '200%', opacity: 0.08 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gold to-transparent pointer-events-none z-10"
      />

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={img}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 to-transparent" />

        {/* Status badge */}
        <span
          className={cn(
            'absolute top-4 left-4 px-3 py-1 text-xs font-heading font-bold uppercase tracking-wider',
            STATUS_COLORS[property.status]
          )}
        >
          {STATUS_LABELS[property.status]}
        </span>

        {/* Condition badges */}
        <div className="absolute top-4 left-4 mt-7 flex flex-col gap-1">
          {property.isNew && (
            <span className="px-2 py-0.5 bg-gold text-bg-base text-[10px] font-heading font-bold uppercase tracking-wider">
              New
            </span>
          )}
          {property.isHot && (
            <span className="px-2 py-0.5 bg-status-hot text-white text-[10px] font-heading font-bold uppercase tracking-wider">
              Hot
            </span>
          )}
          {property.isReduced && (
            <span className="px-2 py-0.5 bg-status-reduced text-white text-[10px] font-heading font-bold uppercase tracking-wider">
              Reduced
            </span>
          )}
        </div>

        {/* Favourite */}
        <button
          aria-label="Add to favourites"
          className="absolute top-4 right-4 w-9 h-9 bg-bg-base/60 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-gold hover:text-bg-base text-white"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Agent avatar */}
        {property.agent && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold/40">
              <Image
                src={property.agent.photo}
                alt={property.agent.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <Link href={`/properties/${property.slug}`} className="block p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-medium text-white line-clamp-1 leading-snug">
            {property.title}
          </h3>
          <span className="font-heading font-bold text-gold text-base whitespace-nowrap">
            {priceLabel}
          </span>
        </div>

        <p className="text-text-muted text-sm flex items-center gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}</span>
        </p>

        <div className="flex items-center gap-4 text-sm text-text-secondary border-t border-bg-border pt-4">
          {property.bedrooms !== undefined && property.bedrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gold" />
              {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}
            </span>
          )}
          {property.bathrooms !== undefined && property.bathrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gold" />
              {property.bathrooms} bath
            </span>
          )}
          {property.sqft && (
            <span className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-gold" />
              {property.sqft.toLocaleString()} sqft
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  )
}
