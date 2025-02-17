import {redirect} from 'next/navigation'
import React from 'react'

import {auth} from '@/auth'

export default async function Layout({children}: {children: React.ReactNode}) {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return <div>{children}</div>
}
