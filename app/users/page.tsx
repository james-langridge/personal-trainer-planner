'use client'

import {redirect} from 'next/navigation'
import {useSession} from 'next-auth/react'
import React from 'react'

import {DateChangeButtons} from '@/components/DateChangeButtons'
import {Fetching} from '@/components/Fetching'
import Loader from '@/components/Loader'
import {useCalendarData} from '@/features/calendar/desktop'
import {columns, DataTable, DateContext} from '@/features/users/summary'
import {sortByString} from '@/lib/users'
import {useGetUsersQuery} from '@/redux/services/users'

export default function Users() {
  const {data: session, status} = useSession()
  const {year, month, setYear, setMonth} = useCalendarData()
  const date = `${year}-${month + 1}`
  const {data = [], isFetching} = useGetUsersQuery(date)
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
        {isFetching && <Fetching />}
      </div>
      <DateContext.Provider value={date}>
        <DataTable columns={columns} data={users} />
      </DateContext.Provider>
    </div>
  )
}
