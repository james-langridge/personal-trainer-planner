import React from 'react'
import {useLockBodyScroll, useMediaQuery} from '@/hooks'

export function CalendarMedium({
  children,
  isAdmin,
}: {
  children: React.ReactNode
  isAdmin: boolean
}) {
  const isMobile = useMediaQuery('(max-width: 639px)')
  useLockBodyScroll(isMobile)

  if (isMobile && !isAdmin) {
    return null
  }

  return <>{children}</>
}
