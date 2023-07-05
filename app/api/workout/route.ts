import {NextRequest, NextResponse} from 'next/server'

import {CreateWorkoutBody} from '@/@types/types'
import {getWorkoutDates} from '@/lib/calendar'
import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  const {
    date,
    ownerId,
    name,
    type,
    description,
    videoUrl,
    weeksToRepeat,
    selectedDays,
  }: CreateWorkoutBody = await req.json()

  const dates = getWorkoutDates(date, selectedDays, weeksToRepeat)
  const data = dates.map(date => {
    return {
      ownerId,
      name,
      date: new Date(date),
      description,
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
