'use client'

import React, {useEffect} from 'react'
import {CalendarMobile} from '@/components/CalendarMobile'
import {CalendarMedium} from '@/components/CalendarMedium'
import {CalendarHeading} from '@/components/CalendarHeading'
import {CalendarGrid} from '@/components/CalendarGrid'
import {useCalendarData} from '@/hooks'
import Providers from '@/app/Providers'
import {SerialisedUser} from '@/lib/users'
import ClientWrapper from '@/components/ClientWrapper'
import {Sidebar} from '@/components/Sidebar'
import {useSession} from 'next-auth/react'

const SidebarMemo = React.memo(Sidebar)

export function Calendar({user}: {user: SerialisedUser}) {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()
  const {data: session, status} = useSession()

  useEffect(() => {
    console.log({session, status})
  }, [session, status])

  return (
    <Providers>
      <ClientWrapper user={user}>
        <SidebarMemo />
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
