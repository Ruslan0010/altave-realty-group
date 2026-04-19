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
      slug: 'downtown-waterfront-2br-condo',
      title: 'Waterfront 2BR Condo — Downtown Halifax',
      address: '1583 Barrington St, Unit 1204',
      city: 'Halifax',
      price: 2800,
      status: 'RENT',
      type: 'CONDO',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1050,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'],
      isNew: true,
      isHot: true,
      isFeatured: true,
    },
    {
      id: '2',
      slug: 'north-end-studio-trendy',
      title: 'Trendy Studio — North End Halifax',
      address: '2305 Agricola St, Unit 201',
      city: 'Halifax',
      price: 1550,
      status: 'RENT',
      type: 'STUDIO',
      bedrooms: 0,
      bathrooms: 1,
      sqft: 490,
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'],
      isNew: true,
      isFeatured: true,
    },
    {
      id: '3',
      slug: 'bedford-waterfront-4br-home-sale',
      title: 'Waterfront 4BR Home — Bedford',
      address: '88 Shore Dr',
      city: 'Bedford',
      price: 1250000,
      status: 'SALE',
      type: 'RESIDENTIAL',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3400,
      images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80'],
      isHot: true,
      isFeatured: true,
    },
  ]

  const fallbackAgents: AgentCardData[] = mappedAgents.length > 0 ? mappedAgents : [
    {
      id: '1',
      slug: 'michael-reeves',
      name: 'Michael Reeves',
      title: 'Licensed Real Estate Broker',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      specialties: ['Luxury Rentals', 'Waterfront Sales', 'Investment'],
      rating: 4.9,
      propertiesSold: 312,
      yearsExperience: 14,
    },
    {
      id: '2',
      slug: 'sarah-thornton',
      name: 'Sarah Thornton',
      title: 'Senior Real Estate Agent',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      specialties: ['Rentals', 'First-Time Buyers'],
      rating: 4.8,
      propertiesSold: 198,
      yearsExperience: 8,
    },
    {
      id: '3',
      slug: 'david-nguyen',
      name: 'David Nguyen',
      title: 'Commercial & Residential Specialist',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      specialties: ['Commercial', 'New Developments'],
      rating: 4.9,
      propertiesSold: 241,
      yearsExperience: 10,
    },
    {
      id: '4',
      slug: 'emma-clarke',
      name: 'Emma Clarke',
      title: 'Rental & Relocation Specialist',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      specialties: ['Relocation', 'Rentals', 'Townhouses'],
      rating: 4.7,
      propertiesSold: 154,
      yearsExperience: 6,
    },
  ]

  const fallbackTestimonials: TestimonialData[] = mappedTestimonials.length > 0 ? mappedTestimonials : [
    {
      id: '1',
      name: 'Jessica Palmer',
      role: 'Rented a condo, Downtown Halifax',
      rating: 5,
      content: 'Altave made our move to Halifax so easy. Sarah found us an incredible waterfront condo within two weeks of us reaching out. Smooth and professional from start to finish.',
    },
    {
      id: '2',
      name: 'Thomas Bergmann',
      role: 'Purchased a home, Bedford',
      rating: 5,
      content: "Michael negotiated an excellent price on our Bedford waterfront home. His knowledge of the Halifax market is unmatched. We'll never use another agent.",
    },
    {
      id: '3',
      name: 'Priya Sharma',
      role: 'Rented a townhouse, Clayton Park',
      rating: 5,
      content: 'Emma was fantastic — extremely responsive and went above and beyond to show us properties that matched our criteria. We love our new home in Clayton Park!',
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
