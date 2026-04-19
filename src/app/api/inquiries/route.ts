import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  type: z.string().default('GENERAL'),
  propertyId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    await prisma.inquiry.create({
      data: {
        type: data.type as 'RENT' | 'PURCHASE' | 'SELL' | 'PROPERTY_MANAGEMENT' | 'VALUATION' | 'MORTGAGE' | 'GENERAL',
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        propertyId: data.propertyId ?? null,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    console.error('[POST /api/inquiries]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
