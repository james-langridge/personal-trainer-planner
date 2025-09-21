'use client'

import React, {useState} from 'react'
import Link from 'next/link'
import {Pencil} from 'lucide-react'
import {getPrismaDateFilter} from '@/lib/calendar'
import CalendarMobile from '@/features/calendar/mobile/CalendarMobile'
import MobileClientSelect from '@/features/calendar/mobile/MobileClientSelect'
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
  const dateFilter = getPrismaDateFilter(year, jsMonth, 6)
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

  return (
    <div className="flex h-[90vh] flex-col">
      <div className="fixed left-0 right-0 top-16 z-20 bg-white px-5 py-3 shadow-sm dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <MobileClientSelect onSelect={updateSelectedUserId} />
          </div>
          <div className="ml-2 h-10 w-10">
            {selectedUserId && (
              <Link href={`/admin/user/${selectedUserId}/edit`}>
                <Button variant="ghost" size="icon" aria-label="Edit client">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-20">
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
    </div>
  )
}
