'use client'

import {useState} from 'react'

import DateProvider from '@/app/admin/users/DateProvider'
import {useAllUsers} from '@/app/hooks/users'
import {DateChangeButtons} from '@/features/calendar/desktop'
import {columns, DataTable} from '@/features/users/summary'
import {DateFilter, getPrismaDateFilter} from '@/lib/calendar'
import {sortByString} from '@/lib/users'

export default function UsersView({
  year,
  jsMonth,
}: {
  year: number
  jsMonth: number
}) {
  const [dateFilter, setDateFilter] = useState<DateFilter>(
    getPrismaDateFilter(year, jsMonth),
  )
  const [date, setDate] = useState(`${year}-${jsMonth + 1}`)
  const {data} = useAllUsers({dateFilter})

  function updateDateFilter(dateFilter: DateFilter) {
    setDateFilter(dateFilter)

    const newYear = dateFilter.gte.getFullYear()
    const newMonth = dateFilter.gte.getMonth() + 1
    setDate(`${newYear}-${newMonth}`)
  }

  // Case-insensitive sorting is not possible via a Prisma query
  // TODO: sanitise the names before saving in the DB
  // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#can-i-perform-case-insensitive-sorting
  if (!data) return null

  const users = sortByString('name', data)

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2">
        <DateChangeButtons
          dateFilter={dateFilter}
          onChange={updateDateFilter}
        />
      </div>
      <DateProvider date={date}>
        <DataTable columns={columns} data={users} />
      </DateProvider>
    </div>
  )
}
