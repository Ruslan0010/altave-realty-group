# 🗄️ Database — Altave Realty Group

## Stack
- **ORM:** Prisma
- **Database:** PostgreSQL via Supabase
- **File:** `prisma/schema.prisma`

---

## Full Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ── PROPERTIES ──────────────────────────────

model Property {
  id    String @id @default(cuid())
  slug  String @unique

  title       String
  description String  @db.Text
  type        PropertyType
  status      PropertyStatus

  price        Int
  pricePerSqft Int?

  address  String
  city     String
  area     String
  state    String  @default("NY")
  zipCode  String
  lat      Float?
  lng      Float?

  bedrooms     Int?
  bathrooms    Float?
  sqft         Int?
  yearBuilt    Int?
  floors       Int?
  parking      Int?

  amenities String[]
  utilities String[]

  images         String[]
  videoUrl       String?
  virtualTourUrl String?
  floorPlanUrl   String?

  isAvailable Boolean @default(true)
  isFeatured  Boolean @default(false)
  isNew       Boolean @default(true)
  isHot       Boolean @default(false)
  isReduced   Boolean @default(false)

  availableFrom   DateTime?
  securityDeposit Int?
  petFriendly     Boolean @default(false)

  agentId      String
  agent        Agent         @relation(fields: [agentId], references: [id])
  favorites    Favorite[]
  applications Application[]
  inquiries    Inquiry[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([city, status])
  @@index([type, status])
  @@index([price])
  @@index([isFeatured])
}

enum PropertyType {
  RESIDENTIAL
  COMMERCIAL
  CONDO
  TOWNHOUSE
  STUDIO
  LOFT
}

enum PropertyStatus {
  RENT
  SALE
  LEASED
  SOLD
}

// ── AGENTS ──────────────────────────────────

model Agent {
  id   String @id @default(cuid())
  slug String @unique

  name  String
  title String
  bio   String @db.Text
  photo String

  email    String @unique
  phone    String
  linkedin String?
  instagram String?

  propertiesSold  Int   @default(0)
  yearsExperience Int   @default(0)
  rating          Float @default(5.0)

  specialties String[]
  languages   String[]

  isActive   Boolean @default(true)
  isFeatured Boolean @default(false)

  properties  Property[]
  reviews     AgentReview[]

  createdAt DateTime @default(now())
}

model AgentReview {
  id          String @id @default(cuid())
  rating      Int
  comment     String @db.Text
  authorName  String
  authorAvatar String?
  agentId     String
  agent       Agent  @relation(fields: [agentId], references: [id])
  createdAt   DateTime @default(now())
}

// ── USERS ────────────────────────────────────

model User {
  id         String @id @default(cuid())
  supabaseId String @unique

  email     String @unique
  firstName String
  lastName  String
  phone     String?
  avatar    String?
  role      UserRole @default(CLIENT)

  alertEmail Boolean @default(true)
  alertSMS   Boolean @default(false)

  favorites     Favorite[]
  applications  Application[]
  savedSearches SavedSearch[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  CLIENT
  AGENT
  ADMIN
}

// ── FAVORITES ────────────────────────────────

model Favorite {
  id         String   @id @default(cuid())
  userId     String
  propertyId String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())

  @@unique([userId, propertyId])
}

// ── APPLICATIONS ─────────────────────────────

model Application {
  id         String   @id @default(cuid())
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id])
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])

  firstName        String
  lastName         String
  email            String
  phone            String
  annualIncome     Int?
  creditScore      String?
  employmentStatus String?
  employer         String?

  moveInDate         DateTime?
  occupants          Int     @default(1)
  hasPets            Boolean @default(false)
  petDescription     String?
  message            String? @db.Text
  documents          String[]

  status    ApplicationStatus @default(PENDING)
  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  APPROVED
  REJECTED
  CANCELLED
}

// ── INQUIRIES ────────────────────────────────

model Inquiry {
  id         String    @id @default(cuid())
  propertyId String?
  property   Property? @relation(fields: [propertyId], references: [id])

  type    InquiryType
  name    String
  email   String
  phone   String?
  message String      @db.Text

  lookingFor String?
  budget     String?
  timeline   String?
  isRead     Boolean  @default(false)

  createdAt DateTime @default(now())
}

enum InquiryType {
  RENT
  PURCHASE
  SELL
  PROPERTY_MANAGEMENT
  VALUATION
  MORTGAGE
  GENERAL
}

// ── SAVED SEARCHES ───────────────────────────

model SavedSearch {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  name         String
  filters      Json
  alertEnabled Boolean        @default(true)
  frequency    AlertFrequency @default(DAILY)

  createdAt DateTime @default(now())
}

enum AlertFrequency {
  REALTIME
  DAILY
  WEEKLY
}

// ── BLOG ─────────────────────────────────────

model BlogPost {
  id   String @id @default(cuid())
  slug String @unique

  title      String
  excerpt    String
  content    String       @db.Text
  coverImage String
  category   BlogCategory
  tags       String[]

  author       String
  authorAvatar String?
  readingTime  Int?

  isPublished Boolean   @default(false)
  publishedAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum BlogCategory {
  RENTERS_TIPS
  BUYERS_GUIDE
  SELLERS_GUIDE
  MARKET_UPDATE
  NEIGHBORHOOD
  INVESTMENT
  PROPERTY_MANAGEMENT
}

// ── TESTIMONIALS ─────────────────────────────

model Testimonial {
  id         String @id @default(cuid())
  name       String
  avatar     String?
  role       String
  rating     Int
  content    String @db.Text
  isVerified Boolean @default(false)
  isFeatured Boolean @default(false)
  createdAt  DateTime @default(now())
}
```

---

## Prisma Client Setup

**File: `src/lib/prisma.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Seed Data

**File: `prisma/seed.ts`**

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Agents
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
    }
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
    }
  })

  // Properties
  await prisma.property.createMany({
    data: [
      {
        slug: 'luxury-2br-upper-east-side',
        title: 'Luxury 2BR in Upper East Side',
        description: 'Stunning pre-war building with modern renovations. Features high ceilings, hardwood floors, and breathtaking city views.',
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
        description: 'Bright and airy studio in the heart of Williamsburg. Walking distance to L train, restaurants, and galleries.',
        type: 'RESIDENTIAL',
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
    ]
  })

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Michael Torres',
        role: 'Happy Renter',
        rating: 5,
        content: 'Altave Realty Group made finding my Manhattan apartment effortless. Jason was responsive, knowledgeable, and found us a place that exceeded our expectations.',
        isVerified: true,
        isFeatured: true,
      },
      {
        name: 'Sarah Williams',
        role: 'First-Time Buyer',
        rating: 5,
        content: 'Sophia guided me through my first home purchase with patience and expertise. I never felt rushed or pressured. Truly a premium experience.',
        isVerified: true,
        isFeatured: true,
      },
      {
        name: 'David Park',
        role: 'Property Investor',
        rating: 5,
        content: 'Professional, efficient, and honest. Altave Realty Group helped me acquire three investment properties in under a year. Exceptional service.',
        isVerified: true,
        isFeatured: true,
      },
    ]
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

**Commands:**
```bash
npx prisma db push       # sync schema to DB
npx prisma generate      # generate client
npx prisma db seed       # run seed
npx prisma studio        # open GUI
```
