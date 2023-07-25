import {useUser} from '@/features/calendar'
import {CalendarDesktop} from '@/features/calendar/desktop'
import {CalendarMobile} from '@/features/calendar/mobile'
import {useIsMobile} from '@/hooks'
import {selectIsAdmin} from '@/redux/authSlice'
import {useAppSelector} from '@/redux/hooks'

export function Calendar({initialUser}: {initialUser: string}) {
  useUser(JSON.parse(initialUser))
  const isMobile = useIsMobile()
  const isAdmin = useAppSelector(selectIsAdmin)

  return (
    <div className="flex h-[90vh]">
      <div className="flex w-full flex-col px-5 sm:items-center ">
        {isMobile && !isAdmin && <CalendarMobile />}
        {(!isMobile || isAdmin) && <CalendarDesktop />}
      </div>
    </div>
  )
}
