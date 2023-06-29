'use client'

import {CalendarGrid} from '@/components/CalendarGrid'
import {CalendarHeading} from '@/components/CalendarHeading'
import {CalendarMedium} from '@/components/CalendarMedium'
import {CalendarMobile} from '@/components/CalendarMobile'
import {useCalendarData, useUser} from '@/hooks'
import {SerialisedUser} from '@/lib/users'

export function Calendar({initialUser}: {initialUser: SerialisedUser}) {
  useUser(initialUser)
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  return (
    <div className="flex h-[90vh]">
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
