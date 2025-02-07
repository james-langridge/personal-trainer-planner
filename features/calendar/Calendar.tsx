import {useIsMobile} from '@/hooks'

import {useUser} from '.'
import dynamic from 'next/dynamic'
import {UserWithWorkouts} from '@/@types/apiResponseTypes'

const CalendarMobile = dynamic(() => import('./mobile/CalendarMobile'))
const CalendarDesktop = dynamic(() => import('./desktop/CalendarDesktop'))

export function Calendar({initialUser}: {initialUser: UserWithWorkouts}) {
  useUser(initialUser)
  const isMobile = useIsMobile()

  return (
    <div className="flex h-[90vh]">
      <div className="flex w-full flex-col px-5 sm:items-center ">
        {isMobile && <CalendarMobile />}
        {!isMobile && <CalendarDesktop />}
      </div>
    </div>
  )
}
