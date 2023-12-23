import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'

import {CreateWorkoutBody, UpdateWorkoutBody} from '@/@types/apiRequestTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {getRepeatingDates} from '@/lib/calendar'
import {db} from '@/lib/db'
import {errorHandler} from '@/lib/errors'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.json({message: 'Forbidden.'}, {status: 403})
    }

    const {
      date,
      description,
      name,
      ownerId,
      selectedDays,
      videoUrl,
      weeksToRepeat,
    }: CreateWorkoutBody = await req.json()
    console.log({
      date,
      description,
      name,
      ownerId,
      selectedDays,
      videoUrl,
      weeksToRepeat,
    })

    const dates = getRepeatingDates(date, selectedDays, weeksToRepeat)

    const data = dates.map(date => {
      return {
        date,
        description,
        name,
        ownerId,
        videoUrl,
      }
    })

    console.log({data})

    const workouts = await db.workout.createMany({data})

    return NextResponse.json(
      {data: workouts},
      {
        status: 201,
      },
    )
  } catch (e) {
    return errorHandler(e)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

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
        ...(body.videoUrl !== undefined && {videoUrl: body.videoUrl}),
      },
    })

    return NextResponse.json(
      {data: workout},
      {
        status: 201,
      },
    )
  } catch (e) {
    return errorHandler(e)
  }
}
