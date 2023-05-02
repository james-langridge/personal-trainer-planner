import {NextRequest, NextResponse} from 'next/server'

import {db} from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const id = params.slug
  const workout = await db.workout.findUnique({
    where: {
      id: id,
    },
  })

  return NextResponse.json({
    status: 200,
    data: workout,
  })
}
