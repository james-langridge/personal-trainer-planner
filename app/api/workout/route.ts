import {NextRequest, NextResponse} from 'next/server'

import {CreateWorkoutBody, UpdateWorkoutBody} from '@/@types/apiRequestTypes'
import {getWorkoutDates} from '@/lib/calendar'
import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  const {
    date,
    description,
    name,
    ownerId,
    selectedDays,
    type,
    videoUrl,
    weeksToRepeat,
  }: CreateWorkoutBody = await req.json()

  const dates = getWorkoutDates(date, selectedDays, weeksToRepeat)

  const data = dates.map(date => {
    return {
      date,
      description,
      name,
      ownerId,
      type,
      videoUrl,
    }
  })

  const workouts = await db.workout.createMany({data})

  return NextResponse.json(
    {workouts},
    {
      status: 201,
    },
  )
}

export async function PUT(req: NextRequest) {
  const body: UpdateWorkoutBody = await req.json()

  const workout = await db.workout.update({
    where: {
      id: body.id,
    },
    data: {
      ...(body.date !== undefined && {date: new Date(body.date)}),
      ...(body.deleted === true && {deleted: true}),
      ...(body.description !== undefined && {description: body.description}),
      ...(body.name !== undefined && {name: body.name}),
      ...(body.status !== undefined && {status: body.status}),
      ...(body.type !== undefined && {type: body.type}),
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
