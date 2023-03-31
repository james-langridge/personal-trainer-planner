'use client'

import {Session} from '@prisma/client'
import React, {useState} from 'react'
import CalendarHeading from '@/components/calendar/CalendarHeading'
import CalendarGrid from '@/components/calendar/CalendarGrid'

export default function Calendar({
  isAdmin = false,
  sessions,
  setSessionId,
}: {
  isAdmin?: boolean
  sessions?: Session[]
  setSessionId?: React.Dispatch<React.SetStateAction<string>>
}) {
  const now = new Date()
  const [year, setYear] = useState(() => now.getFullYear())
  const [month, setMonth] = useState(() => now.getMonth())

  return (
    <div className="flex w-full flex-col items-center">
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
    </div>
  )
}
