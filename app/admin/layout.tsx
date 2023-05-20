import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth/next'
import React from 'react'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  if (session.user?.role !== 'admin') {
    redirect('/')
  }

  return <>{children}</>
}
