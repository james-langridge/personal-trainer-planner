import {getBootcamps} from '@/app/actions/bootcamps'
import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {CalendarContent} from '@/features/calendar/mobile/CalendarContent'

export default async function CalendarMobileContainer({
  user,
}: {
  user: UserWithWorkouts
}) {
  const allBootcamps = await getBootcamps()

  return <CalendarContent user={user} allBootcamps={allBootcamps} />
}
