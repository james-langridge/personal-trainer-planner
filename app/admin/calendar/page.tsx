import {CalendarDesktop} from '@/features/calendar/desktop'

export default async function Page() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  return (
    <CalendarDesktop year={currentYear} jsMonth={currentMonth} isAdmin={true} />
  )
}
