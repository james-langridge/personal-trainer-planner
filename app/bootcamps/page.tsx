'use client'

import {redirect} from 'next/navigation'
import {useSession} from 'next-auth/react'
import React from 'react'

import Loader from '@/components/Loader'
import {columns} from '@/features/bootcamps/summary/Columns'
import {DataTable} from '@/features/bootcamps/summary/DataTable'
import {useGetBootcampsQuery} from '@/redux/services/bootcamps'

export default async function Bootcamps() {
  const {data: session, status} = useSession()
  const {data} = useGetBootcampsQuery()

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    redirect('/')
  }

  if (!data) {
    return null
  }

  if (status === 'loading') {
    return <Loader />
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
