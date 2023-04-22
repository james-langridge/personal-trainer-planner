'use client'

import React from 'react'
import {Sidebar} from '@/components/calendar/Sidebar'
import {Container} from '@/components/calendar/Container'
import {useCalendarData, useLockBodyScroll} from '@/hooks'
import {CalendarHeading} from '@/components/calendar/CalendarHeading'
import {CalendarGrid} from '@/components/calendar/CalendarGrid'
import Providers from '@/app/(training-app)/training-planner/Providers'

const SidebarMemo = React.memo(Sidebar)

export default function TrainingPlanner() {
  const {monthData, year, month, setYear, setMonth} = useCalendarData()
  useLockBodyScroll()

  return (
    <Providers>
      <Container>
        <SidebarMemo />
        <div className="flex w-full flex-col px-5 sm:items-center ">
          <CalendarHeading
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
          />
          <CalendarGrid monthData={monthData} isAdmin />
        </div>
      </Container>
    </Providers>
  )
}
