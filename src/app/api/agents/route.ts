import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') ?? '20')

    const where: Record<string, unknown> = { isActive: true }
    if (featured === 'true') where.isFeatured = true

    const agents = await prisma.agent.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { yearsExperience: 'desc' }],
      take: limit,
    })

    return NextResponse.json({ data: agents })
  } catch (error) {
    console.error('[/api/agents GET]', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}
