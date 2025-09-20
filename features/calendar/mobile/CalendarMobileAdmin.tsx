'use client'

import React, {useState} from 'react'
import {DateFilter, getPrismaDateFilter} from '@/lib/calendar'
import CalendarMobile from '@/features/calendar/mobile/CalendarMobile'
import MobileClientSelect from '@/features/calendar/mobile/MobileClientSelect'
import {MobileNavigation} from '@/features/calendar/mobile/MobileNavigation'

export function CalendarMobileAdmin({
  year,
  jsMonth,
  userId,
}: {
  year: number
  jsMonth: number
  userId?: string
}) {
  const [dateFilter, setDateFilter] = useState<DateFilter>(
    getPrismaDateFilter(year, jsMonth, 6),
  )
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    userId,
  )

  function updateSelectedUserId(
    userName: string,
    users: {name: string; id: string}[],
  ) {
    const user = users.find(user => user.name === userName)
    if (!user) return
    setSelectedUserId(user.id)
  }

  function updateDateFilter(dateFilter: DateFilter) {
    setDateFilter(dateFilter)
  }

  return (
    <div className="flex h-[90vh] flex-col">
      <div className="sticky top-0 z-10 bg-white px-5 shadow-sm dark:bg-gray-900">
        <MobileClientSelect onSelect={updateSelectedUserId} />
        <MobileNavigation
          dateFilter={dateFilter}
          onChange={updateDateFilter}
        />
      </div>

      {selectedUserId ? (
        <CalendarMobile
          userId={selectedUserId}
          dateFilter={dateFilter}
          isAdmin={true}
        />
      ) : (
        <div className="flex h-full items-center justify-center px-5">
          <p className="text-gray-500">Select a client to view their calendar</p>
        </div>
      )}
    </div>
  )
}