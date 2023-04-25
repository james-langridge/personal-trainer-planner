import {SessionItem} from '@/components/calendar/SessionItem'
import React from 'react'
import {Day} from '@/lib/calendar'
import {SerialisedSession} from '@/lib/sessions'

export function SessionItems({
  sessions,
  day,
}: {
  sessions: (SerialisedSession | undefined)[] | null | undefined
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
            {session && <SessionItem session={session} />}
          </div>
        )
      })}
    </>
  )
}
