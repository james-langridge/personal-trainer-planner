import {getServerSession} from 'next-auth/next'
import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {CalendarMobile} from '@/features/calendar/mobile'
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
  let dateFilter = undefined
  const date = `${year}-${month}`
  const thisMonth = new Date(date)
  const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1)

  dateFilter = {
    gte: thisMonth,
    lt: nextMonth,
  }
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const {user} = await getUserWithWorkouts(session.user.id, dateFilter)

  if (!user) {
    return null
  }

  return (
    <div className="flex h-[90vh]">
      <div className="flex w-full flex-col px-5 sm:items-center">
        <CalendarMobile user={user} date={date} />
      </div>
    </div>
  )
}
