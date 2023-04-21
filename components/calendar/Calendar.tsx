'use client'

import React from 'react'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {CalendarMobile} from '@/components/calendar/CalendarMobile'
import {CalendarMedium} from '@/components/calendar/CalendarMedium'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import {CalendarEmptyDays} from '@/components/calendar/CalendarEmptyDays'
import {CalendarDays} from '@/components/calendar/CalendarDays'
import {useCalendarData, useUpdateSessions} from '@/hooks'

export function Calendar({
  initialSessions,
  userId,
  isAdmin = false,
}: {
  initialSessions: SerialisedSession[]
  userId?: string
  isAdmin?: boolean
}) {
  const {
    calendarSquares,
    emptyDays,
    monthData,
    year,
    month,
    setYear,
    setMonth,
  } = useCalendarData()
  const sessions = useUpdateSessions({userId, initialSessions})

  return (
    <div className="flex w-full flex-col px-5 sm:items-center ">
      {!isAdmin && <CalendarMobile sessions={sessions} />}
      <CalendarMedium isAdmin={isAdmin}>
        <CalendarHeading
          year={year}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
        />
        <CalendarGrid calendarSquares={calendarSquares}>
          <CalendarEmptyDays emptyDays={emptyDays} />
          <CalendarDays
            monthData={monthData}
            sessions={sessions}
            isAdmin={isAdmin}
          />
        </CalendarGrid>
      </CalendarMedium>
    </div>
  )
}
