'use client'

import {redirect} from 'next/navigation'
import {useSession} from 'next-auth/react'
import React from 'react'

import Loader from '@/components/Loader'
import {columns} from '@/features/users/summary/Columns'
import {DataTable} from '@/features/users/summary/DataTable'
import {useGetUsersQuery} from '@/redux/apiSlice'

export default function Users() {
  const {data: session, status} = useSession()
  const {data} = useGetUsersQuery()

  if (!data) {
    return null
  }

  if (status === 'loading') {
    return <Loader />
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
