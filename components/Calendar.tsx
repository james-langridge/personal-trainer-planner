'use client'
// Everything imported here into this client component and below is a client component.
// Server components cannot be imported into client components.
// Move this logic up to the parent Page server component,
// which can import client components that take server components as children or props.

import React from 'react'

import Providers from '@/app/Providers'
import {CalendarGridUser} from '@/components/CalendarGridUser'
import {CalendarHeading} from '@/components/CalendarHeading'
import {CalendarMediumUser} from '@/components/CalendarMediumUser'
import {CalendarMobile} from '@/components/CalendarMobile'
import ClientWrapper from '@/components/ClientWrapper'
import {Sidebar} from '@/components/Sidebar'
import {useCalendarData} from '@/hooks'
import {SerialisedUser} from '@/lib/users'

const SidebarMemo = React.memo(Sidebar)

export function Calendar({user}: {user: SerialisedUser}) {
  // TODO: move this down to at least CalendarMediumUser
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  return (
    <Providers>
      <ClientWrapper user={user}>
        <SidebarMemo />
        <div className="flex w-full flex-col px-5 sm:items-center ">
          <CalendarMobile />
          <CalendarMediumUser>
            <CalendarHeading
              year={year}
              setYear={setYear}
              month={month}
              setMonth={setMonth}
            />
            <CalendarGridUser monthData={monthData} />
          </CalendarMediumUser>
        </div>
      </ClientWrapper>
    </Providers>
  )
}
