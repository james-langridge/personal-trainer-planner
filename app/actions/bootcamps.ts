'use server'
import {auth} from '@/auth'
import {db} from '@/lib/db'
import {getRepeatingDates} from '@/lib/calendar'
import {
  CreateBootcampBody,
  DeleteBootcampBody,
  UpdateBootcampAttendanceBody,
  UpdateBootcampBody,
} from '@/@types/apiRequestTypes'
import {revalidatePath} from 'next/cache'

export async function createBootcamp(body: CreateBootcampBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  const {date, description, name, selectedDays, videoUrl, weeksToRepeat} = body

  const dates = getRepeatingDates(date, selectedDays, weeksToRepeat)

  const data = dates.map(date => ({
    date,
    description,
    name,
    videoUrl,
  }))

  // todo if /calendar is static, need to revalidate it the dates for all bootcamp users to show the new bootcamp

  revalidatePath(`/bootcamps`)

  return db.bootcamp.createMany({data})
}

export async function updateBootcamp(body: UpdateBootcampBody) {
  const session = await auth()
  if (!session) {
    throw new Error('You must be logged in.')
  }

  let bootcamp

  if (body.userId !== undefined) {
    if (body.query === 'connect') {
      bootcamp = await db.bootcamp.update({
        where: {id: body.id},
        data: {
          attendees: {
            connect: {id: body.userId},
          },
        },
      })
    } else if (body.query === 'disconnect') {
      bootcamp = await db.bootcamp.update({
        where: {id: body.id},
        data: {
          attendees: {
            disconnect: {id: body.userId},
          },
        },
      })
    }
  } else {
    bootcamp = await db.bootcamp.update({
      where: {id: body.id},
      data: {
        ...(body.date !== undefined && {date: new Date(body.date)}),
        ...(body.deleted === true && {deleted: true}),
        ...(body.description !== undefined && {description: body.description}),
        ...(body.name !== undefined && {name: body.name}),
        ...(body.videoUrl !== undefined && {videoUrl: body.videoUrl}),
      },
    })
  }

  revalidatePath(`/bootcamps/${body.id}`)
  revalidatePath(`/bootcamps`)

  return bootcamp
}

export async function deleteBootcamp(body: DeleteBootcampBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  revalidatePath(`/bootcamps`)

  return db.bootcamp.update({
    where: {id: body.id},
    data: {deleted: true},
  })
}

export async function getBootcamp(id: string) {
  const session = await auth()
  if (!session) {
    throw new Error('You must be logged in.')
  }
  const isAdmin = session.user?.role === 'admin'

  const bootcamp = await db.bootcamp.findUnique({
    select: {
      ...(isAdmin && {
        _count: {
          select: {attendees: true},
        },
        attendees: {
          select: {
            email: true,
            id: true,
            name: true,
            role: true,
            type: true,
          },
        },
      }),
      date: true,
      description: true,
      id: true,
      name: true,
      videoUrl: true,
    },
    where: {
      id: id,
    },
  })

  if (!bootcamp) {
    throw new Error('Bootcamp not found')
  }

  return bootcamp
}

export async function toggleBootcampAttendance(
  body: UpdateBootcampAttendanceBody,
) {
  const session = await auth()
  if (!session) {
    throw new Error('You must be logged in.')
  }

  const {userId, bootcampId, isAttending} = body

  const user = await db.user.findUnique({
    select: {
      credits: true,
    },
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new Error('User not found.')
  }

  if (!user.credits && !isAttending) return {OK: false}

  let res

  if (user.credits > 0 && !isAttending) {
    res = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {decrement: 1},
        bootcamps: {
          connect: {
            id: bootcampId,
          },
        },
      },
    })
  }

  if (isAttending) {
    res = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        credits: {increment: 1},
        bootcamps: {
          disconnect: {
            id: bootcampId,
          },
        },
      },
    })
  }

  revalidatePath(`/bootcamps`)

  // todo check returned credits value
  return {OK: true, credits: res?.credits}
}
