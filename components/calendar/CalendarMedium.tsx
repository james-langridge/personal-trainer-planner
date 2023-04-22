import React from 'react'
import {useLockBodyScroll} from '@/hooks'
import {useIsMobile} from '@/hooks'

export function CalendarMedium({children}: {children: React.ReactNode}) {
  const isMobile = useIsMobile()
  useLockBodyScroll()

  if (isMobile) {
    return null
  }

  return <>{children}</>
}
