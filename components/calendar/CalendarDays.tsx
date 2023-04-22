import {Day, getSessionsToday} from '@/lib/calendar'
import React from 'react'
import {Session} from '@prisma/client'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {CalendarDay} from '@/components/calendar/CalendarDay'
import {SessionItems} from '@/components/calendar/SessionItems'

export function CalendarDays({
  monthData,
  sessions,
}: {
  monthData: Day[]
  sessions?: Session[] | SerialisedSession[]
}) {
  const firstDayOfMonth = monthData[0].weekDay

  return (
    <>
      {monthData.map((day, index) => {
        const sessionsToday = sessions ? getSessionsToday(day, sessions) : null
        const isFirstWeek = index + firstDayOfMonth < 7

        return (
          <CalendarDay day={day} isFirstWeek={isFirstWeek} key={index}>
            <SessionItems sessions={sessionsToday} day={day} />
          </CalendarDay>
        )
      })}
    </>
  )
}
