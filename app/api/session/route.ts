import {db} from '@/lib/db'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const user = await db.session.create({
    data: {
      ownerId: body.ownerId,
      name: body.name,
      date: new Date(body.date),
      description: body.description && body.description,
      videoUrl: body.videoUrl && body.videoUrl,
    },
  })

  return NextResponse.json(
    {user},
    {
      status: 201,
    },
  )
}
