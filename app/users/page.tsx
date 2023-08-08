'use client'

import {redirect} from 'next/navigation'
import {useSession} from 'next-auth/react'
import React from 'react'

import {DateChangeButtons} from '@/components/DateChangeButtons'
import Loader from '@/components/Loader'
import {useCalendarData} from '@/features/calendar/desktop'
import {columns} from '@/features/users/summary/Columns'
import {DataTable} from '@/features/users/summary/DataTable'
import {sortByString} from '@/lib/users'
import {useGetUsersQuery} from '@/redux/services/users'

export default function Users() {
  const {data: session, status} = useSession()
  const {year, month, setYear, setMonth} = useCalendarData()
  const {data = [], isFetching} = useGetUsersQuery(`${year}-${month + 1}`)
  const users = sortByString('name', data)

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    redirect('/')
  }

  if (!users) {
    return null
  }

  if (status === 'loading') {
    return <Loader />
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2">
        <DateChangeButtons
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
        />
        {isFetching && (
          <div className="rounded bg-blue-400 px-2 py-1 text-white">
            Fetching data...
          </div>
        )}
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  )
}
