'use client'

import {redirect} from 'next/navigation'

import {useMediaQuery} from '@/hooks'

export default function Redirect({year, month}: {year: string; month: string}) {
  const isMobile = useMediaQuery('(max-width: 639px)')

  if (isMobile) {
    redirect(`/calendar/m/${year}/${month}`)
  }

  return null
}
