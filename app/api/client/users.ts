'use server'

import {db} from '@/lib/db'
import {APPOINTMENT_STATUS, USER_TYPE, WORKOUT_STATUS} from '@prisma/client'

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
