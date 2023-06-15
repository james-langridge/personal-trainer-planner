import {getServerSession} from 'next-auth/next'
import React from 'react'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Providers from '@/app/Providers'
import {Calendar} from '@/components/Calendar'
import {db} from '@/lib/db'
import {serialiseUserWithWorkouts, UserWithWorkouts} from '@/lib/users'

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
      id: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      name: true,
      workouts: {
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
  const serialisedUserWithWorkouts = serialiseUserWithWorkouts(user)

  if (!serialisedUserWithWorkouts) {
    return null
  }

  return (
    <Providers>
      <Calendar user={serialisedUserWithWorkouts} />
    </Providers>
  )
}
