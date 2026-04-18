import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const jason = await prisma.agent.create({
    data: {
      name: 'Jason Mercer',
      slug: 'jason-mercer',
      title: 'Licensed Real Estate Broker',
      bio: 'A New York native with over 12 years in premium real estate. Jason specialises in luxury rentals and high-value sales across Manhattan and Brooklyn.',
      photo: '/agents/jason.jpg',
      email: 'jason@altaverealty.com',
      phone: '+1 (212) 555-0100',
      specialties: ['Luxury Rentals', 'Sales', 'Investment'],
      languages: ['English', 'Spanish'],
      yearsExperience: 12,
      isFeatured: true,
    },
  })

  const sophia = await prisma.agent.create({
    data: {
      name: 'Sophia Chen',
      slug: 'sophia-chen',
      title: 'Licensed Real Estate Agent',
      bio: 'Sophia brings a data-driven approach to real estate, helping clients navigate the competitive NYC market with confidence.',
      photo: '/agents/sophia.jpg',
      email: 'sophia@altaverealty.com',
      phone: '+1 (212) 555-0101',
      specialties: ['Rentals', 'First-Time Buyers'],
      languages: ['English', 'Mandarin'],
      yearsExperience: 7,
      isFeatured: true,
    },
  })

  await prisma.property.createMany({
    data: [
      {
        slug: 'luxury-2br-upper-east-side',
        title: 'Luxury 2BR in Upper East Side',
        description:
          'Stunning pre-war building with modern renovations. Features high ceilings, hardwood floors, and breathtaking city views.',
        type: 'RESIDENTIAL',
        status: 'RENT',
        price: 4500,
        address: '123 E 80th St, Apt 8B',
        city: 'Manhattan',
        area: 'Upper East Side',
        zipCode: '10075',
        lat: 40.7736,
        lng: -73.9566,
        bedrooms: 2,
        bathrooms: 1,
        sqft: 1200,
        amenities: ['Doorman', 'Gym', 'Roof Deck', 'Dishwasher', 'In-unit Laundry'],
        images: ['/properties/ues-1.jpg', '/properties/ues-2.jpg', '/properties/ues-3.jpg'],
        isFeatured: true,
        isNew: true,
        agentId: jason.id,
      },
      {
        slug: 'modern-studio-williamsburg',
        title: 'Modern Studio in Williamsburg',
        description:
          'Bright and airy studio in the heart of Williamsburg. Walking distance to L train, restaurants, and galleries.',
        type: 'STUDIO',
        status: 'RENT',
        price: 2800,
        address: '456 Bedford Ave, Apt 3A',
        city: 'Brooklyn',
        area: 'Williamsburg',
        zipCode: '11211',
        lat: 40.7136,
        lng: -73.9567,
        bedrooms: 0,
        bathrooms: 1,
        sqft: 550,
        amenities: ['Pet Friendly', 'Bike Storage', 'Exposed Brick', 'Dishwasher'],
        images: ['/properties/wburg-1.jpg', '/properties/wburg-2.jpg'],
        isFeatured: true,
        isHot: true,
        agentId: sophia.id,
      },
    ],
  })

  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Michael Torres',
        role: 'Happy Renter',
        rating: 5,
        content:
          'Altave Realty Group made finding my Manhattan apartment effortless. Jason was responsive, knowledgeable, and found us a place that exceeded our expectations.',
        isVerified: true,
        isFeatured: true,
      },
      {
        name: 'Sarah Williams',
        role: 'First-Time Buyer',
        rating: 5,
        content:
          'Sophia guided me through my first home purchase with patience and expertise. I never felt rushed or pressured. Truly a premium experience.',
        isVerified: true,
        isFeatured: true,
      },
      {
        name: 'David Park',
        role: 'Property Investor',
        rating: 5,
        content:
          'Professional, efficient, and honest. Altave Realty Group helped me acquire three investment properties in under a year. Exceptional service.',
        isVerified: true,
        isFeatured: true,
      },
    ],
  })

  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
