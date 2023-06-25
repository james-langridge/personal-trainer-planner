'use client'

import React from 'react'

import {CalendarGrid} from '@/components/CalendarGrid'
import {CalendarHeading} from '@/components/CalendarHeading'
import {CalendarMedium} from '@/components/CalendarMedium'
import {CalendarMobile} from '@/components/CalendarMobile'
import {Sidebar} from '@/components/Sidebar'
import {useCalendarData, useUser, useWorkouts} from '@/hooks'
import {SerialisedUser} from '@/lib/users'

const SidebarMemo = React.memo(Sidebar)

export function Calendar({initialUser}: {initialUser: SerialisedUser}) {
  useUser(initialUser)
  useWorkouts()
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

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
