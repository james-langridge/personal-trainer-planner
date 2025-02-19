'use client'

import {Header} from '@/features/calendar/desktop/Header'
import {Grid} from '@/features/calendar/desktop/Grid'
import {useState} from 'react'
import {DateFilter, getPrismaDateFilter} from '@/lib/calendar'

export type SelectUserId = (
  userName: string,
  users: {name: string; id: string}[],
) => void

export function CalendarDesktop({
  year,
  jsMonth,
  userId,
  isAdmin,
}: {
  year: number
  jsMonth: number
  userId?: string
  isAdmin: boolean
}) {
  const [dateFilter, setDateFilter] = useState<DateFilter>(
    getPrismaDateFilter(year, jsMonth),
  )
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    userId,
  )

  function updateSelectedUserId(
    userName: string,
    users: {name: string; id: string}[],
  ) {
    if (!isAdmin) return
    const user = users.find(user => user.name === userName)
    if (!user) return
    setSelectedUserId(user.id)
  }

  function updateDateFilter(dateFilter: DateFilter) {
    setDateFilter(dateFilter)
  }

  return (
    <div className="flex h-[90vh]">
      <div className="hidden w-full flex-col px-5 sm:flex sm:items-center">
        <Header
          dateFilter={dateFilter}
          isAdmin={isAdmin}
          onSelect={updateSelectedUserId}
          onChange={updateDateFilter}
        />
        {selectedUserId ? (
          <Grid
            isAdmin={isAdmin}
            dateFilter={dateFilter}
            userId={selectedUserId}
          />
        ) : (
          <div>Select a client</div>
        )}
      </div>
    </div>
  )
}
