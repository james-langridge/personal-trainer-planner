import React from 'react'
import {UserName} from '@/components/UserName'
import {CalendarDropdown} from '@/components/CalendarDropdown'
import {CalendarForm} from '@/components/CalendarForm'

export function Sidebar() {
  return (
    <aside className="flex w-72 flex-col overflow-y-auto border-r bg-white px-4 py-8 rtl:border-r-0 rtl:border-l dark:border-gray-700 dark:bg-gray-900">
      <UserName />
      <CalendarDropdown />
      <CalendarForm />
    </aside>
  )
}
