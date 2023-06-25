import React from 'react'

import {CalendarDropdown} from '@/components/CalendarDropdown'
import {CalendarForm} from '@/components/CalendarForm'
import {UserName} from '@/components/UserName'
import {useAppSelector} from '@/redux/hooks'

export function Sidebar() {
  const isAdmin = useAppSelector(state => state.auth.isAdmin)

  if (!isAdmin) {
    return null
  }

  return (
    <aside className="flex w-72 flex-col overflow-y-auto border-r bg-white px-4 py-8 rtl:border-l rtl:border-r-0 dark:border-gray-700 dark:bg-gray-900">
      <UserName />
      <CalendarDropdown />
      <CalendarForm />
    </aside>
  )
}
