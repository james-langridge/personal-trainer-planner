import {CalendarDesktop} from '@/features/calendar/desktop'
import {CalendarMobile} from '@/features/calendar/mobile'
import {useIsMobile} from '@/hooks'

import {useUser} from '.'

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
