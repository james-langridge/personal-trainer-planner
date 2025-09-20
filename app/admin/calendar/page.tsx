import {headers} from 'next/headers'
import {CalendarDesktop} from '@/features/calendar/desktop'
import {CalendarMobileAdmin} from '@/features/calendar/mobile/CalendarMobileAdmin'
import {isMobileViewport} from '@/lib/utils'

export default async function Page() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = isMobileViewport(userAgent)

  return isMobile ? (
    <CalendarMobileAdmin year={currentYear} jsMonth={currentMonth} />
  ) : (
    <CalendarDesktop year={currentYear} jsMonth={currentMonth} isAdmin={true} />
  )
}
