import {useIsMobile} from '@/hooks'

import {useUser} from '.'
import dynamic from 'next/dynamic'

const CalendarMobile = dynamic(() => import('./mobile/CalendarMobile'))
const CalendarDesktop = dynamic(() => import('./desktop/CalendarDesktop'))

export function Calendar({initialUser}: {initialUser: string}) {
  useUser(JSON.parse(initialUser))
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
