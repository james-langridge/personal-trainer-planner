import {NextRequest, NextResponse} from 'next/server'

import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const workout = await db.user.create({
    data: {
      email: body.email,
      name: body.name,
    },
  })

  return NextResponse.json(
    {workout},
    {
      status: 201,
    },
  )
}
