'use client'

import DateProvider from '@/app/(restricted)/users/DateProvider'
import {useState} from 'react'
import {DateFilter, getPrismaDateFilter} from '@/lib/calendar'
import {DateChangeButtons} from '@/features/calendar/desktop'
import {useAllBootcampsFull} from '@/app/api/hooks/bootcamps'
import {DataTable} from '@/features/bootcamps/summary/DataTable'
import {columns} from '@/features/bootcamps/summary/Columns'

export default function BootcampsView({
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
  const {data} = useAllBootcampsFull({dateFilter})

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2">
        <DateChangeButtons
          dateFilter={dateFilter}
          onChange={updateDateFilter}
        />
      </div>
      <DateProvider date={date}>
        <DataTable columns={columns} data={data} />
      </DateProvider>
    </div>
  )
}
