import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth/next'
import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Redirect from '@/app/calendar/redirect'
import {DateChangeButtons} from '@/components/DateChangeButtons'
import {ClientSelect, Grid} from '@/features/calendar/desktop'
import {generateCalendarMonth} from '@/lib/calendar'
import {db} from '@/lib/db'

// export const dynamic = 'force-dynamic'

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
  params: {year: string; month: string; userId: string}
}) {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin'

  if (!isAdmin) {
    redirect('/')
  }

  const {year, month, userId} = params
  const date = `${year}-${month}`
  const thisMonth = new Date(date)
  const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1)
  const monthData = generateCalendarMonth(month, year)

  const dateFilter = {
    gte: thisMonth,
    lt: nextMonth,
  }

  const {user} = await getUserWithWorkouts(userId, dateFilter)

  if (!user) {
    return null
  }

  // console.log({user})

  return (
    <div className="flex h-[90vh]">
      <div className="flex w-full flex-col px-5 sm:items-center">
        <Redirect year={year} month={month} />
        <div className="flex w-full flex-col">
          <ClientSelect year={year} month={month} />
          <DateChangeButtons
            year={year}
            month={month}
            route="calendar"
            userId={userId}
          />
        </div>
        <Grid monthData={monthData} user={user} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
