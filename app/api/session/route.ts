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

  const session = await db.session.update({
    where: {
      id: body.sessionId,
    },
    data: {
      ...(body.date !== undefined && {date: new Date(body.date)}),
      ...(body.deleted !== undefined && {deleted: body.deleted}),
      ...(body.description !== undefined && {description: body.description}),
      ...(body.name !== undefined && {name: body.name}),
      ...(body.status !== undefined && {status: body.status}),
      ...(body.videoUrl !== undefined && {videoUrl: body.videoUrl}),
    },
  })

  return NextResponse.json(
    {session},
    {
      status: 201,
    },
  )
}
