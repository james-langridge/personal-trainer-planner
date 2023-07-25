import {getServerSession} from 'next-auth/next'
import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
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

  const user: UserWithWorkouts | null = await db.user.findUnique({
    select: {
      appointments: {
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
      email: true,
      id: true,
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

  return {user: user}
}

export default async function TrainingStudio() {
  const session = await getServerSession(authOptions)
  const {user} = await getUserWithWorkouts(session?.user?.id)

  if (!user) {
    return null
  }

  return <Calendar initialUser={JSON.stringify(user)} />
}
