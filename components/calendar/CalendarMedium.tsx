import React from 'react'
import {useLockBodyScroll} from '@/hooks'
import {useIsMobile} from '@/hooks'

export function CalendarMedium({
  children,
  isAdmin,
}: {
  children: React.ReactNode
  isAdmin?: boolean
}) {
  const isMobile = useIsMobile()
  useLockBodyScroll()

  // TODO: Admin view is not optimised for mobile
  if (isMobile && !isAdmin) {
    return null
  }

  return <>{children}</>
}
