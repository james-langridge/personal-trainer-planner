'use client'

import React from 'react'
import {Sidebar} from '@/components/calendar/Sidebar'
import {useCalendarData, useLockBodyScroll} from '@/hooks'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import Providers from '@/app/(training-app)/Providers'
import ClientWrapper from '@/components/calendar/ClientWrapper'

const SidebarMemo = React.memo(Sidebar)

export default function TrainingPlanner() {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()
  useLockBodyScroll()

  return (
    <Providers>
      <ClientWrapper isAdmin>
        <SidebarMemo />
        <div className="flex w-full flex-col px-5 sm:items-center ">
          <CalendarHeading
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
          />
          <CalendarGrid monthData={monthData} />
        </div>
      </ClientWrapper>
    </Providers>
  )
}
