import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'

import {
  CreateAppointmentBody,
  UpdateAppointmentBody,
} from '@/@types/apiRequestTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {getRepeatingDates} from '@/lib/calendar'
import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
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
  }: CreateAppointmentBody = await req.json()

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

  const appointments = await db.appointment.createMany({data})

  return NextResponse.json(
    {appointments},
    {
      status: 201,
    },
  )
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
  }

  const body: UpdateAppointmentBody = await req.json()

  const appointment = await db.appointment.update({
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
    {appointment},
    {
      status: 201,
    },
  )
}
