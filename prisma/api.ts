import {PrimsaUser, SerialisedUser} from '@/@types/apiResponseTypes'
import {db} from '@/lib/db'

export const getSerialisedUser = async (
  id?: string,
): Promise<{
  user: SerialisedUser | null | undefined
}> => {
  if (!id) {
    return {user: undefined}
  }

  const prismaUser = await db.user.findUnique({
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
        },
      },
    },
    where: {
      id: id,
    },
  })

  if (!prismaUser) {
    return {user: null}
  }

  const serializedUser = serialiseUser(prismaUser)

  return {user: serializedUser}
}

export async function getSerialisedUsers(dateFilter?: {
  gte: Date
  lt: Date
}): Promise<{
  users: SerialisedUser[]
}> {
  const prismaUsers = await db.user.findMany({
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
          ...(dateFilter && {date: dateFilter}),
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
          ...(dateFilter && {date: dateFilter}),
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
          ...(dateFilter && {date: dateFilter}),
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
          ...(dateFilter && {date: dateFilter}),
        },
      },
    },
  })

  const serializedUsers = prismaUsers.map(serialiseUser)

  return {users: serializedUsers}
}

function serialiseUser(user: PrimsaUser): SerialisedUser {
  return {
    ...user,
    appointments: user.appointments.map(apt => ({
      ...apt,
      date: apt.date.toISOString(),
    })),
    bootcamps: user.bootcamps.map(bootcamp => ({
      ...bootcamp,
      date: bootcamp.date.toISOString(),
    })),
    invoices: user.invoices.map(invoice => ({
      ...invoice,
      date: invoice.date.toISOString(),
    })),
    workouts: user.workouts.map(workout => ({
      ...workout,
      date: workout.date.toISOString(),
    })),
  }
}
