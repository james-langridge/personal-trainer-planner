'use server'

import {auth} from '@/auth'
import {db} from '@/lib/db'
import {getRepeatingDates} from '@/lib/calendar'
import {
  CreateAppointmentBody,
  DeleteAppointmentBody,
  UpdateAppointmentBody,
} from '@/@types/apiRequestTypes'

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

  const appointments = await db.appointment.createMany({data})

  // TODO consider which pages to revalidate
  // revalidatePath('/calendar')

  return appointments
}

export async function updateAppointment(body: UpdateAppointmentBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  const appointment = await db.appointment.update({
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

  // TODO consider which pages to revalidate
  // revalidatePath('/calendar')

  return appointment
}

export async function deleteAppointment(body: DeleteAppointmentBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  const appointment = await db.appointment.update({
    where: {
      id: body.id,
    },
    data: {
      deleted: true,
    },
  })

  // TODO consider which pages to revalidate
  // revalidatePath('/calendar')

  return appointment
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
