'use client'

import {CalendarMedium} from '@/components/CalendarMedium'
import {CalendarMobile} from '@/components/CalendarMobile'
import {useIsMobile, useUser} from '@/hooks'
import {SerialisedUser} from '@/lib/users'
import {useAppSelector} from '@/redux/hooks'

export function Calendar({initialUser}: {initialUser: SerialisedUser}) {
  useUser(initialUser)
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
