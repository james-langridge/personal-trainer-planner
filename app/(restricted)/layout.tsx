import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import {ReactNode} from 'react'

export default async function RootLayout({children}: {children: ReactNode}) {
  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'
  if (!isAdmin) {
    redirect('/api/auth/signin')
  }

  return <>{children}</>
}
