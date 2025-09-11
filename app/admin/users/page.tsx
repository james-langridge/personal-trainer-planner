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

  const params = {dateFilter}
  await queryClient.prefetchQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersView year={currentYear} jsMonth={currentMonth} />
    </HydrationBoundary>
  )
}
