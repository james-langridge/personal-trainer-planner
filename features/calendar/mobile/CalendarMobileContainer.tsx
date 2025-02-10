import {getBootcamps} from '@/app/actions/bootcamps'
import {User} from '@/@types/apiResponseTypes'
import {CalendarMobile} from '@/features/calendar/mobile/CalendarMobile'
import {generateCalendarMonth} from '@/lib/calendar'

export default async function CalendarMobileContainer({user}: {user: User}) {
  const allBootcamps = await getBootcamps()
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const monthData = generateCalendarMonth(currentMonth, currentYear)

  return (
    <CalendarMobile
      user={user}
      allBootcamps={allBootcamps}
      initialData={monthData}
    />
  )
}
