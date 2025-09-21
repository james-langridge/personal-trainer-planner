'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {Pencil} from 'lucide-react'
import {DateFilter, getPrismaDateFilter} from '@/lib/calendar'
import CalendarMobile from '@/features/calendar/mobile/CalendarMobile'
import MobileClientSelect from '@/features/calendar/mobile/MobileClientSelect'
import {MobileNavigation} from '@/features/calendar/mobile/MobileNavigation'
import {Button} from '@/components/button'

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
  const [selectedUserName, setSelectedUserName] = useState<string | undefined>()

  function updateSelectedUserId(
    userName: string,
    users: {name: string; id: string}[],
  ) {
    const user = users.find(user => user.name === userName)
    if (!user) return
    setSelectedUserId(user.id)
    setSelectedUserName(user.name)
  }

  function updateDateFilter(dateFilter: DateFilter) {
    setDateFilter(dateFilter)
  }

  return (
    <div className="flex h-[90vh] flex-col">
      <div className="sticky top-0 z-10 bg-white px-5 shadow-sm dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <MobileClientSelect onSelect={updateSelectedUserId} />
          </div>
          {selectedUserId && (
            <Link href={`/admin/user/${selectedUserId}/edit`}>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                aria-label="Edit client"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
        <MobileNavigation dateFilter={dateFilter} onChange={updateDateFilter} />
      </div>

      {selectedUserId ? (
        <CalendarMobile
          userId={selectedUserId}
          dateFilter={dateFilter}
          isAdmin={true}
          clientName={selectedUserName}
        />
      ) : (
        <div className="flex h-full items-center justify-center px-5">
          <p className="text-gray-500">
            Select a client to view their calendar
          </p>
        </div>
      )}
    </div>
  )
}
