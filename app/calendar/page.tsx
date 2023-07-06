'use client'

import {CalendarMedium, CalendarMobile} from '@/components/calendar'
import {useIsMobile} from '@/hooks'
import {useAppSelector} from '@/redux/hooks'

export default function Calendar() {
  const isMobile = useIsMobile()
  const isAdmin = useAppSelector(state => state.auth.isAdmin)

  return (
    <div className="flex h-[90vh]">
      <div className="flex w-full flex-col px-5 sm:items-center ">
        {isMobile && !isAdmin && <CalendarMobile />}
        {(!isMobile || isAdmin) && <CalendarMedium />}
      </div>
    </div>
  )
}
