'use client'

import React from 'react'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {CalendarMobile} from '@/components/calendar/CalendarMobile'
import {CalendarMedium} from '@/components/calendar/CalendarMedium'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import {CalendarEmptyDays} from '@/components/calendar/CalendarEmptyDays'
import {CalendarDays} from '@/components/calendar/CalendarDays'
import {useCalendarData} from '@/hooks'
import {Session} from '@prisma/client'

export function Calendar({
  sessions,
  isAdmin = false,
  setSessionId,
}: {
  sessions?: SerialisedSession[] | Session[]
  isAdmin?: boolean
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
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
            setSessionId={setSessionId}
          />
        </CalendarGrid>
      </CalendarMedium>
    </div>
  )
}
