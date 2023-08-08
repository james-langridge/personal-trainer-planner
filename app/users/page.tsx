'use client'

import {redirect} from 'next/navigation'
import {useSession} from 'next-auth/react'
import React from 'react'

import Loader from '@/components/Loader'
import {columns} from '@/features/users/summary/Columns'
import {DataTable} from '@/features/users/summary/DataTable'
import {sortByString} from '@/lib/users'
import {useGetUsersQuery} from '@/redux/services/users'

export default function Users() {
  const {data: session, status} = useSession()
  const {data = []} = useGetUsersQuery()
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
      <DataTable columns={columns} data={users} />
    </div>
  )
}
