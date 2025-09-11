'use server'

import {auth} from '@/auth'
import {db} from '@/lib/db'
import {getRepeatingDates} from '@/lib/calendar'
import {
  CreateWorkoutBody,
  DeleteWorkoutBody,
  UpdateWorkoutBody,
} from '@/@types/apiRequestTypes'

export async function createWorkout(body: CreateWorkoutBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  const {
    date,
    description,
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
    name,
    ownerId,
    videoUrl,
  }))

  return db.workout.createMany({data})
}

export async function updateWorkout(body: UpdateWorkoutBody) {
  const session = await auth()

  if (!session) {
    throw new Error('You must be logged in.')
  }

  return db.workout.update({
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
}

export async function deleteWorkout(body: DeleteWorkoutBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  return db.workout.update({
    where: {
      id: body.id,
    },
    data: {
      deleted: true,
    },
  })
}

export async function getWorkout(id: string) {
  const session = await auth()
  if (!session) {
    throw new Error('You must be logged in.')
  }
  const workout = await db.workout.findUnique({
    where: {id},
  })

  if (!workout) {
    throw new Error('Workout not found')
  }

  return workout
}
