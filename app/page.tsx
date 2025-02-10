import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import {CalendarDesktop} from '@/features/calendar/desktop/CalendarDesktop'
import {headers} from 'next/headers'
import CalendarMobileContainer from '@/features/calendar/mobile/CalendarMobileContainer'

function isMobileViewport(userAgent: string): boolean {
  return /Mobile|Android|iPhone/i.test(userAgent)
}

export default async function TrainingStudio() {
  const session = await auth()
  const userId = session?.user?.id
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = isMobileViewport(userAgent)

  if (!userId) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="flex h-[90vh]">
      {isMobile ? (
        <div className="flex w-full flex-col px-5 sm:hidden">
          <CalendarMobileContainer userId={userId} />
        </div>
      ) : (
        <CalendarDesktop userId={userId} />
      )}
    </div>
  )
}
