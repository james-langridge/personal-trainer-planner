import {redirect} from 'next/navigation'
import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {auth} from '@/auth'
import {Calendar} from '@/features/calendar'
import {db} from '@/lib/db'

export const dynamic = 'force-dynamic'

const getUserWithWorkouts = async (
  id?: string,
): Promise<{
  user: UserWithWorkouts | null | undefined
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

  const serializedUser: UserWithWorkouts = {
    ...prismaUser,
    appointments: prismaUser.appointments.map(apt => ({
      ...apt,
      date: apt.date.toISOString(),
    })),
    bootcamps: prismaUser.bootcamps.map(bc => ({
      ...bc,
      date: bc.date.toISOString(),
    })),
    invoices: prismaUser.invoices.map(inv => ({
      ...inv,
      date: inv.date.toISOString(),
    })),
    workouts: prismaUser.workouts.map(w => ({
      ...w,
      date: w.date.toISOString(),
    })),
  }

  return {user: serializedUser}
}

export default async function TrainingStudio() {
  const session = await auth()
  const {user} = await getUserWithWorkouts(session?.user?.id)

  if (!user) {
    redirect('/api/auth/signin')
  }

  return <Calendar initialUser={user} />
}
