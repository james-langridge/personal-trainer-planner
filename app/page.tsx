import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import React from 'react'
import {Calendar} from '@/components/Calendar'
import {serialiseUserWithWorkouts, UserWithWorkouts} from '@/lib/users'

export const dynamic = 'force-dynamic'

const getUserWithWorkouts = async (): Promise<{
  user: UserWithWorkouts | null | undefined
}> => {
  const user = await getUserFromCookie(cookies())

  return {user: user}
}

export default async function TrainingStudio() {
  const {user} = await getUserWithWorkouts()
  const serialisedUserWithWorkouts = serialiseUserWithWorkouts(user)

  if (!serialisedUserWithWorkouts) {
    return null
  }

  return <Calendar user={serialisedUserWithWorkouts} />
}
