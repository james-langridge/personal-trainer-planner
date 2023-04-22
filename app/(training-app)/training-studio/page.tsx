import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import {Session, SESSION_STATUS, SESSION_TYPE, User} from '@prisma/client'
import React from 'react'
import {serialiseDates} from '@/lib/calendar'
import {Calendar} from '@/components/calendar/Calendar'
import {Container} from '@/components/calendar/Container'
import {serialiseUser} from '@/lib/users'

export interface SerialisedSession {
  id: string
  ownerId: string
  status: SESSION_STATUS
  name: string
  date: string
  description: string | null
  videoUrl: string | null
  deleted: boolean
  sessionType: SESSION_TYPE
}

type UserWithSessions = User & {
  sessions: Session[]
}

const getSessions = async (): Promise<{
  user: UserWithSessions | null | undefined
}> => {
  const user = await getUserFromCookie(cookies())

  return {user: user}
}

export default async function TrainingStudio() {
  const {user} = await getSessions()
  const serialisedUser = serialiseUser(user)
  const sessions = serialiseDates(user?.sessions)

  return (
    <Container>
      <Calendar initialSessions={sessions} user={serialisedUser} />
    </Container>
  )
}
