'use client'

import {redirect} from 'next/navigation'
import {useSession} from 'next-auth/react'

import {useGetBootcampsQuery} from '@/redux/services/bootcamps'

export default async function Bootcamps() {
  const {data: session, status} = useSession()
  // const {data} = useGetBootcampsQuery()

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    redirect('/')
  }

  return <div>BOOTCAMPS!</div>
}
