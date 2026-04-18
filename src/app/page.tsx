import { HeroSection } from '@/components/home/HeroSection'
import { StatsSection } from '@/components/home/StatsSection'
import { FeaturedListings } from '@/components/home/FeaturedListings'
import { ExploreByCity } from '@/components/home/ExploreByCity'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { AgentsSection } from '@/components/home/AgentsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { PartnersBar } from '@/components/home/PartnersBar'
import { prisma } from '@/lib/prisma'
import type { PropertyCardData } from '@/components/properties/PropertyCard'
import type { AgentCardData } from '@/components/home/AgentsSection'
import type { TestimonialData } from '@/components/home/TestimonialsSection'

interface HomeData {
  properties: PropertyCardData[]
  agents: AgentCardData[]
  testimonials: TestimonialData[]
}

async function getHomeData(): Promise<HomeData> {
  try {
    const [rawProperties, rawAgents, rawTestimonials] = await Promise.all([
      prisma.property.findMany({
        where: { isFeatured: true, isAvailable: true },
        include: { agent: { select: { name: true, photo: true } } },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.agent.findMany({
        where: { isFeatured: true, isActive: true },
        orderBy: { yearsExperience: 'desc' },
        take: 4,
      }),
      prisma.testimonial.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
    ])

    const properties: PropertyCardData[] = rawProperties.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      address: p.address,
      city: p.city,
      price: p.price,
      status: p.status as PropertyCardData['status'],
      type: p.type,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqft: p.sqft,
      images: p.images,
      isNew: p.isNew,
      isHot: p.isHot,
      isReduced: p.isReduced,
      isFeatured: p.isFeatured,
      agent: p.agent,
    }))

    const agents: AgentCardData[] = rawAgents.map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      title: a.title,
      photo: a.photo,
      specialties: a.specialties,
      rating: a.rating,
      propertiesSold: a.propertiesSold,
      yearsExperience: a.yearsExperience,
      linkedin: a.linkedin,
      instagram: a.instagram,
    }))

    const testimonials: TestimonialData[] = rawTestimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      avatar: t.avatar,
      rating: t.rating,
      content: t.content,
    }))

    return { properties, agents, testimonials }
  } catch {
    return { properties: [], agents: [], testimonials: [] }
  }
}

export default async function HomePage() {
  const { properties: mappedProperties, agents: mappedAgents, testimonials: mappedTestimonials } =
    await getHomeData()

  const fallbackProperties: PropertyCardData[] = mappedProperties.length > 0 ? mappedProperties : [
    {
      id: '1',
      slug: 'luxury-2br-upper-east-side',
      title: 'Luxury 2BR in Upper East Side',
      address: '123 E 80th St, Apt 8B',
      city: 'Manhattan',
      price: 4500,
      status: 'RENT',
      type: 'RESIDENTIAL',
      bedrooms: 2,
      bathrooms: 1,
      sqft: 1200,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'],
      isNew: true,
      isFeatured: true,
    },
    {
      id: '2',
      slug: 'modern-studio-williamsburg',
      title: 'Modern Studio in Williamsburg',
      address: '456 Bedford Ave, Apt 3A',
      city: 'Brooklyn',
      price: 2800,
      status: 'RENT',
      type: 'STUDIO',
      bedrooms: 0,
      bathrooms: 1,
      sqft: 550,
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'],
      isHot: true,
      isFeatured: true,
    },
    {
      id: '3',
      slug: 'penthouse-tribeca',
      title: 'Penthouse Loft in Tribeca',
      address: '88 Leonard St, PH',
      city: 'Manhattan',
      price: 12500,
      status: 'RENT',
      type: 'LOFT',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2800,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'],
      isFeatured: true,
    },
  ]

  const fallbackAgents: AgentCardData[] = mappedAgents.length > 0 ? mappedAgents : [
    {
      id: '1',
      slug: 'jason-mercer',
      name: 'Jason Mercer',
      title: 'Licensed Real Estate Broker',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      specialties: ['Luxury Rentals', 'Sales', 'Investment'],
      rating: 5,
      propertiesSold: 120,
      yearsExperience: 12,
    },
    {
      id: '2',
      slug: 'sophia-chen',
      name: 'Sophia Chen',
      title: 'Licensed Real Estate Agent',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      specialties: ['Rentals', 'First-Time Buyers'],
      rating: 5,
      propertiesSold: 74,
      yearsExperience: 7,
    },
    {
      id: '3',
      slug: 'marcus-hayes',
      name: 'Marcus Hayes',
      title: 'Senior Commercial Specialist',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      specialties: ['Commercial', 'Investment', 'Leasing'],
      rating: 4.9,
      propertiesSold: 89,
      yearsExperience: 10,
    },
    {
      id: '4',
      slug: 'diana-walsh',
      name: 'Diana Walsh',
      title: 'Luxury Property Specialist',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      specialties: ['Luxury Sales', 'Condos', 'Relocation'],
      rating: 5,
      propertiesSold: 63,
      yearsExperience: 8,
    },
  ]

  const fallbackTestimonials: TestimonialData[] = mappedTestimonials.length > 0 ? mappedTestimonials : [
    {
      id: '1',
      name: 'Michael Torres',
      role: 'Happy Renter',
      rating: 5,
      content: 'Altave Realty Group made finding my Manhattan apartment effortless. Jason was responsive, knowledgeable, and found us a place that exceeded our expectations.',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      role: 'First-Time Buyer',
      rating: 5,
      content: 'Sophia guided me through my first home purchase with patience and expertise. I never felt rushed or pressured. Truly a premium experience.',
    },
    {
      id: '3',
      name: 'David Park',
      role: 'Property Investor',
      rating: 5,
      content: 'Professional, efficient, and honest. Altave Realty Group helped me acquire three investment properties in under a year. Exceptional service.',
    },
  ]

  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedListings properties={fallbackProperties} />
      <ExploreByCity />
      <WhyChooseUs />
      <AgentsSection agents={fallbackAgents} />
      <TestimonialsSection testimonials={fallbackTestimonials} />
      <PartnersBar />
    </>
  )
}
