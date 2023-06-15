'use client'

import {useSession} from 'next-auth/react'
import React, {useEffect} from 'react'

import {useUserDispatch} from '@/app/Providers'
import {CalendarGrid} from '@/components/CalendarGrid'
import {CalendarHeading} from '@/components/CalendarHeading'
import {CalendarMedium} from '@/components/CalendarMedium'
import {CalendarMobile} from '@/components/CalendarMobile'
import {Sidebar} from '@/components/Sidebar'
import {useCalendarData, useUserWorkouts} from '@/hooks'
import {SerialisedUser} from '@/lib/users'

const SidebarMemo = React.memo(Sidebar)

export function Calendar({user}: {user: SerialisedUser}) {
  useUserWorkouts()
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const dispatchUser = useUserDispatch()
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  // Admin starts with blank calendar, and manually selects user
  useEffect(() => {
    if (user && !isAdmin) {
      dispatchUser({type: 'setUser', user: user})
    }
  }, [dispatchUser, isAdmin, user])

  return (
    <div className="flex h-[90vh]">
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
    </div>
  )
}
