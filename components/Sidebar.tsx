import React from 'react'
import {UserName} from '@/components/UserName'
import {CalendarDropdown} from '@/components/CalendarDropdown'
import {CalendarForm} from '@/components/CalendarForm'
import {useSession} from 'next-auth/react'

export function Sidebar() {
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'

  if (!isAdmin) {
    return null
  }

  return (
    <aside className="flex w-72 flex-col overflow-y-auto border-r bg-white px-4 py-8 rtl:border-r-0 rtl:border-l dark:border-gray-700 dark:bg-gray-900">
      <UserName />
      <CalendarDropdown />
      <CalendarForm />
    </aside>
  )
}
