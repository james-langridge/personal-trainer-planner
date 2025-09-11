import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'

import {getUsers} from '@/app/actions/users'
import UsersView from '@/app/admin/users/UsersView'
import {getPrismaDateFilter} from '@/lib/calendar'

export default async function Page() {
  const queryClient = new QueryClient()

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const dateFilter = getPrismaDateFilter(currentYear, currentMonth)

  await queryClient.prefetchQuery({
    queryKey: [
      'users',
      dateFilter.gte.toISOString(),
      dateFilter.lt.toISOString(),
    ],
    queryFn: () => getUsers({dateFilter}),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersView year={currentYear} jsMonth={currentMonth} />
    </HydrationBoundary>
  )
}
