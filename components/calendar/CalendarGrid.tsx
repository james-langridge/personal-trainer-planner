import React from 'react'
import {classNames} from '@/lib/misc'
import {CalendarEmptyDays} from '@/components/calendar/CalendarEmptyDays'
import {getSessionsToday} from '@/lib/calendar'
import {CalendarDay} from '@/components/calendar/CalendarDay'
import {SessionItem} from '@/components/calendar/SessionItem'
import {useUserSessions} from '@/hooks'
import {useSessions} from '@/app/(training-app)/training-planner/Providers'

export function CalendarGrid({
  monthData,
  isAdmin = false,
}: {
  monthData: {day: number; weekDay: number; month: number; year: number}[]
  isAdmin?: boolean
}) {
  useUserSessions(isAdmin)
  const sessionsState = useSessions()
  const sessions = sessionsState.sessions
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDays = Array(firstDayOfMonth).fill(null)
  const calendarSquares = firstDayOfMonth + monthData.length

  return (
    <div
      className={classNames(
        calendarSquares > 35 ? 'grid-rows-calendar-6' : 'grid-rows-calendar-5',
        'grid h-full w-full grid-cols-calendar ring-offset-1',
      )}
    >
      <CalendarEmptyDays emptyDays={emptyDays} />
      {monthData.map((day, index) => {
        const sessionsToday = sessions ? getSessionsToday(day, sessions) : null
        const isFirstWeek = index + firstDayOfMonth < 7

        return (
          <CalendarDay day={day} isFirstWeek={isFirstWeek} key={index}>
            {sessionsToday &&
              sessionsToday.map((session, i) => {
                return (
                  <div key={day.day * day.year * day.month * i}>
                    {session && <SessionItem session={session} />}
                  </div>
                )
              })}
          </CalendarDay>
        )
      })}
    </div>
  )
}
