'use client'

import {Session} from '@prisma/client'
import React, {useState} from 'react'
import CalendarHeading from '@/components/calendar/CalendarHeading'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import useMediaQuery from '@/lib/useMediaQuery'
import CalendarMobile from '@/components/calendar/CalendarMobile'

export default function Calendar({
  isAdmin = false,
  sessions,
  setSessionId,
}: {
  isAdmin?: boolean
  sessions?: Session[] | SessionSerialisedDate[]
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
}) {
  const now = new Date()
  const [year, setYear] = useState(() => now.getFullYear())
  const [month, setMonth] = useState(() => now.getMonth())
  const isMobile = useMediaQuery('(max-width: 639px)')

  return (
    <div className="flex w-full flex-col sm:items-center">
      {isMobile && <CalendarMobile sessions={sessions} />}

      {!isMobile && (
        <>
          <CalendarHeading
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
          />
          <CalendarGrid
            year={year}
            month={month}
            sessions={sessions}
            isAdmin={isAdmin}
            setSessionId={setSessionId}
          />
        </>
      )}
    </div>
  )
}
