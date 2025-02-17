import {auth} from '@/auth'
import {CalendarDesktop} from '@/features/calendar/desktop'

import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'
import {getPrismaDateFilter} from '@/lib/calendar'
import {headers} from 'next/headers'
import {isMobileViewport} from '@/lib/utils'
import CalendarMobile from '@/features/calendar/mobile/CalendarMobile'

import {getAllBootcamps} from '@/app/actions/bootcamps'
import {getUserEvents} from '@/app/actions/users'

export default async function Page() {
  const queryClient = new QueryClient()
  const session = await auth()
  const userId = session?.user?.id

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = isMobileViewport(userAgent)

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const dateFilter = getPrismaDateFilter(currentYear, currentMonth)

  if (!userId) return null

  await queryClient.prefetchQuery({
    queryKey: [
      'user-events',
      userId,
      dateFilter.gte.toISOString(),
      dateFilter.lt.toISOString(),
    ],
    queryFn: () => getUserEvents({id: userId, dateFilter}),
  })
  await queryClient.prefetchQuery({
    queryKey: [
      'bootcamps',
      dateFilter.gte.toISOString(),
      dateFilter.lt.toISOString(),
    ],
    queryFn: () => getAllBootcamps({dateFilter}),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {isMobile ? (
        <CalendarMobile userId={userId} />
      ) : (
        <CalendarDesktop
          year={currentYear}
          jsMonth={currentMonth}
          userId={userId}
          isAdmin={false}
        />
      )}
    </HydrationBoundary>
  )
}
