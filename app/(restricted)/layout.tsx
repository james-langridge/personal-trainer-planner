import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import {ReactNode} from 'react'

export default async function RootLayout({children}: {children: ReactNode}) {
  const session = await auth()
  if (!session) {
    redirect('/api/auth/signin')
  }

  return <>{children}</>
}
