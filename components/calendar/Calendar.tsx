'use client'

import React from 'react'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'
import {CalendarMobile} from '@/components/calendar/CalendarMobile'
import {CalendarMedium} from '@/components/calendar/CalendarMedium'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import {useCalendarData} from '@/hooks'
import Providers from '@/app/(training-app)/training-planner/Providers'
import {SerialisedUser} from '@/lib/users'
import ClientWrapper from '@/components/calendar/ClientWrapper'

export function Calendar({
  initialSessions,
  user,
}: {
  initialSessions?: SerialisedSession[]
  user?: SerialisedUser
}) {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  return (
    <Providers>
      <ClientWrapper sessions={initialSessions} user={user}>
        <div className="flex w-full flex-col px-5 sm:items-center ">
          <CalendarMobile />
          <CalendarMedium>
            <CalendarHeading
              year={year}
              setYear={setYear}
              month={month}
              setMonth={setMonth}
            />
            <CalendarGrid monthData={monthData} />
          </CalendarMedium>
        </div>
      </ClientWrapper>
    </Providers>
  )
}
