import CalendarForm from '@/components/calendar/CalendarForm'
import CalendarDropdown, {User} from '@/components/calendar/CalendarDropdown'
import React from 'react'

export default function Sidebar({
  setUser,
  user,
  sessionId,
  getUserSessions,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  user?: User
  sessionId: string
  getUserSessions: () => Promise<void>
}) {
  return (
    <aside className="flex w-72 flex-col overflow-y-auto border-r bg-white px-4 py-8 rtl:border-r-0 rtl:border-l dark:border-gray-700 dark:bg-gray-900">
      <span className="mt-4 text-center font-medium text-gray-800 dark:text-gray-200">
        {user && `${user.firstName} ${user.lastName}`}
      </span>
      <CalendarDropdown setUser={setUser} />
      <CalendarForm
        userId={user?.id}
        sessionId={sessionId}
        getUserSessions={getUserSessions}
      />
    </aside>
  )
}
