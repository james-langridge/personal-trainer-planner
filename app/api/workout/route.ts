import {NextRequest, NextResponse} from 'next/server'

import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const workout = await db.workout.create({
    data: {
      ownerId: body.ownerId,
      name: body.name,
      date: new Date(body.date),
      description: body.description && body.description,
      type: body.type,
      videoUrl: body.videoUrl && body.videoUrl,
    },
  })

  return NextResponse.json(
    {workout},
    {
      status: 201,
    },
  )
}

export async function PUT(req: NextRequest) {
  const body = await req.json()

  const workout = await db.workout.update({
    where: {
      id: body.workoutId,
    },
    data: {
      ...(body.type !== undefined && {type: body.type}),
      ...(body.date !== undefined && {date: new Date(body.date)}),
      ...(body.deleted === true && {deleted: true}),
      ...(body.description !== undefined && {description: body.description}),
      ...(body.name !== undefined && {name: body.name}),
      ...(body.status !== undefined && {status: body.status}),
      ...(body.videoUrl !== undefined && {videoUrl: body.videoUrl}),
    },
  })

  return NextResponse.json(
    {workout},
    {
      status: 201,
    },
  )
}
