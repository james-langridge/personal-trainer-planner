'use client'

import {useSession} from 'next-auth/react'
import React from 'react'

import {CalendarGridUser} from '@/components/CalendarGridUser'
import {CalendarHeading} from '@/components/CalendarHeading'
import {useCalendarData, useLockBodyScroll} from '@/hooks'
import {useIsMobile} from '@/hooks'

export function CalendarMediumUser({children}: {children: React.ReactNode}) {
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const isMobile = useIsMobile()
  useLockBodyScroll()
  const {monthData, year, month, setYear, setMonth} = useCalendarData()

  // TODO: Admin view is not optimised for mobile
  if (isMobile && !isAdmin) {
    return null
  }

  return (
    <>
      <CalendarHeading
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
      />
      {children}
    </>
  )
}
