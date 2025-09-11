'use server'

import {
  CreateBootcampBody,
  DeleteBootcampBody,
  UpdateBootcampAttendanceBody,
  UpdateBootcampBody,
} from '@/@types/apiRequestTypes'
import {Bootcamp} from '@/@types/apiResponseTypes'
import {auth} from '@/auth'
import {getRepeatingDates} from '@/lib/calendar'
import {db} from '@/lib/db'

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

  return bootcamp
}

export async function deleteBootcamp(body: DeleteBootcampBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

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

  const {userId, bootcampId} = body

  return db.$transaction(async tx => {
    const user = await tx.user.findUnique({
      select: {
        credits: true,
        bootcamps: {
          select: {id: true},
          where: {id: bootcampId},
        },
      },
      where: {id: userId},
    })

    if (!user) {
      throw new Error('User not found.')
    }

    const isAttending = user.bootcamps.length > 0

    if (!user.credits && !isAttending) return {OK: false}

    const updatedUser = await tx.user.update({
      where: {id: userId},
      data: {
        credits: isAttending ? {increment: 1} : {decrement: 1},
        bootcamps: isAttending
          ? {disconnect: {id: bootcampId}}
          : {connect: {id: bootcampId}},
      },
      select: {credits: true},
    })

    return {
      OK: true,
      credits: updatedUser.credits,
      isAttending: !isAttending,
    }
  })
}

export type AllbootcampsParams = {
  dateFilter: {
    gte: Date
    lt: Date
  }
}
export type AllBootcampsData =
  | {
      id: string
      name: string
      date: Date
    }[]
  | null

export async function getAllBootcamps({
  dateFilter,
}: AllbootcampsParams): Promise<AllBootcampsData> {
  return db.bootcamp.findMany({
    select: {
      date: true,
      id: true,
      name: true,
    },
    where: {
      deleted: false,
      date: dateFilter,
    },
  })
}

export type GetUAllBootcampsParams = {dateFilter: {gte: Date; lt: Date}}

export async function getBootcamps(params: GetUAllBootcampsParams) {
  const {dateFilter} = params
  const bootcamps: Bootcamp[] = await db.bootcamp.findMany({
    select: {
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
      date: true,
      description: true,
      id: true,
      name: true,
      videoUrl: true,
    },
    where: {
      deleted: false,
      date: dateFilter,
    },
  })

  return bootcamps
}
