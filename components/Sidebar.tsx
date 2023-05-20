import React from 'react'

import {CalendarDropdown} from '@/components/CalendarDropdown'
import {CalendarForm} from '@/components/CalendarForm'
import {UserName} from '@/components/UserName'

export async function Sidebar() {
  return (
    <aside className="flex w-72 flex-col overflow-y-auto border-r bg-white px-4 py-8 rtl:border-r-0 rtl:border-l dark:border-gray-700 dark:bg-gray-900">
      <UserName />
      <CalendarDropdown />
      <CalendarForm />
    </aside>
  )
}
