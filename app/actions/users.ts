'use server'

import {auth} from '@/auth'
import {CreateUserBody, UpdateUserBody} from '@/@types/apiRequestTypes'
import {db} from '@/lib/db'
import {User} from '@/@types/apiResponseTypes'

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

export async function getUser(id?: string, dateFilter?: {gte: Date; lt: Date}) {
  if (!id) {
    return {user: undefined}
  }

  const user: User | null = await db.user.findUnique({
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
    where: {
      id: id,
    },
  })

  return {user}
}

export async function getUsers(dateFilter: {gte: Date; lt: Date}): Promise<{
  users: User[]
}> {
  const users: User[] = await db.user.findMany({
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

  return {users}
}

export async function getUserIdsAndNames(): Promise<{
  users: {name: string; id: string}[]
}> {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  return {users}
}
