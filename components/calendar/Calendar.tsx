'use client'

import React from 'react'
import {CalendarMobile} from '@/components/calendar/CalendarMobile'
import {CalendarMedium} from '@/components/calendar/CalendarMedium'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import {useCalendarData} from '@/hooks'
import Providers from '@/app/(training-app)/Providers'
import {SerialisedUser} from '@/lib/users'
import ClientWrapper from '@/components/calendar/ClientWrapper'
import {Sidebar} from '@/components/calendar/Sidebar'

const SidebarMemo = React.memo(Sidebar)

export function Calendar({user}: {user?: SerialisedUser}) {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()
  const isAdmin = user?.admin

  return (
    <Providers>
      <ClientWrapper user={user}>
        {isAdmin && <SidebarMemo />}
        <div className="flex w-full flex-col px-5 sm:items-center ">
          {/*TODO: Admin view is not optimised for mobile*/}
          {!isAdmin && <CalendarMobile />}
          <CalendarMedium isAdmin={isAdmin}>
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
