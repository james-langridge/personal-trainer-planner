import {useSession} from 'next-auth/react'
import React from 'react'

import {useLockBodyScroll} from '@/hooks'
import {useIsMobile} from '@/hooks'

export function CalendarMedium({children}: {children: React.ReactNode}) {
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const isMobile = useIsMobile()
  useLockBodyScroll()

  // TODO: Admin view is not optimised for mobile
  if (isMobile && !isAdmin) {
    return null
  }

  return <>{children}</>
}
