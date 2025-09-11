import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'

import {getBootcamps} from '@/app/actions/bootcamps'
import BootcampsView from '@/app/admin/bootcamps/BootcampsView'
import {getPrismaDateFilter} from '@/lib/calendar'

export default async function Page() {
  const queryClient = new QueryClient()

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const dateFilter = getPrismaDateFilter(currentYear, currentMonth)

  await queryClient.prefetchQuery({
    queryKey: [
      'bootcamps',
      dateFilter.gte.toISOString(),
      dateFilter.lt.toISOString(),
    ],
    queryFn: () => getBootcamps({dateFilter}),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BootcampsView year={currentYear} jsMonth={currentMonth} />
    </HydrationBoundary>
  )
}
