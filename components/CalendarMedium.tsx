import React from 'react'

import {useIsMobile} from '@/hooks'
import {useAppSelector} from '@/redux/hooks'

export function CalendarMedium({children}: {children: React.ReactNode}) {
  const {isAdmin} = useAppSelector(state => state.auth)
  const isMobile = useIsMobile()

  // TODO: Admin view is not optimised for mobile
  if (isMobile && !isAdmin) {
    return null
  }

  return <>{children}</>
}
