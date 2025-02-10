import {redirect} from 'next/navigation'

import {auth} from '@/auth'
import {CalendarDesktop} from '@/features/calendar/desktop/CalendarDesktop'
import {headers} from 'next/headers'
import CalendarMobileContainer from '@/features/calendar/mobile/CalendarMobileContainer'
import {getUser} from '@/app/actions/users'

function isMobileViewport(userAgent: string): boolean {
  return /Mobile|Android|iPhone/i.test(userAgent)
}

export default async function TrainingStudio() {
  const session = await auth()
  const {user} = await getUser(session?.user?.id)
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = isMobileViewport(userAgent)

  if (!user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="flex h-[90vh]">
      {isMobile ? (
        <div className="flex w-full flex-col px-5 sm:hidden">
          <CalendarMobileContainer user={user} />
        </div>
      ) : (
        <CalendarDesktop userId={user.id} />
      )}
    </div>
  )
}
