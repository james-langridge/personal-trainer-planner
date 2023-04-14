import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import {db} from '@/lib/db'
import {Session, SESSION_STATUS, SESSION_TYPE} from '@prisma/client'
import React from 'react'
import {AppContainer} from '@/components/calendar/AppContainer'

export interface SessionSerialisedDate {
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

const getSessions = async (): Promise<SessionSerialisedDate[]> => {
  const user = await getUserFromCookie(cookies())

  const sessions = await db.session.findMany({
    where: {
      ownerId: user?.id,
      NOT: {
        deleted: true,
      },
    },
  })

  return serialiseDates(sessions)
}

function serialiseDates(sessions: Session[]) {
  return sessions.map(session => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {createdAt, updatedAt, ...rest} = session

    return {...rest, date: session.date.toDateString()}
  })
}

export default async function TrainingStudio() {
  const serialisedSessions = await getSessions()

  // Fetch the sessions in this server component to pass to 'use client' component
  return <AppContainer sessions={serialisedSessions} />
}
