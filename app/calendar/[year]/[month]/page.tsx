import {getServerSession} from 'next-auth/next'
import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Redirect from '@/app/calendar/redirect'
import {DateChangeButtons} from '@/components/DateChangeButtons'
import {ClientSelect, Grid} from '@/features/calendar/desktop'
import {generateCalendarMonth} from '@/lib/calendar'
import {db} from '@/lib/db'

export const dynamic = 'force-dynamic'

const getUserWithWorkouts = async (
  id: string,
  dateFilter: {gte: Date; lt: Date},
): Promise<{
  user: UserWithWorkouts | null
}> => {
  const user = await db.user.findUnique({
    select: {
      appointments: {
        select: {
          date: true,
          description: true,
          fee: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      bootcamps: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      billingEmail: true,
      credits: true,
      email: true,
      fee: true,
      id: true,
      invoices: {
        select: {
          date: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      name: true,
      role: true,
      type: true,
      workouts: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
    },
    where: {
      id: id,
    },
  })

  return {user}
}

export default async function CalendarPage({
  params,
}: {
  params: {year: string; month: string}
}) {
  const {year, month} = params

  // Parsing year and month to integers and adjusting the month index
  const yearInt = parseInt(year, 10)
  const monthInt = parseInt(month, 10) - 1 // Adjust for zero-index

  let dateFilter = undefined
  // const date = `${year}-${month}`
  // const thisMonth = new Date(date)
  // const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1)

  // Creating dates in UTC for the start of the month and the start of the next month
  const thisMonth = new Date(Date.UTC(yearInt, monthInt, 1, 0, 0, 0))
  const nextMonth = new Date(Date.UTC(yearInt, monthInt + 1, 1, 0, 0, 0))

  // Creating dates for the start of the month and the start of the next month
  // const thisMonth = new Date(yearInt, monthInt)
  // const nextMonth = new Date(yearInt, monthInt + 1)
  // Setting time to midnight to cover the entire day
  // thisMonth.setHours(0, 0, 0, 0)
  // nextMonth.setHours(0, 0, 0, 0)

  const monthData = generateCalendarMonth(month, year)

  console.log({thisMonth})
  console.log({nextMonth})

  dateFilter = {
    gte: thisMonth,
    lt: nextMonth,
  }
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const isAdmin = session.user.role === 'admin'

  const {user} = await getUserWithWorkouts(session.user.id, dateFilter)

  if (!user) {
    return null
  }

  return (
    <div className="flex h-[90vh]">
      <div className="flex w-full flex-col px-5 sm:items-center">
        <Redirect year={year} month={month} />
        <div className="flex w-full flex-col">
          {isAdmin && <ClientSelect year={year} month={month} />}
          <DateChangeButtons year={year} month={month} route="calendar" />
        </div>
        <Grid monthData={monthData} user={user} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
