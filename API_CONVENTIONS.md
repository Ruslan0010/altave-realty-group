# 🔌 API Conventions — Altave Realty Group

## Standard Response Format

```typescript
// Success — single item
{ data: T, message?: string }

// Success — list with pagination
{
  [resourceName]: T[],
  pagination: { total: number, pages: number, current: number, limit: number }
}

// Error
{ error: string, details?: unknown }
```

---

## Route Template

```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Input schemas — define at top of file
const querySchema = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  status: z.enum(['RENT', 'SALE']).optional(),
  city:   z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams)
    const parsed = querySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { page, limit, status, city } = parsed.data
    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (city)   where.city   = { contains: city, mode: 'insensitive' }

    const [items, total] = await Promise.all([
      prisma.property.findMany({ where, skip: (page - 1) * limit, take: limit }),
      prisma.property.count({ where }),
    ])

    return NextResponse.json({
      properties: items,
      pagination: { total, pages: Math.ceil(total / limit), current: page, limit }
    })
  } catch (error) {
    console.error('[GET /api/properties]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const schema = z.object({
      name:    z.string().min(2).max(100),
      email:   z.string().email(),
      message: z.string().min(10).max(2000),
    })

    const validated = schema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const item = await prisma.inquiry.create({ data: validated.data })
    return NextResponse.json({ data: item, message: 'Created successfully' }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/inquiries]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

---

## Auth Check Helper

```typescript
// src/lib/auth.ts
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function requireAuth() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, dbUser: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } })
  return { user, dbUser, error: null }
}

// Usage in protected routes:
export async function GET(request: NextRequest) {
  const { dbUser, error } = await requireAuth()
  if (error) return error
  // dbUser is available here
}
```

---

## Email Helper (Resend)

```typescript
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL!

export async function sendInquiryConfirmation(to: string, name: string, propertyTitle: string) {
  await resend.emails.send({
    from: `Altave Realty Group <${FROM}>`,
    to,
    subject: `We received your inquiry — ${propertyTitle}`,
    html: `
      <h2>Thank you, ${name}!</h2>
      <p>We received your inquiry about <strong>${propertyTitle}</strong>.</p>
      <p>One of our agents will contact you within 24 hours.</p>
      <p>— The Altave Realty Group Team</p>
    `,
  })
}

export async function sendApplicationConfirmation(to: string, name: string) {
  await resend.emails.send({
    from: `Altave Realty Group <${FROM}>`,
    to,
    subject: 'Your application has been received',
    html: `
      <h2>Application Received, ${name}!</h2>
      <p>We've received your rental application and will review it within 2-3 business days.</p>
      <p>We'll contact you with an update shortly.</p>
    `,
  })
}
```

---

## All Required Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/properties | No | List with filters + pagination |
| GET | /api/properties/[slug] | No | Single property |
| GET | /api/agents | No | List agents |
| GET | /api/agents/[slug] | No | Agent + their listings |
| POST | /api/inquiries | No | Submit inquiry + email |
| POST | /api/applications | No | Submit rental application + email |
| GET | /api/favorites | Yes | User's favourites |
| POST | /api/favorites | Yes | Toggle favourite |
| GET | /api/saved-searches | Yes | User's saved searches |
| POST | /api/saved-searches | Yes | Create saved search |
| DELETE | /api/saved-searches/[id] | Yes | Delete saved search |
| POST | /api/contact | No | Contact form + email |
| GET | /api/blog | No | Blog posts with pagination |
| GET | /api/blog/[slug] | No | Single blog post |
| POST | /api/stripe/checkout | Yes | Create Stripe session |
| POST | /api/stripe/webhook | No | Stripe webhook handler |
