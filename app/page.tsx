import {getServerSession} from 'next-auth/next'
import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {Auth} from '@/components/Auth'
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
      email: true,
      id: true,
      name: true,
      role: true,
      workouts: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          type: true,
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

  return <Auth initialUser={JSON.stringify(user)} />
}
