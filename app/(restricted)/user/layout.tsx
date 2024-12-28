import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth/next'
import React from 'react'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'

export default async function Layout({children}: {children: React.ReactNode}) {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'admin') {
    redirect('/')
  }

  return <div>{children}</div>
}
