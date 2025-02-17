'use server'

import {auth} from '@/auth'
import {CreateUserBody, UpdateUserBody} from '@/@types/apiRequestTypes'
import {db} from '@/lib/db'
import {User} from '@/@types/apiResponseTypes'
import {GetUAllUsersParams} from '@/app/hooks/users'
import {APPOINTMENT_STATUS, USER_TYPE, WORKOUT_STATUS} from '@prisma/client'

export async function createUser(body: CreateUserBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  return db.user.create({
    data: {
      billingEmail: body.billingEmail || body.email,
      email: body.email,
      fee: body.fee,
      name: body.name,
      type: body.type,
    },
  })
}

export async function updateUser(body: UpdateUserBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  return db.user.update({
    where: {
      id: body.id,
    },
    data: {
      ...(body.billingEmail !== undefined && {
        billingEmail: body.billingEmail,
      }),
      ...(body.credits !== undefined && {credits: body.credits}),
      ...(body.email && {email: body.email}),
      ...(body.fee && {fee: body.fee}),
      ...(body.name && {name: body.name}),
      ...(body.type && {type: body.type}),
    },
  })
}

// TODO confirm we need all the selected data
export async function getUsers(params: GetUAllUsersParams): Promise<User[]> {
  const {dateFilter} = params
  return db.user.findMany({
    select: {
      appointments: {
        select: {
          date: true,
          description: true,
          fee: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      bootcamps: {
        select: {
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
      },
      billingEmail: true,
      credits: true,
      email: true,
      fee: true,
      id: true,
      invoices: {
        select: {
          date: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      name: true,
      role: true,
      type: true,
      workouts: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
    },
  })
}

export type UserEventsParams = {
  id: string
  dateFilter: {
    gte: Date
    lt: Date
  }
}
export type UserEventsData = {
  fee: number
  type: USER_TYPE
  appointments: {
    id: string
    name: string
    date: Date
    ownerId: string
    status: APPOINTMENT_STATUS
  }[]
  bootcamps: {
    id: string
  }[]
  workouts: {
    id: string
    name: string
    date: Date
    ownerId: string
    status: WORKOUT_STATUS
  }[]
} | null

export async function getUserEvents({
  id,
  dateFilter,
}: UserEventsParams): Promise<UserEventsData> {
  return db.user.findUnique({
    select: {
      appointments: {
        select: {
          date: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      bootcamps: {
        select: {
          id: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      fee: true,
      type: true,
      workouts: {
        select: {
          date: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
    },
    where: {
      id: id,
    },
  })
}

export type UserFeeParams = {
  id: string
}
export type UserFeeData = {
  fee: number
} | null

export async function getUserFee({id}: UserFeeParams): Promise<UserFeeData> {
  return db.user.findUnique({
    select: {
      fee: true,
    },
    where: {
      id: id,
    },
  })
}

export async function getUserIdsAndNames(): Promise<
  {name: string; id: string}[]
> {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

export async function getUser(id: string) {
  return db.user.findUnique({
    select: {
      name: true,
      workouts: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
        },
      },
    },
    where: {
      id: id,
    },
  })
}
