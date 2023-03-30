import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const session = await db.session.create({
    data: {
      ownerId: body.ownerId,
      name: body.name,
      date: new Date(body.date),
      description: body.description && body.description,
      videoUrl: body.videoUrl && body.videoUrl,
    },
  })

  return NextResponse.json(
    {session},
    {
      status: 201,
    },
  )
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  let session

  if (body.delete === 'true') {
    session = await db.session.update({
      where: {
        id: body.sessionId,
      },
      data: {
        deleted: true,
      },
    })
  } else {
    session = await db.session.update({
      where: {
        id: body.sessionId,
      },
      data: {
        name: body.name,
        date: new Date(body.date),
        description: body.description,
        videoUrl: body.videoUrl,
      },
    })
  }

  return NextResponse.json(
    {session},
    {
      status: 201,
    },
  )
}
