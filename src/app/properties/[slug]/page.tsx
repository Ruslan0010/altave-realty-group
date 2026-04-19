import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import {
  MapPin, Bed, Bath, Square, Calendar, Car, Star, Share2, Heart,
  CheckCircle, Home, ChevronRight, Ruler, Building2, Phone, Mail,
} from 'lucide-react'
import { PropertyGallery } from '@/components/properties/PropertyGallery'
import { InquiryForm } from '@/components/shared/InquiryForm'
import { PropertyCard, type PropertyCardData } from '@/components/properties/PropertyCard'
import { ScrollReveal } from '@/components/shared/ScrollReveal'

const MortgageCalculator = dynamic(
  () => import('@/components/properties/MortgageCalculator').then((m) => m.MortgageCalculator),
  { ssr: false }
)

interface Props {
  params: { slug: string }
}

async function getProperty(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: { agent: true },
  })
}

async function getSimilar(property: Awaited<ReturnType<typeof getProperty>>) {
  if (!property) return []
  return prisma.property.findMany({
    where: {
      id: { not: property.id },
      status: property.status,
      isAvailable: true,
      OR: [
        { area: property.area },
        { type: property.type },
      ],
    },
    include: { agent: { select: { name: true, photo: true } } },
    take: 3,
    orderBy: { isFeatured: 'desc' },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.slug)
  if (!property) return { title: 'Property Not Found' }
  return {
    title: property.title,
    description: property.description.slice(0, 155),
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const property = await getProperty(params.slug)
  if (!property) notFound()

  const similar = await getSimilar(property)

  const priceLabel =
    property.status === 'RENT'
      ? `$${property.price.toLocaleString()}/mo`
      : `$${property.price.toLocaleString()}`

  const statusLabel: Record<string, string> = {
    RENT: 'For Rent',
    SALE: 'For Sale',
    LEASED: 'Leased',
    SOLD: 'Sold',
  }

  const statusColor: Record<string, string> = {
    RENT: 'bg-status-rent text-bg-base',
    SALE: 'bg-status-sale text-bg-base',
    LEASED: 'bg-text-muted text-white',
    SOLD: 'bg-text-muted text-white',
  }

  const similarCards: PropertyCardData[] = similar.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    address: p.address,
    city: p.city,
    price: p.price,
    status: p.status as PropertyCardData['status'],
    type: p.type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms ?? null,
    sqft: p.sqft,
    images: p.images,
    isNew: p.isNew,
    isHot: p.isHot,
    isReduced: p.isReduced,
    isFeatured: p.isFeatured,
    agent: p.agent ? { name: p.agent.name, photo: p.agent.photo } : null,
  }))

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Breadcrumbs */}
      <div className="border-b border-bg-border bg-bg-elevated">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-xs font-heading text-text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/properties" className="hover:text-gold transition-colors">Properties</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary line-clamp-1">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        {/* Gallery */}
        <div className="relative mb-10">
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title + Status */}
            <ScrollReveal>
              <div className="flex flex-wrap items-start gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs font-heading font-bold uppercase tracking-wider ${statusColor[property.status]}`}>
                      {statusLabel[property.status]}
                    </span>
                    {property.isNew && (
                      <span className="px-3 py-1 bg-gold text-bg-base text-xs font-heading font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
                    {property.isHot && (
                      <span className="px-3 py-1 bg-status-hot text-white text-xs font-heading font-bold uppercase tracking-wider">
                        Hot
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-title lg:text-display font-light text-white leading-tight mb-2">
                    {property.title}
                  </h1>
                  <p className="flex items-center gap-1.5 text-text-muted text-sm">
                    <MapPin className="w-4 h-4 text-gold" />
                    {property.address}, {property.area}, {property.city}, {property.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl lg:text-4xl text-gold font-light">{priceLabel}</p>
                  {property.sqft && (
                    <p className="text-text-muted text-sm mt-1">
                      ${Math.round(property.price / property.sqft).toLocaleString()}/sqft
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button className="flex items-center gap-2 px-5 py-2.5 border border-bg-border text-text-secondary hover:border-gold/40 hover:text-gold transition-all text-xs font-heading font-semibold uppercase tracking-widest">
                  <Heart className="w-3.5 h-3.5" />
                  Save
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 border border-bg-border text-text-secondary hover:border-gold/40 hover:text-gold transition-all text-xs font-heading font-semibold uppercase tracking-widest">
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </ScrollReveal>

            {/* Key stats */}
            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-bg-border border border-bg-border">
                {property.bedrooms !== null && (
                  <div className="bg-bg-card p-5 text-center">
                    <Bed className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="text-lg font-heading font-bold text-white">
                      {property.bedrooms === 0 ? 'Studio' : property.bedrooms}
                    </p>
                    <p className="text-[10px] text-text-muted font-heading uppercase tracking-widest">
                      {property.bedrooms === 0 ? '' : 'Bedrooms'}
                    </p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="bg-bg-card p-5 text-center">
                    <Bath className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="text-lg font-heading font-bold text-white">{property.bathrooms}</p>
                    <p className="text-[10px] text-text-muted font-heading uppercase tracking-widest">Bathrooms</p>
                  </div>
                )}
                {property.sqft && (
                  <div className="bg-bg-card p-5 text-center">
                    <Square className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="text-lg font-heading font-bold text-white">{property.sqft.toLocaleString()}</p>
                    <p className="text-[10px] text-text-muted font-heading uppercase tracking-widest">Sq. Ft.</p>
                  </div>
                )}
                {property.parking !== null && property.parking !== undefined && (
                  <div className="bg-bg-card p-5 text-center">
                    <Car className="w-5 h-5 text-gold mx-auto mb-2" />
                    <p className="text-lg font-heading font-bold text-white">{property.parking}</p>
                    <p className="text-[10px] text-text-muted font-heading uppercase tracking-widest">Parking</p>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal>
              <div>
                <h2 className="font-display text-2xl font-light text-white mb-4">About This Property</h2>
                <p className="text-text-secondary leading-relaxed font-body">{property.description}</p>
              </div>
            </ScrollReveal>

            {/* Details grid */}
            <ScrollReveal>
              <div>
                <h2 className="font-display text-2xl font-light text-white mb-6">Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Property Type', value: property.type },
                    { label: 'Status', value: statusLabel[property.status] },
                    { label: 'Area', value: property.area },
                    { label: 'City', value: `${property.city}, ${property.state}` },
                    { label: 'Postal Code', value: property.zipCode },
                    property.yearBuilt && { label: 'Year Built', value: String(property.yearBuilt) },
                    property.floors && { label: 'Floors', value: String(property.floors) },
                    property.petFriendly && { label: 'Pets', value: 'Allowed' },
                    property.securityDeposit && {
                      label: 'Security Deposit',
                      value: `$${property.securityDeposit.toLocaleString()}`,
                    },
                  ]
                    .filter(Boolean)
                    .map((item) => {
                      if (!item) return null
                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between py-3 border-b border-bg-border"
                        >
                          <span className="text-sm text-text-muted font-heading">{item.label}</span>
                          <span className="text-sm text-white font-body font-medium capitalize">
                            {item.value?.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                      )
                    })}
                </div>
              </div>
            </ScrollReveal>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <ScrollReveal>
                <div>
                  <h2 className="font-display text-2xl font-light text-white mb-6">Amenities &amp; Features</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {property.amenities.map((am) => (
                      <div key={am} className="flex items-center gap-2.5 p-3 bg-bg-card border border-bg-border">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                        <span className="text-sm text-text-secondary font-body">{am}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Mortgage Calculator — only for sale listings */}
            {property.status === 'SALE' && (
              <ScrollReveal>
                <MortgageCalculator defaultPrice={property.price} />
              </ScrollReveal>
            )}
          </div>

          {/* Right — sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <ScrollReveal>
              <div className="bg-bg-card border border-bg-border p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold/40 flex-shrink-0">
                    <Image
                      src={property.agent.photo}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-sm">{property.agent.name}</h3>
                    <p className="text-text-muted text-xs mt-0.5">{property.agent.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(property.agent.rating) ? 'text-gold fill-gold' : 'text-bg-border'}`}
                        />
                      ))}
                      <span className="text-text-muted text-[10px] ml-1">{property.agent.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-5">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center gap-2.5 text-text-secondary hover:text-gold transition-colors text-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold" />
                    {property.agent.phone}
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center gap-2.5 text-text-secondary hover:text-gold transition-colors text-sm"
                  >
                    <Mail className="w-3.5 h-3.5 text-gold" />
                    {property.agent.email}
                  </a>
                </div>
                <Link
                  href={`/team/${property.agent.slug}`}
                  className="block text-center py-2.5 border border-gold/40 text-gold text-xs font-heading font-semibold uppercase tracking-widest hover:bg-gold hover:text-bg-base transition-all duration-200"
                >
                  View Agent Profile
                </Link>
              </div>
            </ScrollReveal>

            {/* Inquiry Form */}
            <ScrollReveal>
              <InquiryForm
                propertyId={property.id}
                propertyTitle={property.title}
                agentName={property.agent.name}
              />
            </ScrollReveal>
          </div>
        </div>

        {/* Similar Properties */}
        {similarCards.length > 0 && (
          <section className="mt-20">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px bg-gold/40 w-12" />
                <span className="text-gold text-xs uppercase tracking-[0.3em] font-heading font-semibold">
                  You Might Also Like
                </span>
              </div>
              <h2 className="font-display text-display font-light text-white mb-10">
                Similar <em className="italic text-gold">Properties</em>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCards.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
