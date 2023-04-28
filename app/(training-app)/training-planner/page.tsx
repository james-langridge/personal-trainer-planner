import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import React from 'react'
import {Calendar} from '@/components/calendar/Calendar'
import {serialiseUserWithSessions, UserWithSessions} from '@/lib/users'

const getUserWithSessions = async (): Promise<{
  user: UserWithSessions | null | undefined
}> => {
  const user = await getUserFromCookie(cookies())

  return {user: user}
}

export default async function TrainingStudio() {
  const {user} = await getUserWithSessions()
  const serialisedUserWithSessions = serialiseUserWithSessions(user)

  return <Calendar user={serialisedUserWithSessions} />
}
