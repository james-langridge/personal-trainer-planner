'use server'

import {auth} from '@/auth'
import {db} from '@/lib/db'
import {getRepeatingDates} from '@/lib/calendar'
import {Appointment} from '@prisma/client'
import {
  addEventToGoogleCalendar,
  type CalendarEvent,
  updateGoogleCalendarEvent,
} from '@/lib/google-calendar'

type CreateAppointmentBody = Pick<
  Appointment,
  'description' | 'fee' | 'name' | 'ownerId' | 'videoUrl'
> & {
  date: string
  selectedDays: number[]
  weeksToRepeat: number
}

export async function createAppointment(body: CreateAppointmentBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  const {
    date,
    description,
    fee,
    name,
    ownerId,
    selectedDays,
    videoUrl,
    weeksToRepeat,
  } = body

  const dates = getRepeatingDates(date, selectedDays, weeksToRepeat)

  const data = dates.map(date => ({
    date,
    description,
    fee,
    name,
    ownerId,
    videoUrl,
  }))

  await db.appointment.createMany({data})

  const eventData: CalendarEvent = {
    title: name,
    description: description || undefined,
    startDate: new Date(date),
    endDate: new Date(date),
    isAllDay: true,
  }

  await addEventToGoogleCalendar(eventData)
}

type UpdateAppointmentBody = Partial<
  Pick<
    Appointment,
    | 'deleted'
    | 'description'
    | 'fee'
    | 'id'
    | 'name'
    | 'ownerId'
    | 'status'
    | 'videoUrl'
  >
> & {date: Date}

export async function updateAppointment(body: UpdateAppointmentBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  await db.appointment.update({
    where: {
      id: body.id,
    },
    data: {
      ...(body.date !== undefined && {date: new Date(body.date)}),
      ...(body.fee && {fee: body.fee}),
      ...(body.deleted === true && {deleted: true}),
      ...(body.description !== undefined && {description: body.description}),
      ...(body.name !== undefined && {name: body.name}),
      ...(body.status !== undefined && {status: body.status}),
      ...(body.videoUrl !== undefined && {videoUrl: body.videoUrl}),
    },
  })
}

type DeleteAppointmentBody = Pick<
  Appointment,
  'deleted' | 'id' | 'ownerId' | 'date'
>

export async function deleteAppointment(body: DeleteAppointmentBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  return db.appointment.update({
    where: {
      id: body.id,
    },
    data: {
      deleted: true,
    },
  })
}

export async function getAppointment(id: string) {
  const session = await auth()
  if (!session) {
    throw new Error('Must be logged in.')
  }
  const appointment = await db.appointment.findUnique({
    where: {id},
  })

  if (!appointment) {
    throw new Error('Appointment not found')
  }

  return appointment
}
