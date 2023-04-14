import React from 'react'
import {User} from '@/components/calendar/CalendarDropdown'

export function UserName({user}: {user?: User}) {
  if (!user) {
    return null
  }

  return (
    <span className="mt-4 text-center font-medium text-gray-800 dark:text-gray-200">
      {user && `${user.firstName} ${user.lastName}`}
    </span>
  )
}
