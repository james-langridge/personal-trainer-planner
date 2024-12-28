import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import DateProvider from '@/app/(restricted)/users/[year]/[month]/DateProvider'
import {DateChangeButtons} from '@/components/DateChangeButtons'
import {columns, DataTable} from '@/features/users/summary'
import {db} from '@/lib/db'
import {sortByString} from '@/lib/users'

async function getUsers(dateFilter: {gte: Date; lt: Date}): Promise<{
  users: UserWithWorkouts[]
}> {
  const users: UserWithWorkouts[] = await db.user.findMany({
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
  })

  return {users}
}

export default async function Users({
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

  const {users: data} = await getUsers(dateFilter)

  // Case-insensitive sorting is not possible via a Prisma query
  // TODO: sanitise the names before saving in the DB
  // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#can-i-perform-case-insensitive-sorting
  const users = sortByString('name', data)

  if (!users) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2">
        <DateChangeButtons year={year} month={month} />
      </div>
      <DateProvider date={date}>
        <DataTable columns={columns} data={users} />
      </DateProvider>
    </div>
  )
}
