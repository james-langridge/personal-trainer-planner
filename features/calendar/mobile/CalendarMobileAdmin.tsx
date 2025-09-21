'use client'

import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import {Pencil} from 'lucide-react'
import {getPrismaDateFilter} from '@/lib/calendar'
import CalendarMobile from '@/features/calendar/mobile/CalendarMobile'
import MobileClientSelect from '@/features/calendar/mobile/MobileClientSelect'
import {Button} from '@/components/button'
import {useUserIdsAndNames} from '@/app/hooks/users'

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
  const {data: users} = useUserIdsAndNames()

  // Set the user name when we have userId from URL params
  useEffect(() => {
    if (userId && users) {
      const user = users.find(u => u.id === userId)
      if (user) {
        setSelectedUserName(user.name)
      }
    }
  }, [userId, users])

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
            <MobileClientSelect
              onSelect={updateSelectedUserId}
              selectedUserName={selectedUserName}
            />
          </div>
          <div className="ml-2 h-10 w-10">
            {selectedUserId && (
              <Link href={`/admin/user/${selectedUserId}/edit?from=calendar`}>
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
        ) : null}
      </div>
    </div>
  )
}
