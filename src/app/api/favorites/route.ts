import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            agent: { select: { name: true, photo: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ favorites })
  } catch (err) {
    console.error('[GET /api/favorites]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, propertyId } = await req.json()

    if (!userId || !propertyId) {
      return NextResponse.json({ error: 'userId and propertyId required' }, { status: 400 })
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_propertyId: { userId, propertyId } },
      })
      return NextResponse.json({ favorited: false })
    }

    await prisma.favorite.create({ data: { userId, propertyId } })
    return NextResponse.json({ favorited: true }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/favorites]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
