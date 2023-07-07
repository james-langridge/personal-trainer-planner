import {CalendarMedium, CalendarMobile} from '@/components/calendar'
import {useIsMobile, useUser} from '@/hooks'
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
        {(!isMobile || isAdmin) && <CalendarMedium />}
      </div>
    </div>
  )
}
