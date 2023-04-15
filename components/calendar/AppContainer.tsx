'use client'

import React from 'react'
import {useCalendarData, useLockBodyScroll, useMediaQuery} from '@/hooks'
import {Calendar} from '@/components/calendar/Calendar'
import {CalendarDays} from '@/components/calendar/CalendarDays'
import {CalendarEmptyDays} from '@/components/calendar/CalendarEmptyDays'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {CalendarMobile} from '@/components/calendar/CalendarMobile'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'

export function AppContainer({sessions}: {sessions: SerialisedSession[]}) {
  const {
    calendarSquares,
    emptyDays,
    monthData,
    year,
    month,
    setYear,
    setMonth,
  } = useCalendarData()
  const isMobile = useMediaQuery('(max-width: 639px)')
  useLockBodyScroll(isMobile)

  return (
    <div className="flex h-[90vh]">
      <Calendar>
        {isMobile && <CalendarMobile sessions={sessions} />}

        {!isMobile && (
          <>
            <CalendarHeading
              year={year}
              setYear={setYear}
              month={month}
              setMonth={setMonth}
            />
            <CalendarGrid calendarSquares={calendarSquares}>
              <CalendarEmptyDays emptyDays={emptyDays} />
              <CalendarDays monthData={monthData} sessions={sessions} />
            </CalendarGrid>
          </>
        )}
      </Calendar>
    </div>
  )
}
