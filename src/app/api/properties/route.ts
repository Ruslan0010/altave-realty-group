import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const beds = searchParams.get('beds')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') ?? '24')
    const page = parseInt(searchParams.get('page') ?? '1')

    const where: Record<string, unknown> = { isAvailable: true }

    if (status) {
      where.status = status.toUpperCase()
    } else if (type) {
      if (type === 'rent') where.status = 'RENT'
      else if (type === 'buy') where.status = 'SALE'
      else if (type === 'commercial') where.type = 'COMMERCIAL'
    }

    if (city) where.city = city
    if (featured === 'true') where.isFeatured = true

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseInt(minPrice) } : {}),
        ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
      }
    }

    if (beds && beds !== 'Any') {
      if (beds === 'Studio') where.bedrooms = 0
      else if (beds === '4+') where.bedrooms = { gte: 4 }
      else where.bedrooms = parseInt(beds)
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          agent: {
            select: { id: true, name: true, photo: true, slug: true },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.property.count({ where }),
    ])

    return NextResponse.json({
      data: properties,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('[/api/properties GET]', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}
