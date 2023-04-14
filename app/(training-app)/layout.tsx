import React from 'react'
import {CalendarNavbar} from '@/components/calendar/CalendarNavbar'
import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Fit For Life Trainer',
  description: 'Fit For Life Personal Training to transform your way of life.',
}

export default async function TrainingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserFromCookie(cookies())

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="relative min-h-screen pt-16 dark:bg-gray-900">
      <div className="pb-[1066px] sm:pb-[614px] md:pb-[534px] lg:pb-[438px] xl:pb-[354px] 2xl:pb-[326px]">
        {!user && (
          <>
            <div>Please log in.</div>
            <Link
              href="/login"
              className="mt-4 w-full transform rounded-md bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Log in
            </Link>
          </>
        )}
        {user && (
          <>
            {await CalendarNavbar({isAdmin: user.admin})}
            <div>{children}</div>
          </>
        )}
      </div>
    </div>
  )
}
