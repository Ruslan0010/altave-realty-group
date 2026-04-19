import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams

    const type = sp.get('type')
    const status = sp.get('status')
    const city = sp.get('city')
    const areas = sp.get('areas')
    const maxPrice = sp.get('maxPrice')
    const minSqft = sp.get('minSqft')
    const beds = sp.get('beds')
    const featured = sp.get('featured')
    const petFriendly = sp.get('petFriendly')
    const sort = sp.get('sort') ?? 'newest'
    const limit = parseInt(sp.get('limit') ?? '9')
    const page = parseInt(sp.get('page') ?? '1')

    const where: Record<string, unknown> = { isAvailable: true }

    // Status filter
    if (status) {
      where.status = status.toUpperCase()
    } else if (type) {
      if (type === 'rent') where.status = 'RENT'
      else if (type === 'buy') where.status = 'SALE'
      else if (type === 'commercial') where.type = 'COMMERCIAL'
    }

    // Property type
    if (sp.get('type') && !['rent', 'buy', 'commercial'].includes(sp.get('type')!)) {
      where.type = sp.get('type')!.toUpperCase()
    }

    // Location
    if (city) where.city = city
    if (areas) {
      const areaList = areas.split(',').filter(Boolean)
      if (areaList.length === 1) {
        where.area = areaList[0]
      } else if (areaList.length > 1) {
        where.area = { in: areaList }
      }
    }

    if (featured === 'true') where.isFeatured = true

    // Price
    if (maxPrice) {
      where.price = { lte: parseInt(maxPrice) }
    }

    // Sqft
    if (minSqft) {
      where.sqft = { gte: parseInt(minSqft) }
    }

    // Bedrooms
    if (beds && beds !== 'Any' && beds !== '') {
      if (beds === 'Studio') where.bedrooms = 0
      else if (beds === '4+') where.bedrooms = { gte: 4 }
      else where.bedrooms = parseInt(beds)
    }

    // Pet friendly
    if (petFriendly === 'true') where.petFriendly = true

    // Sort
    const orderBy: Record<string, unknown>[] = (() => {
      switch (sort) {
        case 'price_asc': return [{ price: 'asc' }]
        case 'price_desc': return [{ price: 'desc' }]
        case 'sqft_desc': return [{ sqft: 'desc' }]
        default: return [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
      }
    })()

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          agent: { select: { id: true, name: true, photo: true, slug: true } },
        },
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.property.count({ where }),
    ])

    // Map to PropertyCardData shape
    const mapped = properties.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      address: p.address,
      city: p.city,
      price: p.price,
      status: p.status,
      type: p.type,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqft: p.sqft,
      images: p.images,
      isNew: p.isNew,
      isHot: p.isHot,
      isReduced: p.isReduced,
      isFeatured: p.isFeatured,
      lat: p.lat,
      lng: p.lng,
      agent: p.agent ? { name: p.agent.name, photo: p.agent.photo } : null,
    }))

    return NextResponse.json({ properties: mapped, total, page, limit })
  } catch (err) {
    console.error('[GET /api/properties]', err)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}
