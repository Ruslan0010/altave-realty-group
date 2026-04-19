import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { slug: params.slug },
      include: {
        agent: {
          select: {
            id: true,
            slug: true,
            name: true,
            title: true,
            photo: true,
            phone: true,
            email: true,
            rating: true,
            propertiesSold: true,
            yearsExperience: true,
            specialties: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (err) {
    console.error('[GET /api/properties/[slug]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
