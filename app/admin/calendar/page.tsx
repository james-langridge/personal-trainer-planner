import {auth} from '@/auth'
import {CalendarDesktop} from '@/features/calendar/desktop'
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'
import {getPrismaDateFilter} from '@/lib/calendar'
import {getUserEvents} from '@/app/actions/users'
import {getAllBootcamps} from '@/app/actions/bootcamps'

export default async function Page() {
  const queryClient = new QueryClient()
  const session = await auth()
  const userId = session?.user?.id
  const isAdmin = session?.user?.role === 'admin'
  if (!userId) return null

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const dateFilter = getPrismaDateFilter(currentYear, currentMonth)

  await queryClient.prefetchQuery({
    queryKey: ['user-events', userId, dateFilter],
    queryFn: () => getUserEvents({id: userId, dateFilter}),
  })
  await queryClient.prefetchQuery({
    queryKey: ['bootcamps', dateFilter],
    queryFn: () => getAllBootcamps({dateFilter}),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CalendarDesktop
        year={currentYear}
        jsMonth={currentMonth}
        userId={userId}
        isAdmin={isAdmin}
      />
    </HydrationBoundary>
  )
}
