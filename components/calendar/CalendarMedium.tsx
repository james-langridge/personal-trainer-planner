import React from 'react'
import {useLockBodyScroll} from '@/hooks'
import {useIsMobile} from '@/hooks'

export function CalendarMedium({
  children,
  isAdmin,
}: {
  children: React.ReactNode
  isAdmin: boolean
}) {
  const isMobile = useIsMobile()
  useLockBodyScroll()

  if (isMobile && !isAdmin) {
    return null
  }

  return <>{children}</>
}
