import {Session} from '@prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {SessionItem} from '@/components/calendar/SessionItem'
import React from 'react'
import {Day} from '@/lib/calendar'

export function SessionItems({
  sessions,
  setSessionId,
  isAdmin,
  day,
}: {
  sessions: (Session | SessionSerialisedDate | undefined)[] | null | undefined
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
  isAdmin: boolean
  day: Day
}) {
  if (!sessions) {
    return null
  }

  return (
    <>
      {sessions.map((session, i) => {
        return (
          <div key={day.day * day.year * day.month * i}>
            {session && (
              <SessionItem
                session={session}
                isAdmin={isAdmin}
                setSessionId={setSessionId}
              />
            )}
          </div>
        )
      })}
    </>
  )
}
